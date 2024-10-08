"""
Django settings for server project.

Generated by 'django-admin startproject' using Django 5.0.4.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.0/ref/settings/
"""
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = (os.getenv('DEBUG', 'False') == 'True')

ALLOWED_HOSTS = []

REACT_APP_DIST = BASE_DIR / "react" / "core"


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework.authtoken',
    'steam_auth',
    'game',
    'react',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'server.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'server.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ]
}

# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

AUTH_USER_MODEL = 'steam_auth.User'

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = 'django_static/'
STATIC_ROOT = 'static'

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

STEAM_API_KEY = os.environ.get('STEAM_API_KEY')

STEAM_LOGIN_URL = 'https://steamcommunity.com/openid/login'
STEAM_GET_PLAYER_SUMMARIES_URL = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/'


# Web3 settings
SMART_CONTRACT_ADDRESS = os.environ.get('SMART_CONTRACT_ADDRESS')
ALCHEMY_HTTP_ADDRESS = os.environ.get('ALCHEMY_HTTP_ADDRESS')
DUELS_V1_ABI = ('[{"inputs": [], "name": "InvalidInitialization", "type": "error"}, {"inputs": [], "name": "NotInitiali'
                'zing", "type": "error"}, {"anonymous": false, "inputs": [{"indexed": false, "internalType": "uint256",'
                ' "name": "id", "type": "uint256"}], "name": "Cancel", "type": "event"}, {"anonymous": false, "inputs":'
                ' [{"indexed": false, "internalType": "uint256", "name": "id", "type": "uint256"}], "name": "Created", '
                '"type": "event"}, {"anonymous": false, "inputs": [{"indexed": false, "internalType": "uint256", "name"'
                ': "id", "type": "uint256"}], "name": "Disagreement", "type": "event"}, {"anonymous": false, "inputs": '
                '[{"indexed": false, "internalType": "uint256", "name": "id", "type": "uint256"}], "name": "Draw", "typ'
                'e": "event"}, {"anonymous": false, "inputs": [{"indexed": false, "internalType": "uint64", "name": "ve'
                'rsion", "type": "uint64"}], "name": "Initialized", "type": "event"}, {"anonymous": false, "inputs": [{'
                '"indexed": false, "internalType": "uint256", "name": "id", "type": "uint256"}, {"indexed": false, "int'
                'ernalType": "address", "name": "player2", "type": "address"}], "name": "Joined", "type": "event"}, {"a'
                'nonymous": false, "inputs": [{"indexed": false, "internalType": "uint256", "name": "id", "type": "uint'
                '256"}], "name": "SlotFreed", "type": "event"}, {"anonymous": false, "inputs": [{"indexed": false, "int'
                'ernalType": "uint256", "name": "id", "type": "uint256"}, {"indexed": false, "internalType": "address",'
                ' "name": "player2", "type": "address"}], "name": "Start", "type": "event"}, {"anonymous": false, "inpu'
                'ts": [{"indexed": false, "internalType": "uint256", "name": "id", "type": "uint256"}, {"indexed": fals'
                'e, "internalType": "address", "name": "winner", "type": "address"}], "name": "Victory", "type": "event'
                '"}, {"inputs": [], "name": "arbiter", "outputs": [{"internalType": "address", "name": "", "type": "add'
                'ress"}], "stateMutability": "view", "type": "function"}, {"inputs": [{"internalType": "uint256", "name'
                '": "_gameIndex", "type": "uint256"}], "name": "cancel", "outputs": [], "stateMutability": "nonpayable"'
                ', "type": "function"}, {"inputs": [], "name": "commissionPercent", "outputs": [{"internalType": "uint8'
                '", "name": "", "type": "uint8"}], "stateMutability": "view", "type": "function"}, {"inputs": [{"intern'
                'alType": "uint256", "name": "_playPeriod", "type": "uint256"}], "name": "createGame", "outputs": [], "'
                'stateMutability": "payable", "type": "function"}, {"inputs": [{"internalType": "uint256", "name": "_ga'
                'meIndex", "type": "uint256"}], "name": "excludePlayer2", "outputs": [], "stateMutability": "nonpayable'
                '", "type": "function"}, {"inputs": [{"internalType": "uint256", "name": "_gameIndex", "type": "uint256'
                '"}, {"internalType": "address", "name": "_winner", "type": "address"}], "name": "forceAppointWinner", '
                '"outputs": [], "stateMutability": "nonpayable", "type": "function"}, {"inputs": [{"internalType": "uin'
                't256", "name": "_gameIndex", "type": "uint256"}], "name": "forceDraw", "outputs": [], "stateMutability'
                '": "nonpayable", "type": "function"}, {"inputs": [{"internalType": "uint256", "name": "", "type": "uin'
                't256"}], "name": "games", "outputs": [{"internalType": "address", "name": "host", "type": "address"}, '
                '{"internalType": "address", "name": "player2", "type": "address"}, {"internalType": "uint256", "name":'
                ' "bet", "type": "uint256"}, {"internalType": "uint256", "name": "timeStart", "type": "uint256"}, {"int'
                'ernalType": "uint256", "name": "playPeriod", "type": "uint256"}, {"internalType": "bool", "name": "sta'
                'rted", "type": "bool"}, {"internalType": "bool", "name": "closed", "type": "bool"}, {"internalType": "'
                'bool", "name": "disagreement", "type": "bool"}, {"internalType": "enum DuelsV1.ResultVote", "name": "h'
                'ostVote", "type": "uint8"}, {"internalType": "enum DuelsV1.ResultVote", "name": "player2Vote", "type":'
                ' "uint8"}], "stateMutability": "view", "type": "function"}, {"inputs": [{"internalType": "uint256", "n'
                'ame": "_minimalBet", "type": "uint256"}, {"internalType": "uint8", "name": "_commissionPercent", "type'
                '": "uint8"}], "name": "initialize", "outputs": [], "stateMutability": "nonpayable", "type": "function"'
                '}, {"inputs": [{"internalType": "uint256", "name": "_gameIndex", "type": "uint256"}], "name": "join", '
                '"outputs": [], "stateMutability": "payable", "type": "function"}, {"inputs": [], "name": "minimalBet",'
                ' "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "'
                'type": "function"}, {"inputs": [{"internalType": "address", "name": "_arbiter", "type": "address"}], "'
                'name": "setArbiter", "outputs": [], "stateMutability": "nonpayable", "type": "function"}, {"inputs": ['
                '{"internalType": "uint8", "name": "_commissionPercent", "type": "uint8"}], "name": "setCommissionPerce'
                'nt", "outputs": [], "stateMutability": "nonpayable", "type": "function"}, {"inputs": [{"internalType":'
                ' "uint256", "name": "_minimalBet", "type": "uint256"}], "name": "setMinimalBet", "outputs": [], "state'
                'Mutability": "nonpayable", "type": "function"}, {"inputs": [{"internalType": "uint256", "name": "_game'
                'Index", "type": "uint256"}], "name": "start", "outputs": [], "stateMutability": "nonpayable", "type": '
                '"function"}, {"inputs": [{"internalType": "uint256", "name": "_gameIndex", "type": "uint256"}, {"inter'
                'nalType": "enum DuelsV1.ResultVote", "name": "_place", "type": "uint8"}], "name": "voteResult", "outpu'
                'ts": [], "stateMutability": "nonpayable", "type": "function"}]')
