from ..models import PreBanWarning, User, Wallet
from ..serializers import WarningSerializer, UserSerializer, WalletSerializer, UserShortSerializer, \
    WalletShortSerializer
from django.test import TestCase


class TestSerializers(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.admin = User.objects.create_user(uuid=1, username='test_admin')
        cls.user = User.objects.create_user(uuid=2, username='test_user')

    def test_WarningSerializer(self):
        warning_1 = PreBanWarning.objects.create(user=self.user, creator=self.admin, reason='fyva')
        warning_2 = PreBanWarning.objects.create(user=self.user, creator=self.admin, reason='fyva 30')
        expected_data = [
            {'id': warning_1.id,
             'reason': 'fyva',
             'time_creation': warning_1.time_creation.isoformat()[:-6] + 'Z'},
            {'id': warning_2.id,
             'reason': 'fyva 30',
             'time_creation': warning_2.time_creation.isoformat()[:-6] + 'Z'},
        ]

        data = WarningSerializer([warning_1, warning_2], many=True).data

        self.assertEqual(data, expected_data)

    def test_UserSerializer(self):
        expected_data = [
            {'uuid': '1',
             'username': 'test_admin',
             'avatar': '',
             'avatar_full': '',
             'victories': 0,
             'defeats': 0,
             'draws': 0,
             'banned': False,
             'warnings': []},
            {'uuid': '2',
             'username': 'test_user',
             'avatar': '', 'avatar_full': '',
             'victories': 0,
             'defeats': 0,
             'draws': 0,
             'banned': False,
             'warnings': []},
        ]

        data = UserSerializer([self.admin, self.user], many=True).data

        self.assertEqual(data, expected_data)

    def test_WalletSerializer(self):
        wallet_1 = Wallet.objects.create(address='0x1', owner=self.admin)
        wallet_2 = Wallet.objects.create(address='0x2', owner=self.user)
        expected_data = [
            {'address': '0x1',
             'owner': {
                 'uuid': '1',
                 'username': 'test_admin',
                 'avatar': '',
                 'avatar_full': '',
                 'victories': 0,
                 'defeats': 0,
                 'draws': 0,
                 'banned': False,
                 'warnings': []
            }},
            {'address': '0x2',
             'owner': {
                 'uuid': '2',
                 'username': 'test_user',
                 'avatar': '',
                 'avatar_full': '',
                 'victories': 0,
                 'defeats': 0,
                 'draws': 0,
                 'banned': False,
                 'warnings': [],
             }},
        ]

        data = WalletSerializer([wallet_1, wallet_2], many=True).data

        self.assertEqual(data, expected_data)

    def test_UserShortSerializer(self):
        expected_data = [
            {'uuid': '1',
             'username': 'test_admin',
             'avatar': '',
             'victories': 0,
             'defeats': 0,
             'draws': 0},
            {'uuid': '2',
             'username': 'test_user',
             'avatar': '',
             'victories': 0,
             'defeats': 0,
             'draws': 0},
        ]

        data = UserShortSerializer([self.admin, self.user], many=True).data

        self.assertEqual(data, expected_data)

    def test_WalletShortSerializer(self):
        wallet_1 = Wallet.objects.create(address='0x1', owner=self.admin)
        wallet_2 = Wallet.objects.create(address='0x2', owner=self.user)
        expected_data = [
            {'address': '0x1',
             'owner': {
                 'uuid': '1',
                 'username': 'test_admin',
                 'avatar': '',
                 'victories': 0,
                 'defeats': 0,
                 'draws': 0,
            }},
            {'address': '0x2',
             'owner': {
                 'uuid': '2',
                 'username': 'test_user',
                 'avatar': '',
                 'victories': 0,
                 'defeats': 0,
                 'draws': 0,
             }},
        ]

        data = WalletShortSerializer([wallet_1, wallet_2], many=True).data

        self.assertEqual(data, expected_data)
