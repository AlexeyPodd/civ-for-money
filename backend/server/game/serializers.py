from rest_framework import serializers
from rest_framework.fields import ChoiceField

from steam_auth.models import User, Wallet
from .models import Rules, Game


class RulesSerializer(serializers.ModelSerializer):
    creator = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Rules
        fields = ('id', 'title', 'description', 'creator')


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('uuid', 'username', 'avatar', 'victories', 'defeats', 'draws', 'banned')


class WalletSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)

    class Meta:
        model = Wallet
        fields = ('owner', 'address')


class GameReadSerializer(serializers.ModelSerializer):
    host = WalletSerializer(read_only=True)
    player2 = WalletSerializer(read_only=True)
    rules = RulesSerializer(read_only=True)
    game = serializers.SerializerMethodField()
    time_creation = serializers.SerializerMethodField()

    class Meta:
        model = Game
        fields = '__all__'

    def get_game(self, obj):
        return obj.get_game_display()

    def get_time_creation(self, obj):
        return round(obj.time_creation.timestamp() * 1000)


class GameWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = '__all__'
