import json
from datetime import timedelta
from unittest.mock import patch, ANY

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from ..models import Game, Rules
from steam_auth.models import User, Wallet
from ..serializers import RulesSerializer, GameWriteSerializer, GameReadSerializer, GameListReadSerializer


class TestGetGameTypes(APITestCase):
    def test_not_authorized_response_401(self):
        url = reverse('game:game-types')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_game_types(self):
        user = User.objects.create_user(uuid=125, username='test_user')
        self.client.force_authenticate(user=user)

        url = reverse('game:game-types')
        response = self.client.get(url)

        self.assertEqual(response.data, Game.GameTitle.choices)


class TestRulesViewSet(APITestCase):
    def test_retrieve_by_not_authenticated_user_deleted_rule_success(self):
        user = User.objects.create_user(uuid=125, username='test_user')
        rules = Rules.objects.create(title='title', creator=user, description='', deleted=True)

        url = reverse('game:rules-detail', kwargs={'pk': rules.pk})
        response = self.client.get(url)

        serializer = RulesSerializer(instance=rules)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)

    def test_retrieve_list_of_rules_contains_only_requesters_rules(self):
        user = User.objects.create_user(uuid=125, username='test_user')
        user2 = User.objects.create_user(uuid=126, username='test_user_2')
        Rules.objects.create(title='title1', creator=user, description='')
        Rules.objects.create(title='title2', creator=user, description='')
        Rules.objects.create(title='title3', creator=user, description='')
        rule4 = Rules.objects.create(title='title4', creator=user2, description='')
        rule5 = Rules.objects.create(title='title5', creator=user2, description='')

        self.client.force_authenticate(user=user2)

        url = reverse('game:rules-list')
        response = self.client.get(url)

        serializer = RulesSerializer([rule4, rule5], many=True)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)

    def test_delete_is_destroying_if_rule_is_NOT_used_in_any_game(self):
        user = User.objects.create_user(uuid=125, username='test_user')
        rule = Rules.objects.create(title='title1', creator=user, description='')

        self.client.force_authenticate(user=user)

        url = reverse('game:rules-detail', kwargs={'pk': rule.pk})
        self.client.delete(url)

        self.assertFalse(Rules.objects.filter(pk=rule.pk).exists())

    def test_delete_is_marking_instead_of_destroying_if_rule_is_used_in_any_game(self):
        user = User.objects.create_user(uuid=125, username='test_user')
        rule = Rules.objects.create(title='title1', creator=user, description='')
        Game.objects.create(
            game_index=1,
            title='test_game',
            rules=rule,
            host=Wallet.objects.create(owner=user, address='0x'+'1'*40),
            bet=10000000,
            play_period=timedelta(days=3),
        )

        self.client.force_authenticate(user=user)

        url = reverse('game:rules-detail', kwargs={'pk': rule.pk})
        self.client.delete(url)

        self.assertTrue(Rules.objects.filter(pk=rule.pk).exists())
        self.assertTrue(Rules.objects.get(pk=rule.pk).deleted)

    def test_delete_is_declined_if_rule_is_created_by_another_player(self):
        user = User.objects.create_user(uuid=125, username='test_user')
        user2 = User.objects.create_user(uuid=126, username='test_user')
        rule = Rules.objects.create(title='title1', creator=user, description='')

        self.client.force_authenticate(user=user2)

        url = reverse('game:rules-detail', kwargs={'pk': rule.pk})
        response = self.client.delete(url)

        self.assertTrue(Rules.objects.filter(pk=rule.pk).exists())
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_data_if_rule_is_NOT_used_in_any_game_success(self):
        user = User.objects.create_user(uuid=125, username='test_user')
        rule = Rules.objects.create(title='title1', creator=user, description='')

        self.client.force_authenticate(user=user)

        url = reverse('game:rules-detail', kwargs={'pk': rule.pk})
        response = self.client.put(url, {'title': 'new_title', 'description': '1'})

        rule.refresh_from_db()
        serializer = RulesSerializer(instance=rule)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(rule.title, 'new_title')
        self.assertEqual(rule.description, '1')

    def test_update_data_if_rule_is_used_in_any_game_marks_current_rule_as_deleted_and_creates_new_one(self):
        user = User.objects.create_user(uuid=125, username='test_user')
        rule = Rules.objects.create(title='title1', creator=user, description='')
        Game.objects.create(
            game_index=1,
            title='test_game',
            rules=rule,
            host=Wallet.objects.create(owner=user, address='0x'+'1'*40),
            bet=10000000,
            play_period=timedelta(days=3),
        )

        self.client.force_authenticate(user=user)

        url = reverse('game:rules-detail', kwargs={'pk': rule.pk})
        response = self.client.put(url, {'title': 'new_title', 'description': '1'})

        self.assertTrue(Rules.objects.filter(pk=rule.pk).exists())
        self.assertTrue(Rules.objects.get(pk=rule.pk).deleted)

        new_rule = Rules.objects.last()
        self.assertEqual(new_rule.title, 'new_title')
        self.assertEqual(new_rule.description, '1')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_update_is_declined_if_rule_is_created_by_another_player(self):
        user = User.objects.create_user(uuid=125, username='test_user')
        user2 = User.objects.create_user(uuid=126, username='test_user')
        rule = Rules.objects.create(title='title1', creator=user, description='')

        self.client.force_authenticate(user=user2)

        url = reverse('game:rules-detail', kwargs={'pk': rule.pk})
        response = self.client.put(url, {'title': 'new_title', 'description': '1'})

        self.assertTrue(Rules.objects.filter(pk=rule.pk).exists())
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class TestGameViewSet(APITestCase):
    def test_create_not_authorized_returns_401(self):
        url = reverse('game:games-list')
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_not_specified_game_index_returns_400(self):
        user = User.objects.create_user(uuid=125, username='test_user')
        self.client.force_authenticate(user=user)

        url = reverse('game:games-list')
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_with_existing_game_index_returns_400(self):
        user = User.objects.create_user(uuid=125, username='test_user')
        rule = Rules.objects.create(title='title1', creator=user, description='')
        game = Game.objects.create(
            game_index=1,
            title='test_game',
            rules=rule,
            host=Wallet.objects.create(owner=user, address='0x'+'1'*40),
            bet=10000000,
            play_period=timedelta(days=3),
        )

        self.client.force_authenticate(user=user)
        url = reverse('game:games-list')
        response = self.client.post(
            url,
            json.dumps({'game_index': game.game_index}),
            content_type='application/json',
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch('game.views.DuelsSmartContractViewAPI')
    def test_create_fetching_on_chain_info_raises_ValueError_returns_404(self, mock_chain_api_class):
        mock_chain_api_class.return_value.fetch_game_info.side_effect = ValueError

        user = User.objects.create_user(uuid=125, username='test_user')
        self.client.force_authenticate(user=user)

        url = reverse('game:games-list')
        response = self.client.post(url, json.dumps({'game_index': 12}), content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    @patch('game.views.DuelsSmartContractViewAPI')
    def test_create_host_wallet_not_registered_returns_404(self, mock_chain_api_class):
        mock_chain_api_class.return_value.host = '0x'+'1'*40

        user = User.objects.create_user(uuid=125, username='test_user')
        self.client.force_authenticate(user=user)

        url = reverse('game:games-list')
        response = self.client.post(url, json.dumps({'game_index': 12}), content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    @patch('game.views.DuelsSmartContractViewAPI')
    def test_create_success(self, mock_chain_api_class):
        mock_chain_api_class.return_value.host = '0x'+'1'*40
        mock_chain_api_class.return_value.bet = 1_000
        mock_chain_api_class.return_value.started = False
        mock_chain_api_class.return_value.closed = False
        mock_chain_api_class.return_value.disagreement = False
        mock_chain_api_class.return_value.hostVote = 0
        mock_chain_api_class.return_value.player2Vote = 0
        mock_chain_api_class.return_value.playPeriod = 3_600

        user = User.objects.create_user(uuid=125, username='test_user')
        Wallet.objects.create(owner=user, address='0x'+'1'*40)
        rule = Rules.objects.create(title='title1', creator=user, description='')
        self.client.force_authenticate(user=user)

        url = reverse('game:games-list')
        response = self.client.post(
            url,
            json.dumps({'game_index': 11, 'title': 'test_game', 'rules': rule.pk, 'game': 'CIV5'}),
            content_type='application/json',
        )

        game = Game.objects.last()
        serializer = GameWriteSerializer(instance=game)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data, serializer.data)

    def test_update_not_authorized_returns_401(self):
        url = reverse('game:games-detail', kwargs={'game_index': 15})
        response = self.client.put(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_not_existing_game_returns_404(self):
        user = User.objects.create_user(uuid=125, username='test_user')
        self.client.force_authenticate(user=user)

        url = reverse('game:games-detail', kwargs={'game_index': 15})
        response = self.client.put(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    @patch('game.views.DuelsSmartContractViewAPI')
    def test_update_fetching_on_chain_info_raises_ValueError_returns_404(self, mock_chain_api_class):
        mock_chain_api_class.return_value.fetch_game_info.side_effect = ValueError

        user = User.objects.create_user(uuid=125, username='test_user')
        rule = Rules.objects.create(title='title1', creator=user, description='')
        game = Game.objects.create(
            game_index=1,
            title='test_game',
            rules=rule,
            host=Wallet.objects.create(owner=user, address='0x'+'1'*40),
            bet=10000000,
            play_period=timedelta(days=3),
        )

        self.client.force_authenticate(user=user)
        url = reverse('game:games-detail', kwargs={'game_index': game.game_index})
        response = self.client.put(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    @patch('game.views.DuelsSmartContractViewAPI')
    def test_update_getting_victory_event_data_raises_ValueError_returns_400(self, mock_chain_api_class):
        mock_chain_api_class.return_value.get_event_data.side_effect = ValueError

        user = User.objects.create_user(uuid=125, username='test_user')
        rule = Rules.objects.create(title='title1', creator=user, description='')
        game = Game.objects.create(
            game_index=1,
            title='test_game',
            rules=rule,
            host=Wallet.objects.create(owner=user, address='0x'+'1'*40),
            bet=10000000,
            play_period=timedelta(days=3),
        )

        self.client.force_authenticate(user=user)
        url = reverse('game:games-detail', kwargs={'game_index': game.game_index})
        response = self.client.put(
            url,
            json.dumps({'event': 'Victory'}),
            content_type='application/json',
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch('game.views.DuelsSmartContractViewAPI')
    def test_update_getting_victory_event_data_raises_TypeError_returns_400(self, mock_chain_api_class):
        mock_chain_api_class.return_value.get_event_data.side_effect = TypeError

        user = User.objects.create_user(uuid=125, username='test_user')
        rule = Rules.objects.create(title='title1', creator=user, description='')
        game = Game.objects.create(
            game_index=1,
            title='test_game',
            rules=rule,
            host=Wallet.objects.create(owner=user, address='0x'+'1'*40),
            bet=10000000,
            play_period=timedelta(days=3),
        )

        self.client.force_authenticate(user=user)
        url = reverse('game:games-detail', kwargs={'game_index': game.game_index})
        response = self.client.put(
            url,
            json.dumps({'event': 'Victory'}),
            content_type='application/json',
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch('game.views.DuelsSmartContractViewAPI')
    def test_update_winner_wallet_is_not_registered_returns_404(self, mock_chain_api_class):
        mock_chain_api_class.return_value.get_event_data.return_value.winner = '0x0'

        user = User.objects.create_user(uuid=125, username='test_user')
        rule = Rules.objects.create(title='title1', creator=user, description='')
        game = Game.objects.create(
            game_index=1,
            title='test_game',
            rules=rule,
            host=Wallet.objects.create(owner=user, address='0x'+'1'*40),
            bet=10000000,
            play_period=timedelta(days=3),
        )

        self.client.force_authenticate(user=user)
        url = reverse('game:games-detail', kwargs={'game_index': game.game_index})
        response = self.client.put(
            url,
            json.dumps({'event': 'Victory'}),
            content_type='application/json',
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    @patch('game.views.DuelsSmartContractViewAPI')
    def test_update_player2_wallet_is_not_registered_returns_404(self, mock_chain_api_class):
        mock_chain_api_class.return_value.player2 = '0x' + '2' * 40

        user = User.objects.create_user(uuid=125, username='test_user')
        rule = Rules.objects.create(title='title1', creator=user, description='')
        game = Game.objects.create(
            game_index=1,
            title='test_game',
            rules=rule,
            host=Wallet.objects.create(owner=user, address='0x'+'1'*40),
            bet=10000000,
            play_period=timedelta(days=3),
        )

        self.client.force_authenticate(user=user)
        url = reverse('game:games-detail', kwargs={'game_index': game.game_index})
        response = self.client.put(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    @patch('game.views.DuelsSmartContractViewAPI')
    def test_update_success(self, mock_chain_api_class):
        mock_chain_api_class.return_value.player2 = '0x' + '2' * 40
        mock_chain_api_class.return_value.get_event_data.return_value.winner = '0x' + '2' * 40
        mock_chain_api_class.return_value.bet = 10000000
        mock_chain_api_class.return_value.started = True
        mock_chain_api_class.return_value.closed = True
        mock_chain_api_class.return_value.disagreement = False
        mock_chain_api_class.return_value.hostVote = 2
        mock_chain_api_class.return_value.player2Vote = 1
        mock_chain_api_class.return_value.playPeriod = 259_200
        mock_chain_api_class.return_value.timeStart = 1722325340

        user = User.objects.create_user(uuid=125, username='test_user')
        rule = Rules.objects.create(title='title1', creator=user, description='')
        game = Game.objects.create(
            game_index=1,
            title='test_game',
            rules=rule,
            host=Wallet.objects.create(owner=user, address='0x'+'1'*40),
            bet=10000000,
            play_period=timedelta(days=3),
        )
        user2 = User.objects.create_user(uuid=126, username='test_user_2')
        Wallet.objects.create(owner=user2, address='0x' + '2' * 40)

        self.client.force_authenticate(user=user)
        url = reverse('game:games-detail', kwargs={'game_index': game.game_index})
        response = self.client.put(
            url,
            json.dumps({'event': 'Victory'}),
            content_type='application/json',
        )

        game.refresh_from_db()
        serializer = GameReadSerializer(game)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(game.winner, game.player2)
        self.assertTrue(game.closed)

    def test_lobby_get_not_closed_games_with_not_connected_player2(self):
        user1 = User.objects.create_user(uuid=125, username='test_user')
        user2 = User.objects.create_user(uuid=126, username='test_user')
        rule1 = Rules.objects.create(title='title1', creator=user1, description='')
        rule2 = Rules.objects.create(title='title2', creator=user2, description='')
        user1_wallet = Wallet.objects.create(owner=user1, address='0x'+'1'*40)
        user2_wallet = Wallet.objects.create(owner=user2, address='0x'+'2'*40)

        game1 = Game.objects.create(
            game_index=1,
            title='test_game',
            rules=rule1,
            host=user1_wallet,
            player2=user2_wallet,
            bet=10000000,
            play_period=timedelta(days=3),
        )
        game2 = Game.objects.create(
            game_index=2,
            title='test_game',
            rules=rule1,
            host=user1_wallet,
            bet=10000000,
            play_period=timedelta(days=3),
        )
        game3 = Game.objects.create(
            game_index=3,
            title='test_game',
            rules=rule2,
            host=user2_wallet,
            bet=10000000,
            play_period=timedelta(days=3),
        )
        game4 = Game.objects.create(
            game_index=4,
            title='test_game',
            rules=rule1,
            host=user1_wallet,
            bet=10000000,
            play_period=timedelta(days=3),
            closed=True,
        )

        url = reverse('game:games-lobby')
        response = self.client.get(url)

        serializer = GameListReadSerializer([game2, game3], many=True)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'], serializer.data)

    def test_user_actual_games_requests_not_decimal_uuid_returns_400(self):
        url = reverse('game:games-user-actual-games')
        response = self.client.get(url, {'uuid': 'some_uuid'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_actual_games_requests_not_registered_user_uuid_returns_404(self):
        url = reverse('game:games-user-actual-games')
        response = self.client.get(url, {'uuid': '1234'})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_actual_games_get_not_closed_games_with_requester_as_host_or_player2(self):
        user1 = User.objects.create_user(uuid=125, username='test_user')
        user2 = User.objects.create_user(uuid=126, username='test_user')
        rule1 = Rules.objects.create(title='title1', creator=user1, description='')
        rule2 = Rules.objects.create(title='title2', creator=user2, description='')
        user1_wallet = Wallet.objects.create(owner=user1, address='0x'+'1'*40)
        user2_wallet = Wallet.objects.create(owner=user2, address='0x'+'2'*40)

        game1 = Game.objects.create(
            game_index=1,
            title='test_game',
            rules=rule1,
            host=user1_wallet,
            player2=user2_wallet,
            bet=10000000,
            play_period=timedelta(days=3),
        )
        game2 = Game.objects.create(
            game_index=2,
            title='test_game',
            rules=rule1,
            host=user1_wallet,
            bet=10000000,
            play_period=timedelta(days=3),
        )
        game3 = Game.objects.create(
            game_index=3,
            title='test_game',
            rules=rule2,
            host=user2_wallet,
            player2=user1_wallet,
            bet=10000000,
            play_period=timedelta(days=3),
        )
        game4 = Game.objects.create(
            game_index=4,
            title='test_game',
            rules=rule1,
            host=user1_wallet,
            bet=10000000,
            play_period=timedelta(days=3),
            closed=True,
        )

        url = reverse('game:games-user-actual-games')
        response = self.client.get(url, {'uuid': user1.uuid})

        serializer = GameListReadSerializer([game1, game2, game3], many=True)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'], serializer.data)

    def test_user_closed_games_requests_not_decimal_uuid_returns_400(self):
        url = reverse('game:games-user-closed-games')
        response = self.client.get(url, {'uuid': 'some_uuid'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_closed_games_requests_not_registered_user_uuid_returns_404(self):
        url = reverse('game:games-user-closed-games')
        response = self.client.get(url, {'uuid': '1234'})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_closed_games_get_closed_games_with_requester_as_host_or_player2(self):
        user1 = User.objects.create_user(uuid=125, username='test_user')
        user2 = User.objects.create_user(uuid=126, username='test_user')
        rule1 = Rules.objects.create(title='title1', creator=user1, description='')
        rule2 = Rules.objects.create(title='title2', creator=user2, description='')
        user1_wallet = Wallet.objects.create(owner=user1, address='0x'+'1'*40)
        user2_wallet = Wallet.objects.create(owner=user2, address='0x'+'2'*40)

        game1 = Game.objects.create(
            game_index=1,
            title='test_game',
            rules=rule1,
            host=user1_wallet,
            player2=user2_wallet,
            bet=10000000,
            play_period=timedelta(days=3),
            closed=True,
        )
        game2 = Game.objects.create(
            game_index=2,
            title='test_game',
            rules=rule1,
            host=user1_wallet,
            bet=10000000,
            play_period=timedelta(days=3),
            closed=True,
        )
        game3 = Game.objects.create(
            game_index=3,
            title='test_game',
            rules=rule2,
            host=user2_wallet,
            player2=user1_wallet,
            bet=10000000,
            play_period=timedelta(days=3),
            closed=True,
        )
        game4 = Game.objects.create(
            game_index=4,
            title='test_game',
            rules=rule1,
            host=user1_wallet,
            bet=10000000,
            play_period=timedelta(days=3),
        )

        url = reverse('game:games-user-closed-games')
        response = self.client.get(url, {'uuid': user1.uuid})

        serializer = GameListReadSerializer([game1, game2, game3], many=True)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'], serializer.data)

    def test_disputed_games_get_disputed_games_which_was_not_closed_yet(self):
        user1 = User.objects.create_user(uuid=125, username='test_user')
        user2 = User.objects.create_user(uuid=126, username='test_user')
        rule1 = Rules.objects.create(title='title1', creator=user1, description='')
        rule2 = Rules.objects.create(title='title2', creator=user2, description='')
        user1_wallet = Wallet.objects.create(owner=user1, address='0x'+'1'*40)
        user2_wallet = Wallet.objects.create(owner=user2, address='0x'+'2'*40)

        game1 = Game.objects.create(
            game_index=1,
            title='test_game',
            rules=rule1,
            host=user1_wallet,
            player2=user2_wallet,
            bet=10000000,
            play_period=timedelta(days=3),
        )
        game2 = Game.objects.create(
            game_index=2,
            title='test_game',
            rules=rule1,
            host=user1_wallet,
            bet=10000000,
            play_period=timedelta(days=3),
            dispute=True,
            closed=True,
        )
        game3 = Game.objects.create(
            game_index=3,
            title='test_game',
            rules=rule2,
            host=user2_wallet,
            bet=10000000,
            play_period=timedelta(days=3),
            closed=True,
        )
        game4 = Game.objects.create(
            game_index=4,
            title='test_game',
            rules=rule1,
            host=user1_wallet,
            bet=10000000,
            play_period=timedelta(days=3),
            dispute=True,
        )

        url = reverse('game:games-lobby')
        response = self.client.get(url)

        serializer = GameListReadSerializer([game4], many=True)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'], serializer.data)
