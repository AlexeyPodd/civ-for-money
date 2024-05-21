from django.urls import path, include
from rest_framework.routers import SimpleRouter

from .views import RulesViewSet, GameViewSet, get_game_types

app_name = 'game'

rules_router = SimpleRouter()
rules_router.register(r'rules', RulesViewSet, basename='rules')

game_router = SimpleRouter()
game_router.register(r'games', GameViewSet, basename='games')

urlpatterns = [
    path('game-types/', get_game_types, name='game-types'),
    path('', include(rules_router.urls)),
    path('', include(game_router.urls)),
]