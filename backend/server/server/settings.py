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

CORS_ALLOWED_ORIGINS = ['http://localhost:5173']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    "corsheaders",
    'rest_framework',
    'rest_framework.authtoken',
    'steam_auth',
    'game',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    "corsheaders.middleware.CorsMiddleware",
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
    # Use Django's standard `django.contrib.auth` permissions,
    # or allow read-only access for unauthenticated users.
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        # 'rest_framework.authentication.BasicAuthentication',
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

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

STEAM_API_KEY = os.environ.get('STEAM_API_KEY')

STEAM_LOGIN_URL = 'https://steamcommunity.com/openid/login'
STEAM_GET_PLAYER_SUMMARIES_URL = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/'


# Web3 settings
ALCHEMY_HTTP_ADDRESS = os.environ.get('ALCHEMY_HTTP_ADDRESS')
DUEL_ABI = ('[{"inputs":[{"internalType":"address","name":"_arbiter","type":"address"},{"internalType":"address","name"'
            ':"_beneficiary","type":"address"}],"stateMutability":"payable","type":"constructor"},{"anonymous":false,"i'
            'nputs":[{"indexed":false,"internalType":"uint256","name":"","type":"uint256"}],"name":"Approved","type":"e'
            'vent"},{"inputs":[],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inpu'
            'ts":[],"name":"arbiter","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability'
            '":"view","type":"function"},{"inputs":[],"name":"beneficiary","outputs":[{"internalType":"address","name":'
            '"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"depositor","outputs'
            '":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"in'
            'puts":[],"name":"isApproved","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability"'
            ':"view","type":"function"}]')
