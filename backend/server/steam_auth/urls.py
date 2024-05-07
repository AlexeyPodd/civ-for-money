from django.urls import path

from steam_auth.views import login, logout

urlpatterns = [
    path('login/', login, name='login'),
    path('logout/', logout, name='logout'),

]
