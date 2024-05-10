from django.urls import path

from steam_auth.views import login, logout, get_user_data

urlpatterns = [
    path('login/', login, name='login'),
    path('logout/', logout, name='logout'),
    path('user-data/', get_user_data, name='user-data'),
]
