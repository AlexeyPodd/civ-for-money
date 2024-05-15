from django.urls import path, include
from rest_framework.routers import SimpleRouter

from .views import RulesViewSet

app_name = 'game'

rules_router = SimpleRouter()
rules_router.register(r'rules', RulesViewSet, basename='rules')


urlpatterns = [
    path('', include(rules_router.urls)),
]