from datetime import timedelta, datetime

import web3
from django.db.models import Q
from rest_framework import mixins, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet, ModelViewSet

from steam_auth.models import Wallet, User
from .models import Rules, Game
from .pagination import GameListPagination
from .permissions import RulesPermission
from .serializers import RulesSerializer, GameReadSerializer, GameWriteSerializer, GameListReadSerializer
from .web3.api import DuelsSmartContractViewAPI


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_game_types(request):
    return Response(Game.GameTitle.choices)


class RulesViewSet(ModelViewSet):
    """
    Ensures that rules of already created games will not be deleted,
    or modified. Instead, if rule is deleting - it will be marked as deleted,
    and not showing for new games. If rule for existing game is modifying -
    server is creating new one, and 'deleting' old one.
    """

    serializer_class = RulesSerializer
    permission_classes = (RulesPermission,)

    def get_queryset(self):
        queryset = Rules.objects.all()
        if self.action in ['list', 'destroy', 'update']:
            queryset = queryset.filter(creator=self.request.user, deleted=False)

        return queryset

    def perform_destroy(self, instance):
        if instance.games.exists():
            instance.deleted = True
            instance.save()
        else:
            super().perform_destroy(instance)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.games.exists():
            instance.deleted = True
            instance.save()
            return self.create(request, *args, **kwargs)

        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)


class GameViewSet(mixins.CreateModelMixin,
                  mixins.RetrieveModelMixin,
                  mixins.UpdateModelMixin,
                  mixins.ListModelMixin,
                  GenericViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    queryset = Game.objects.all()
    lookup_field = 'game_index'
    pagination_class = GameListPagination

    def get_serializer_class(self):
        match self.action:
            case 'list' | 'lobby' | 'user_actual_games' | 'user_closed_games' | 'disputed_games':
                return GameListReadSerializer
            case 'retrieve':
                return GameReadSerializer
            case 'create' | 'update' | 'update_from_chain':
                return GameWriteSerializer
            case _:
                raise ValueError('no serializer for this request type')

    def create(self, request, *args, **kwargs):
        """
        When new game is creating all on-chain parameters are retrieving for blockchain itself.
        User provides only parameters that are not on-chain, like game title, rules, etc.
        """
        game_index = request.data.get('game_index')

        if game_index is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if Game.objects.filter(game_index=game_index).exists():
            return Response(status=status.HTTP_400_BAD_REQUEST)

        contract_view = DuelsSmartContractViewAPI(game_index)
        try:
            contract_view.fetch_game_info()
        except ValueError:
            return Response({'detail': 'Game not founded on chain.'}, status=status.HTTP_404_NOT_FOUND)

        host_wallet = get_object_or_404(Wallet, owner=request.user, address=contract_view.host)

        game_data = {
            **request.data,
            'host': host_wallet.pk,
            'player2': None,
            'bet': contract_view.bet,
            'started': contract_view.started,
            'closed': contract_view.closed,
            'dispute': contract_view.disagreement,
            'host_vote': contract_view.hostVote,
            'player2_vote': contract_view.player2Vote,
            'play_period': timedelta(seconds=contract_view.playPeriod),
            'time_start': None,
            'winner': None,
        }

        serializer = self.get_serializer(data=game_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """
        this endpoint makes updates from chain on command,
        when some contract method was executed and client reports server about it
        """
        instance = self.get_object()

        # collecting game data from on-chain storage
        contract_view = DuelsSmartContractViewAPI(instance.game_index)
        try:
            contract_view.fetch_game_info()
        except ValueError:
            return Response({'detail': 'Game not founded on chain.'}, status=status.HTTP_404_NOT_FOUND)

        # collecting address of winner from Victory event
        event_type = request.data.get('event')
        block_number = request.data.get('blockNumber')
        if event_type != 'Victory':
            winner_wallet_pk = None
        else:
            try:
                event_data = contract_view.get_event_data(event_type, block_number)
            except (ValueError, TypeError):
                return Response(status=status.HTTP_400_BAD_REQUEST)

            winner_wallet_pk = None if event_data is None \
                else get_object_or_404(Wallet, address=event_data.winner).pk

        # setting player2
        player2_wallet_pk = None if contract_view.player2 == web3.constants.ADDRESS_ZERO \
            else get_object_or_404(Wallet, address=contract_view.player2).pk

        game_data = {
            'player2': player2_wallet_pk,
            'bet': contract_view.bet,
            'started': contract_view.started,
            'closed': contract_view.closed,
            'dispute': contract_view.disagreement,
            'host_vote': contract_view.hostVote,
            'player2_vote': contract_view.player2Vote,
            'play_period': timedelta(seconds=contract_view.playPeriod),
            'time_start':  datetime.utcfromtimestamp(contract_view.timeStart) if contract_view.timeStart else None,
            'winner': winner_wallet_pk,
        }

        serializer = self.get_serializer(instance, data=game_data,  partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(GameReadSerializer(instance).data)

    @action(methods=['GET'], detail=False)
    def lobby(self, request):
        """returns paginated list of games that has open slot for player and are not canceled"""
        queryset = self.__get_list_queryset('lobby', None)
        return self.__get_paginated_response(queryset)

    @action(methods=['GET'], detail=False)
    def user_actual_games(self, request):
        """returns paginated list of user games that was NOT finished or canceled"""
        try:
            uuid = int(self.request.query_params.get('uuid', ''))
        except ValueError:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(User, uuid=uuid)

        queryset = self.__get_list_queryset('user_actual', user)
        return self.__get_paginated_response(queryset)

    @action(methods=['GET'], detail=False)
    def user_closed_games(self, request):
        """returns paginated list of user games that was finished or canceled"""
        try:
            uuid = int(self.request.query_params.get('uuid', ''))
        except ValueError:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(User, uuid=uuid)

        queryset = self.__get_list_queryset('user_closed', user)
        return self.__get_paginated_response(queryset)

    @action(methods=['GET'], detail=False)
    def disputed_games(self, request):
        """returns list of all games that are disputed, but not finished (closed)"""
        queryset = self.__get_list_queryset('disputed_not_closed', None)
        return self.__get_paginated_response(queryset)

    @staticmethod
    def __get_list_queryset(kind, user):
        match kind:
            case "lobby":
                return Game.objects.filter(player2__isnull=True, closed=False)
            case "user_actual":
                return Game.objects.filter(Q(host__owner=user) | Q(player2__owner=user), closed=False)
            case "user_closed":
                return Game.objects.filter(Q(host__owner=user) | Q(player2__owner=user), closed=True)
            case "disputed_not_closed":
                return Game.objects.filter(dispute=True, closed=False)
            case _:
                raise ValueError("wrong kind of list queryset")

    def __get_paginated_response(self, queryset):
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
