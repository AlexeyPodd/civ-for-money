from django.urls import path, include
from rest_framework.routers import SimpleRouter

from .views import RulesViewSet, GameViewSet

app_name = 'game'

rules_router = SimpleRouter()
rules_router.register(r'rules', RulesViewSet, basename='rules')

game_router = SimpleRouter()
game_router.register(r'games', GameViewSet, basename='games')

urlpatterns = [
    path('', include(rules_router.urls)),
    path('', include(game_router.urls)),
]