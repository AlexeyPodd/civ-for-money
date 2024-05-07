import re

from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import User
from .steam_requests import validate_steam_login, get_steam_user_data


@api_view(['POST'])
def login(request):
    if not validate_steam_login(request.data.copy()):
        return Response({'error': 'login validation failed'}, status=status.HTTP_400_BAD_REQUEST)

    uuid = re.search(r'https://steamcommunity.com/openid/id/(\d+)', request.data['openid.claimed_id']).group(1)

    # updating user's data from steam
    user_data = get_steam_user_data(uuid)

    # creating user if not exists, or updating user's info
    if User.objects.filter(uuid=uuid).exists():
        user = User.objects.get(uuid=uuid)
        user.username = user_data['personaname']
        user.avatar = user_data['avatar']
        user.save()
    else:
        user = User.objects.create_user(
            uuid=uuid,
            username=user_data['personaname'],
            avatar=user_data['avatar'],
        )

    # granting token
    token, created = Token.objects.get_or_create(user=user)

    return Response({
        'uuid': uuid,
        'token': token.key,
        'avatar': user_data['avatar'],
        'username': user_data['personaname'],
    })


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def logout(request):
    request.auth.delete()
    return Response({'logout_complete': True})
