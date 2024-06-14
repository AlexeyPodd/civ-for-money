from datetime import timedelta

from rest_framework import mixins, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet, ModelViewSet

from steam_auth.models import Wallet
from .models import Rules, Game
from .pagination import GameListPagination
from .permissions import RulesPermission
from .serializers import RulesSerializer, GameReadSerializer, GameWriteSerializer
from .web3.api import DuelsSmartContractViewAPI


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_game_types(request):
    return Response(Game.GameTitle.choices)


class RulesViewSet(ModelViewSet):
    serializer_class = RulesSerializer
    permission_classes = (RulesPermission,)

    def get_queryset(self):
        queryset = Rules.objects.all()
        if self.action in ['list', 'destroy', 'update']:
            queryset = queryset.filter(creator=self.request.user, deleted=False)

        return queryset

    def perform_destroy(self, instance):
        instance.deleted = True
        instance.save()

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.games.exists():
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
        if self.action in ['list', 'retrieve', 'lobby']:
            return GameReadSerializer
        else:
            return GameWriteSerializer

    def create(self, request, *args, **kwargs):
        game_index = request.data['game_index']

        if Game.objects.filter(game_index=game_index).exists():
            return Response(status=status.HTTP_400_BAD_REQUEST)

        contract_view = DuelsSmartContractViewAPI(game_index)
        try:
            contract_view.fetch_game_info()
        except ValueError:
            return Response(status=status.HTTP_404_NOT_FOUND)

        host_wallet, created = Wallet.objects.get_or_create(owner=request.user, address=contract_view.host)

        game_data = {
            **request.data,
            'host': host_wallet.pk,
            'player2': None,
            'bet': contract_view.bet,
            'started': contract_view.started,
            'closed': contract_view.closed,
            'dispute': contract_view.dispute,
            'host_vote': contract_view.hostVote,
            'player2_vote': contract_view.player2Vote,
            'play_period': timedelta(seconds=contract_view.playPeriod),
            'time_start': None,
        }

        serializer = self.get_serializer(data=game_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(methods=['GET'], detail=False)
    def lobby(self, request):
        queryset = Game.objects.filter(player2__isnull=True)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
