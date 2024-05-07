import re

from server.settings import STEAM_LOGIN_URL, STEAM_GET_PLAYER_SUMMARIES_URL, STEAM_API_KEY
import requests


def validate_steam_login(params):
    params['openid.mode'] = 'check_authentication'
    response = requests.post(STEAM_LOGIN_URL, params)

    return bool(re.search(r'is_valid:true', response.text))


def get_steam_user_data(uuid):
    params_string = f"?key={STEAM_API_KEY}&steamids={uuid}"
    response = requests.get(STEAM_GET_PLAYER_SUMMARIES_URL + params_string)
    return response.json()['response']['players'][0]
