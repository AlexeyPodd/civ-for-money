from rest_framework import serializers

from steam_auth.serializers import WalletSerializer
from .models import Rules, Game


class RulesSerializer(serializers.ModelSerializer):
    creator = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Rules
        fields = ('id', 'title', 'description', 'creator')


class GameReadSerializer(serializers.ModelSerializer):
    host = WalletSerializer(read_only=True)
    player2 = WalletSerializer(read_only=True)
    rules = RulesSerializer(read_only=True)
    game = serializers.SerializerMethodField()
    time_creation = serializers.SerializerMethodField()
    play_period = serializers.SerializerMethodField()

    class Meta:
        model = Game
        fields = '__all__'

    def get_game(self, obj):
        return obj.get_game_display()

    def get_time_creation(self, obj):
        return round(obj.time_creation.timestamp() * 1000)

    def get_play_period(self, obj):
        return obj.play_period.total_seconds()


class GameWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = '__all__'
