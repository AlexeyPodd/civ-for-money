from django.test import SimpleTestCase
from django.urls import reverse, resolve

from ..views import login, logout, get_user_data, get_user_data_by_address, check_wallet_registration, register_wallet, \
    ban_user, unban_user, warn_user


class TestUrls(SimpleTestCase):
    def test_login_url_resolves(self):
        url = reverse('auth:login')
        self.assertEqual(resolve(url).func, login)

    def test_logout_url_resolves(self):
        url = reverse('auth:logout')
        self.assertEqual(resolve(url).func, logout)

    def test_user_data_url_resolves(self):
        url = reverse('auth:user-data')
        self.assertEqual(resolve(url).func, get_user_data)

    def test_user_data_by_address_url_resolves(self):
        url = reverse('auth:user-data-by-address')
        self.assertEqual(resolve(url).func, get_user_data_by_address)

    def test_check_wallet_registration_url_resolves(self):
        url = reverse('auth:check-wallet-registration')
        self.assertEqual(resolve(url).func, check_wallet_registration)

    def test_register_wallet_url_resolves(self):
        url = reverse('auth:register-wallet')
        self.assertEqual(resolve(url).func, register_wallet)

    def test_ban_user_url_resolves(self):
        url = reverse('auth:ban-user')
        self.assertEqual(resolve(url).func, ban_user)

    def test_unban_user_url_resolves(self):
        url = reverse('auth:unban-user')
        self.assertEqual(resolve(url).func, unban_user)

    def test_warn_user_url_resolves(self):
        url = reverse('auth:warn-user')
        self.assertEqual(resolve(url).func, warn_user)
