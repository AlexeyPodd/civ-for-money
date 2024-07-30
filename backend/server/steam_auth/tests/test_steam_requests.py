from unittest.mock import patch, Mock

from django.test import SimpleTestCase

from server.settings import STEAM_LOGIN_URL, STEAM_API_KEY, STEAM_GET_PLAYER_SUMMARIES_URL
from steam_auth.steam_requests import validate_steam_login, get_steam_user_data


class TestSteamRequests(SimpleTestCase):
    @patch('requests.post')
    def test_validate_steam_login_call_with_correct_params(self, mock_post):
        mock_response = Mock()
        response_text = "something__is_valid:true__something"
        mock_response.text = response_text
        mock_post.return_value = mock_response

        initial_params = {'first': 'name is Bob', 'second': 'age is 24'}

        updated_params = initial_params.copy()
        updated_params['openid.mode'] = 'check_authentication'

        validate_steam_login(initial_params)

        mock_post.assert_called_with(STEAM_LOGIN_URL, updated_params)

    @patch('requests.post')
    def test_validate_steam_login_validates(self, mock_post):
        mock_response = Mock()
        response_text = "something__is_valid:true__something"
        mock_response.text = response_text
        mock_post.return_value = mock_response

        initial_params = {'first': 'name is Bob', 'second': 'age is 24'}

        is_login_valid = validate_steam_login(initial_params)

        self.assertTrue(is_login_valid)

    @patch('requests.post')
    def test_validate_steam_login_NOT_validates(self, mock_post):
        mock_response = Mock()
        response_text = "something__is_valid:false__something"
        mock_response.text = response_text
        mock_post.return_value = mock_response

        initial_params = {'first': 'name is Bob', 'second': 'age is 24'}

        is_login_valid = validate_steam_login(initial_params)

        self.assertFalse(is_login_valid)

    @patch('requests.get')
    def test_get_steam_user_data_call_with_right_url(self, mock_get):
        get_steam_user_data(15)

        mock_get.assert_called_with(STEAM_GET_PLAYER_SUMMARIES_URL + f"?key={STEAM_API_KEY}&steamids=15")

    @patch('requests.get')
    def test_get_steam_user_data_without_players_data(self, mock_get):
        mock_response = Mock()
        response_dict = {'response': {'players': None}}

        mock_response.json.return_value = response_dict

        mock_get.return_value = mock_response

        with self.assertRaises(ValueError):
            get_steam_user_data(15)

    @patch('requests.get')
    def test_get_steam_user_data_gets_data(self, mock_get):
        expected_data = 'data'
        mock_response = Mock()
        response_dict = {'response': {'players': [expected_data]}}

        mock_response.json.return_value = response_dict

        mock_get.return_value = mock_response

        data = get_steam_user_data(15)

        self.assertEqual(data, expected_data)
