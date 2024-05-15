from rest_framework import mixins
from rest_framework.viewsets import GenericViewSet

from .models import Rules
from .permissions import RulesPermission
from .serializers import RulesSerializer


class RulesViewSet(mixins.CreateModelMixin,
                   mixins.RetrieveModelMixin,
                   mixins.DestroyModelMixin,
                   mixins.ListModelMixin,
                   GenericViewSet):
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
