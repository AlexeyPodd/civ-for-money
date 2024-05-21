from rest_framework import mixins, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet, ModelViewSet

from .models import Rules, Game
from .permissions import RulesPermission
from .serializers import RulesSerializer, GameSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_game_types(request):
    return Response(Game.GameTitle.choices)


class RulesViewSet(ModelViewSet):
    serializer_class = RulesSerializer
    permission_classes = (RulesPermission,)

    def get_queryset(self):
        queryset = Rules.objects.all()
        if self.action == 'list':
            queryset = queryset.filter(creator=self.request.user, deleted=False)

        return queryset

    def perform_destroy(self, instance):
        instance.deleted = True
        instance.save()


class GameViewSet(mixins.CreateModelMixin,
                  mixins.RetrieveModelMixin,
                  mixins.UpdateModelMixin,
                  mixins.ListModelMixin,
                  GenericViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    serializer_class = GameSerializer
    queryset = Game.objects.all()
