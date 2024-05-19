from django.urls import path

from .views import login, logout, get_user_data, register_wallet

app_name = 'auth'

urlpatterns = [
    path('login/', login, name='login'),
    path('logout/', logout, name='logout'),
    path('user-data/', get_user_data, name='user-data'),
    path('register-wallet/', register_wallet, name='register-wallet'),
]
