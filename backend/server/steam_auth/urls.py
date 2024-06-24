from django.urls import path

from .views import (login, logout, get_user_data, register_wallet, ban_user, unban_user, warn_user,
                    check_wallet_registration)

app_name = 'auth'

urlpatterns = [
    path('login/', login, name='login'),
    path('logout/', logout, name='logout'),
    path('user-data/', get_user_data, name='user-data'),
    path('check-wallet-registration/', check_wallet_registration, name='check-wallet-registration'),
    path('register-wallet/', register_wallet, name='register-wallet'),
    path('ban/', ban_user, name='ban-user'),
    path('unban/', unban_user, name='unban-user'),
    path('warn-user/', warn_user, name='warn-user'),
]
