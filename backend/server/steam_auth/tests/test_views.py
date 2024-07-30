import json
from unittest.mock import patch, ANY

from django.urls import reverse
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from ..models import User, Wallet
from ..serializers import UserSerializer, WalletShortSerializer


class TestLoginView(APITestCase):
    @patch('steam_auth.views.validate_steam_login')
    def test_not_valid_steam_login(self, mock_validate):
        mock_validate.return_value = False

        url = reverse('auth:login')
        response = self.client.post(
            url,
            json.dumps({'login_data': 'not_valid_data'}),
            content_type='application/json',
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch('steam_auth.views.get_steam_user_data')
    @patch('steam_auth.views.validate_steam_login')
    def test_getting_not_valid_user_data(self, mock_validate, mock_get_user_data):
        mock_validate.return_value = True
        mock_get_user_data.side_effect = ValueError('error1')

        url = reverse('auth:login')
        response = self.client.post(
            url,
            json.dumps({'openid.claimed_id': 'https://steamcommunity.com/openid/id/15'}),
            content_type='application/json',
        )

        mock_get_user_data.assert_called_with('15')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertJSONEqual(response.content, {'detail': 'error1'})

    @patch('steam_auth.views.get_steam_user_data')
    @patch('steam_auth.views.validate_steam_login')
    def test_updating_user_info(self, mock_validate, mock_get_user_data):
        user = User.objects.create_user(uuid=11, username='test_user')

        mock_validate.return_value = True
        mock_get_user_data.return_value = {'personaname': 'Bob', 'avatar': 'aVa'}

        url = reverse('auth:login')
        self.client.post(
            url,
            json.dumps({'openid.claimed_id': 'https://steamcommunity.com/openid/id/11'}),
            content_type='application/json',
        )

        mock_get_user_data.assert_called_with('11')

        user.refresh_from_db()

        self.assertEqual(user.username, 'Bob')
        self.assertEqual(user.avatar, 'aVa')

    @patch('steam_auth.views.get_steam_user_data')
    @patch('steam_auth.views.validate_steam_login')
    def test_creating_user(self, mock_validate, mock_get_user_data):
        mock_validate.return_value = True
        mock_get_user_data.return_value = {'personaname': 'Bob', 'avatar': 'aVa'}

        self.assertFalse(User.objects.filter(uuid='11').exists())

        url = reverse('auth:login')
        self.client.post(
            url,
            json.dumps({'openid.claimed_id': 'https://steamcommunity.com/openid/id/11'}),
            content_type='application/json',
        )

        mock_get_user_data.assert_called_with('11')

        self.assertTrue(User.objects.filter(uuid='11').exists())
        user = User.objects.get(uuid='11')

        self.assertEqual(user.username, 'Bob')
        self.assertEqual(user.avatar, 'aVa')

    @patch('steam_auth.views.get_steam_user_data')
    @patch('steam_auth.views.validate_steam_login')
    def test_correct_response_data(self, mock_validate, mock_get_user_data):
        expected_data = {
            'uuid': '11',
            'token': ANY,
            'avatar': 'aVa',
            'username': 'Bob',
            'banned': False,
        }

        mock_validate.return_value = True
        mock_get_user_data.return_value = {'personaname': 'Bob', 'avatar': 'aVa'}

        url = reverse('auth:login')
        response = self.client.post(
            url,
            json.dumps({'openid.claimed_id': 'https://steamcommunity.com/openid/id/11'}),
            content_type='application/json',
        )

        self.assertEqual(response.data, expected_data)

    def test_get_request_not_supported(self):
        url = reverse('auth:login')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)


class TestLogout(APITestCase):
    def test_not_authenticated(self):
        url = reverse('auth:logout')
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_request_not_supported(self):
        user = User.objects.create_user(uuid=12, username='test_user')
        self.client.force_authenticate(user=user)
        url = reverse('auth:logout')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_token_deleting(self):
        user = User.objects.create_user(uuid=12, username='test_user')
        token, created = Token.objects.get_or_create(user=user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)

        url = reverse('auth:logout')
        response = self.client.delete(url)

        self.assertFalse(Token.objects.filter(user=user).exists())
        self.assertEqual(response.data, {'logout_complete': True})


class TestGetUserData(APITestCase):
    def test_no_uuid_and_not_authenticated_response_400(self):
        url = reverse('auth:user-data')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_not_integer_uuid_response_400(self):
        url = reverse('auth:user-data') + '?uuid=some_uuid'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_not_registered_user_uuid_response_404(self):
        url = reverse('auth:user-data') + '?uuid=12345678901112131'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    @patch('steam_auth.views.get_steam_user_data')
    def test_steam_not_have_this_user_data_response_404(self, mock_get_user_data):
        mock_get_user_data.side_effect = ValueError('error1')

        user = User.objects.create_user(uuid=12345678901112131, username='test_user')
        url = reverse('auth:user-data') + f'?uuid={user.uuid}'
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, {'detail': 'error1'})

    @patch('steam_auth.views.get_steam_user_data')
    def test_steam_returns_not_valid_user_data(self, mock_get_user_data):
        mock_get_user_data.return_value = {
            'personaname': 'Bob',
            'avatar': 'aVa',
            'avatarfull': 'aVaVa',
        }

        user = User.objects.create_user(uuid=12345678901112131, username='test_user')
        url = reverse('auth:user-data') + f'?uuid={user.uuid}'
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {'avatar': ANY, 'avatar_full': ANY})

    @patch('steam_auth.views.get_steam_user_data')
    def test_updating_from_steam_and_retrieving_user_data(self, mock_get_user_data):
        mock_get_user_data.return_value = {
            'personaname': 'Bob',
            'avatar': 'https://avatars.akamai.steamstatic.com/81f4aa0aa8aa24639651d46d6e92077ed2550c7b_full.jpg',
            'avatarfull': 'https://avatars.akamai.steamstatic.com/81f4aa0aa8aa24639651d46d6e92077ed2550c7b_full.jpg',
        }

        user = User.objects.create_user(uuid=12345678901112131, username='test_user')
        url = reverse('auth:user-data') + f'?uuid={user.uuid}'
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user.refresh_from_db()
        serializer = UserSerializer(instance=user)
        self.assertEqual(user.username, 'Bob')
        self.assertEqual(response.data, serializer.data)

    @patch('steam_auth.views.get_steam_user_data')
    def test_updating_from_steam_and_retrieving_self_user_data(self, mock_get_user_data):
        mock_get_user_data.return_value = {
            'personaname': 'Bob',
            'avatar': 'https://avatars.akamai.steamstatic.com/81f4aa0aa8aa24639651d46d6e92077ed2550c7b_full.jpg',
            'avatarfull': 'https://avatars.akamai.steamstatic.com/81f4aa0aa8aa24639651d46d6e92077ed2550c7b_full.jpg',
        }

        user = User.objects.create_user(uuid=12345678901112131, username='test_user')
        url = reverse('auth:user-data')
        self.client.force_authenticate(user=user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user.refresh_from_db()
        serializer = UserSerializer(instance=user)
        self.assertEqual(user.username, 'Bob')
        self.assertEqual(response.data, serializer.data)


class TestGetUserDataByAddress(APITestCase):
    def test_not_specified_address_response_404(self):
        url = reverse('auth:user-data-by-address')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_not_not_registered_address_response_404(self):
        user = User.objects.create_user(uuid=17, username='test_user')
        wallet = Wallet.objects.create(owner=user, address='0x'+'1'*40)

        url = reverse('auth:user-data-by-address') + f'?address={wallet.address[:-1] + "2"}'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_getting_user_data(self):
        user = User.objects.create_user(uuid=17, username='test_user')
        wallet = Wallet.objects.create(owner=user, address='0x' + '1' * 40)

        url = reverse('auth:user-data-by-address') + f'?address={wallet.address}'
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        serializer = WalletShortSerializer(instance=wallet)
        self.assertEqual(response.data, serializer.data)


class TestCheckWalletRegistration(APITestCase):
    def test_not_authorized_response_401(self):
        url = reverse('auth:check-wallet-registration')
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_method_not_allowed_response_405(self):
        user = User.objects.create_user(uuid=21, username='test_user')
        self.client.force_authenticate(user=user)

        url = reverse('auth:check-wallet-registration')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_address_not_specified_response_404(self):
        user = User.objects.create_user(uuid=21, username='test_user')
        self.client.force_authenticate(user=user)

        url = reverse('auth:check-wallet-registration')
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_address_not_registered_response_404(self):
        user = User.objects.create_user(uuid=21, username='test_user')
        self.client.force_authenticate(user=user)

        url = reverse('auth:check-wallet-registration')
        response = self.client.post(
            url,
            json.dumps({'address': '0x' + '1'*40}),
            content_type='application/json',
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_validating_address_registration(self):
        user = User.objects.create_user(uuid=21, username='test_user')
        wallet = Wallet.objects.create(owner=user, address= '0x' + '1'*40)
        self.client.force_authenticate(user=user)

        url = reverse('auth:check-wallet-registration')
        response = self.client.post(
            url,
            json.dumps({'address': wallet.address}),
            content_type='application/json',
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class TestRegisterWallet(APITestCase):
    def test_not_authorized_response_401(self):
        url = reverse('auth:register-wallet')
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_method_not_allowed_response_405(self):
        user = User.objects.create_user(uuid=25, username='test_user')
        self.client.force_authenticate(user=user)

        url = reverse('auth:register-wallet')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    @patch('steam_auth.views.recover_address')
    def test_not_specified_signature_and_message_response_400(self, mock_recover_address):
        mock_recover_address.side_effect = Exception('some exception')

        user = User.objects.create_user(uuid=25, username='test_user')
        self.client.force_authenticate(user=user)

        url = reverse('auth:register-wallet')
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch('steam_auth.views.recover_address')
    def test_creating_wallet(self, mock_recover_address):
        mock_recover_address.return_value = '0x' + '2'*40

        user = User.objects.create_user(uuid=25, username='test_user')
        self.client.force_authenticate(user=user)

        url = reverse('auth:register-wallet')
        response = self.client.post(
            url,
            json.dumps({'message': 'message', 'signature': 'signature'}),
            content_type='application/json',
        )

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertTrue(Wallet.objects.filter(owner=user, address='0x' + '2'*40).exists())

    @patch('steam_auth.views.recover_address')
    def test_updating_wallet_owner(self, mock_recover_address):
        mock_recover_address.return_value = '0x' + '2' * 40

        user1 = User.objects.create_user(uuid=31, username='test_user1')
        wallet = Wallet.objects.create(owner=user1, address='0x' + '2' * 40)
        user2 = User.objects.create_user(uuid=32, username='test_user2')
        self.client.force_authenticate(user=user2)

        url = reverse('auth:register-wallet')
        response = self.client.post(
            url,
            json.dumps({'message': 'message', 'signature': 'signature'}),
            content_type='application/json',
        )

        wallet.refresh_from_db()

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(wallet.owner, user2)


class TestBanUser(APITestCase):
    def test_not_authorized_response_401(self):
        url = reverse('auth:ban-user')
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_not_admin_user_response_403(self):
        user = User.objects.create_user(uuid=25, username='test_user')
        self.client.force_authenticate(user=user)

        url = reverse('auth:ban-user')
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_method_not_allowed_response_405(self):
        user = User.objects.create_user(uuid=25, username='test_user')
        user.is_staff = True
        user.save()
        self.client.force_authenticate(user=user)

        url = reverse('auth:ban-user')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_not_valid_uuid_response_400(self):
        user = User.objects.create_user(uuid=25, username='test_user')
        user.is_staff = True
        user.save()
        self.client.force_authenticate(user=user)

        url = reverse('auth:ban-user')
        response = self.client.post(
            url,
            json.dumps({'uuid': 'uuid'}),
            content_type='application/json',
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_not_registered_user_uuid_response_404(self):
        user = User.objects.create_user(uuid=25, username='test_user')
        user.is_staff = True
        user.save()
        self.client.force_authenticate(user=user)

        url = reverse('auth:ban-user')
        response = self.client.post(
            url,
            json.dumps({'uuid': '108'}),
            content_type='application/json',
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_banned(self):
        user = User.objects.create_user(uuid=25, username='test_user')
        user.is_staff = True
        user.save()
        self.client.force_authenticate(user=user)

        user_to_ban = User.objects.create_user(uuid=35, username='user_to_baN')

        url = reverse('auth:ban-user')
        response = self.client.post(
            url,
            json.dumps({'uuid': user_to_ban.uuid}),
            content_type='application/json',
        )

        user_to_ban.refresh_from_db()
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertTrue(user_to_ban.banned)


class TestUnbanUser(APITestCase):
    def test_not_authorized_response_401(self):
        url = reverse('auth:unban-user')
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_not_admin_user_response_403(self):
        user = User.objects.create_user(uuid=25, username='test_user')
        self.client.force_authenticate(user=user)

        url = reverse('auth:unban-user')
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_method_not_allowed_response_405(self):
        user = User.objects.create_user(uuid=25, username='test_user')
        user.is_staff = True
        user.save()
        self.client.force_authenticate(user=user)

        url = reverse('auth:unban-user')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_not_valid_uuid_response_400(self):
        user = User.objects.create_user(uuid=25, username='test_user')
        user.is_staff = True
        user.save()
        self.client.force_authenticate(user=user)

        url = reverse('auth:unban-user')
        response = self.client.post(
            url,
            json.dumps({'uuid': 'uuid'}),
            content_type='application/json',
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_not_registered_user_uuid_response_404(self):
        user = User.objects.create_user(uuid=25, username='test_user')
        user.is_staff = True
        user.save()
        self.client.force_authenticate(user=user)

        url = reverse('auth:unban-user')
        response = self.client.post(
            url,
            json.dumps({'uuid': '108'}),
            content_type='application/json',
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_unbanned(self):
        user = User.objects.create_user(uuid=25, username='test_user')
        user.is_staff = True
        user.save()
        self.client.force_authenticate(user=user)

        user_to_ban = User.objects.create_user(uuid=35, username='user_to_unbaN', banned=True)

        url = reverse('auth:unban-user')
        response = self.client.post(
            url,
            json.dumps({'uuid': user_to_ban.uuid}),
            content_type='application/json',
        )

        user_to_ban.refresh_from_db()
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(user_to_ban.banned)


class TestWarnUser(APITestCase):
    def test_not_authorized_response_401(self):
        url = reverse('auth:warn-user')
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_not_admin_user_response_403(self):
        user = User.objects.create_user(uuid=25, username='test_user')
        self.client.force_authenticate(user=user)

        url = reverse('auth:warn-user')
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_method_not_allowed_response_405(self):
        user = User.objects.create_user(uuid=25, username='test_user')
        user.is_staff = True
        user.save()
        self.client.force_authenticate(user=user)

        url = reverse('auth:warn-user')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_not_valid_uuid_response_400(self):
        user = User.objects.create_user(uuid=25, username='test_user')
        user.is_staff = True
        user.save()
        self.client.force_authenticate(user=user)

        url = reverse('auth:warn-user')
        response = self.client.post(
            url,
            json.dumps({'uuid': 'uuid'}),
            content_type='application/json',
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_not_registered_user_uuid_response_404(self):
        user = User.objects.create_user(uuid=25, username='test_user')
        user.is_staff = True
        user.save()
        self.client.force_authenticate(user=user)

        url = reverse('auth:warn-user')
        response = self.client.post(
            url,
            json.dumps({'uuid': '108'}),
            content_type='application/json',
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_warned(self):
        user = User.objects.create_user(uuid=25, username='test_user')
        user.is_staff = True
        user.save()
        self.client.force_authenticate(user=user)

        user_to_warn = User.objects.create_user(uuid=35, username='user_to_unbaN', banned=True)

        url = reverse('auth:warn-user')
        response = self.client.post(
            url,
            json.dumps({'uuid': user_to_warn.uuid, 'description': 'test_warning'}),
            content_type='application/json',
        )

        user_to_warn.refresh_from_db()
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertTrue(user_to_warn.warnings.exists())
        self.assertEqual(user_to_warn.warnings.first().reason, 'test_warning')
        self.assertEqual(user_to_warn.warnings.first().creator, user)
