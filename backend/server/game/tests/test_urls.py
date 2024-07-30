from django.test import SimpleTestCase
from django.urls import reverse, resolve

from ..views import get_game_types, RulesViewSet, GameViewSet


class TestUrls(SimpleTestCase):
    def test_game_types_url(self):
        url = reverse('game:game-types')
        self.assertEqual(resolve(url).func, get_game_types)

    def test_rules_list_url(self):
        url = reverse('game:rules-list')
        self.assertEqual(resolve(url).func.cls, RulesViewSet)

    def test_rules_detail_url(self):
        url = reverse('game:rules-detail', kwargs={'pk': 1})
        self.assertEqual(resolve(url).func.cls, RulesViewSet)

    def test_games_list_url(self):
        url = reverse('game:games-list')
        self.assertEqual(resolve(url).func.cls, GameViewSet)

    def test_games_detail_url(self):
        url = reverse('game:games-detail', kwargs={'game_index': 1})
        self.assertEqual(resolve(url).func.cls, GameViewSet)
