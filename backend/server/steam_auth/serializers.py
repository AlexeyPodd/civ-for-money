from rest_framework import serializers

from .models import User, Wallet, PreBanWarning


class WarningSerializer(serializers.ModelSerializer):
    class Meta:
        model = PreBanWarning
        fields = ('reason', 'time_creation')


class UserSerializer(serializers.ModelSerializer):
    warnings = WarningSerializer(read_only=True, many=True)

    class Meta:
        model = User
        fields = ('uuid', 'username', 'avatar', 'avatar_full', 'victories',
                  'defeats', 'draws', 'banned', 'warnings')


class WalletSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)

    class Meta:
        model = Wallet
        fields = ('owner', 'address')
