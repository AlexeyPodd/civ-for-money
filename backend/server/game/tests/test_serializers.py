from datetime import timedelta

from django.test import TestCase

from steam_auth.models import User, Wallet
from ..models import Rules, Game
from ..serializers import RulesSerializer, GameReadSerializer, GameListReadSerializer, GameWriteSerializer


class TestSerializers(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.admin = User.objects.create_user(uuid=1, username='test_admin')
        cls.user = User.objects.create_user(uuid=2, username='test_user')
        cls.admin_wallet = Wallet.objects.create(address='0x1', owner=cls.admin)
        cls.user_wallet = Wallet.objects.create(address='0x2', owner=cls.user)
        cls.rules_1 = Rules.objects.create(title='rules1', creator=cls.admin, description='this is first test rules.')
        cls.rules_2 = Rules.objects.create(title='rules2', creator=cls.user, description='this is second test rules.')

    def test_RulesSerializer(self):
        expected_data = [
            {'id': self.rules_1.id,
             'title': 'rules1',
             'description': 'this is first test rules.'},
            {'id': self.rules_2.id,
             'title': 'rules2',
             'description': 'this is second test rules.'},
        ]

        data = RulesSerializer([self.rules_1, self.rules_2], many=True).data

        self.assertEqual(data, expected_data)

    def test_GameReadSerializer(self):
        game_1 = Game.objects.create(
            game_index=1,
            title='game1',
            rules=self.rules_1,
            host=self.admin_wallet,
            player2=self.user_wallet,
            bet=100,
            play_period=timedelta(days=3),
        )
        expected_data = {
            'id': game_1.id,
            'game_index': 1,
            'title': 'game1',
            'game': "('CHSS', 'Chess')",
            'rules': {
                'id': self.rules_1.id,
                'title': 'rules1',
                'description': 'this is first test rules.',
            },
            'host': {
                'address': '0x1',
                'owner': {
                    'uuid': '1',
                    'username': 'test_admin',
                    'avatar': '',
                    'victories': 0,
                    'defeats': 0,
                    'draws': 0,
                },
            },
            'player2': {
                'address': '0x2',
                'owner': {
                    'uuid': '2',
                    'username': 'test_user',
                    'avatar': '',
                    'victories': 0,
                    'defeats': 0,
                    'draws': 0,
                },
            },
            'bet': 100,
            'started': False,
            'closed': False,
            'dispute': False,
            'time_creation': game_1.time_creation.isoformat()[:-6] + 'Z',
            'play_period': timedelta(days=3).total_seconds() * 1000,
            'time_start': None,
            'host_vote': 0,
            'player2_vote': 0,
            'winner': None,
            }

        data = GameReadSerializer(game_1).data

        self.assertEqual(data, expected_data)

    def test_GameListReadSerializer(self):
        game_1 = Game.objects.create(
            game_index=1,
            title='game1',
            rules=self.rules_1,
            host=self.admin_wallet,
            player2=self.user_wallet,
            bet=100,
            play_period=timedelta(days=3),
        )
        game_2 = Game.objects.create(
            game_index=2,
            title='game2',
            rules=self.rules_2,
            host=self.user_wallet,
            player2=self.admin_wallet,
            bet=120,
            play_period=timedelta(days=4),
        )
        expected_data = [
            {
                'game_index': 1,
                'title': 'game1',
                'game': "('CHSS', 'Chess')",
                'host': {
                    'address': '0x1',
                    'owner': {
                        'uuid': '1',
                        'username': 'test_admin',
                        'avatar': '',
                        'victories': 0,
                        'defeats': 0,
                        'draws': 0,
                    },
                },
                'player2': {
                    'address': '0x2',
                    'owner': {
                        'uuid': '2',
                        'username': 'test_user',
                        'avatar': '',
                        'victories': 0,
                        'defeats': 0,
                        'draws': 0,
                    },
                },
                'bet': 100,
                'started': False,
                'closed': False,
                'dispute': False,
                'play_period': timedelta(days=3).total_seconds() * 1000,
                'time_start': None,
                'host_vote': 0,
                'player2_vote': 0,
                'winner': None,
            },
            {
                'game_index': 2,
                'title': 'game2',
                'game':  "('CHSS', 'Chess')",
                'host': {
                    'address': '0x2',
                    'owner': {
                        'uuid': '2',
                        'username': 'test_user',
                        'avatar': '',
                        'victories': 0,
                        'defeats': 0,
                        'draws': 0,
                    },
                },
                'player2': {
                    'address': '0x1',
                    'owner': {
                        'uuid': '1',
                        'username': 'test_admin',
                        'avatar': '',
                        'victories': 0,
                        'defeats': 0,
                        'draws': 0,
                    },
                },
                'bet': 120,
                'started': False,
                'closed': False,
                'dispute': False,
                'play_period': timedelta(days=4).total_seconds() * 1000,
                'time_start': None,
                'host_vote': 0,
                'player2_vote': 0,
                'winner': None,
                },
        ]

        data = GameListReadSerializer([game_1, game_2], many=True).data

        self.assertEqual(data, expected_data)

    def test_GameWriteSerializer(self):
        serializer = GameWriteSerializer(
            data={
                'game_index': 3,
                'title': 'game3',
                'game': 'CHSS',
                'rules': self.rules_1.pk,
                'host': self.admin_wallet.pk,
                'bet': 200,
                'play_period': timedelta(days=5),
            }
        )
        expecting_result = {
            'game_index': 3,
            'title': 'game3',
            'game': 'CHSS',
            'rules': self.rules_1,
            'host': self.admin_wallet,
            'player2': None,
            'bet': 200,
            'started': False,
            'closed': False,
            'dispute': False,
            'play_period': timedelta(days=5),
            'time_start': None,
            'host_vote': 0,
            'player2_vote': 0,
            'winner': None,
        }

        serializer.is_valid(raise_exception=True)
        serializer.save()

        game = Game.objects.last()

        for field, value in expecting_result.items():
            self.assertEqual(getattr(game, field), value)
