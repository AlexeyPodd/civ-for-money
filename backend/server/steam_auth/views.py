import re

from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from game.web3.utils import recover_address
from .models import User, Wallet, PreBanWarning
from .serializers import UserSerializer
from .steam_requests import validate_steam_login, get_steam_user_data


@api_view(['POST'])
def login(request):
    if not validate_steam_login(request.data.copy()):
        return Response({'detail': 'Login validation failed.'}, status=status.HTTP_400_BAD_REQUEST)

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
        'banned': user.banned,
    })


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def logout(request):
    request.auth.delete()
    return Response({'logout_complete': True})


@api_view(['GET'])
def get_user_data(request):
    """
    Returns avatar and username on given uuid parameter.
    If uuid was not given - returns uuid, avatar and username of requester (if he is authenticated).
    """
    uuid = request.GET.get('uuid', '')

    if not uuid:
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        uuid = request.user.uuid

    else:
        try:
            uuid = int(uuid)
        except ValueError:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(User, uuid=uuid)

    user_data = get_steam_user_data(uuid)

    serializer = UserSerializer(
        user,
        data={
            'username': user_data['personaname'],
            'avatar': user_data['avatar'],
            'avatar_full': user_data['avatarfull'],
        },
        partial=True,
    )
    serializer.is_valid(raise_exception=True)
    serializer.save()

    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def check_wallet_registration(request):
    """returns response with 4xx status if wallet is not associated with this steam account"""

    address = request.data['address']
    get_object_or_404(Wallet, address=address, owner=request.user)
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def register_wallet(request):
    """associates wallet address wth steam account"""

    try:
        address = recover_address(request.data['message'], request.data['signature'])
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    existed = Wallet.objects.filter(address=address).exists()
    if existed:
        wallet = Wallet.objects.get(address=address)
        if wallet.owner != request.user:
            wallet.owner = request.user
            wallet.save()
    else:
        Wallet.objects.create(address=address, owner=request.user)

    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def ban_user(request):
    try:
        uuid = int(request.data.get('uuid', ''))
    except ValueError:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    user = get_object_or_404(User, uuid=uuid)
    user.banned = True
    user.save()

    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def unban_user(request):
    try:
        uuid = int(request.data.get('uuid', ''))
    except ValueError:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    user = get_object_or_404(User, uuid=uuid)
    user.banned = False
    user.save()

    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def warn_user(request):
    try:
        uuid = int(request.data.get('uuid', ''))
    except ValueError:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    warning_description = request.data.get('description', '')
    user = get_object_or_404(User, uuid=uuid)

    PreBanWarning.objects.create(user=user, reason=warning_description, creator=request.user)

    return Response(status=status.HTTP_204_NO_CONTENT)
