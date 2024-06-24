from rest_framework import serializers

from steam_auth.serializers import WalletShortSerializer
from .models import Rules, Game


class RulesSerializer(serializers.ModelSerializer):
    creator = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Rules
        fields = ('id', 'title', 'description', 'creator')


class GameReadSerializer(serializers.ModelSerializer):
    host = WalletShortSerializer(read_only=True)
    player2 = WalletShortSerializer(read_only=True)
    winner = WalletShortSerializer(read_only=True)
    rules = RulesSerializer(read_only=True)
    game = serializers.SerializerMethodField()
    time_start = serializers.SerializerMethodField()
    play_period = serializers.SerializerMethodField()

    class Meta:
        model = Game
        fields = '__all__'

    def get_game(self, obj):
        return obj.get_game_display()

    def get_time_start(self, obj):
        return round(obj.time_start.timestamp() * 1000) if obj.time_start else None

    def get_play_period(self, obj):
        return obj.play_period.total_seconds() * 1000


class GameListReadSerializer(serializers.ModelSerializer):
    host = WalletShortSerializer(read_only=True)
    player2 = WalletShortSerializer(read_only=True)
    winner = WalletShortSerializer(read_only=True)
    game = serializers.SerializerMethodField()
    time_start = serializers.SerializerMethodField()
    play_period = serializers.SerializerMethodField()

    class Meta:
        model = Game
        fields = ("game_index", "title", "game", "host", "player2", "bet", "started", "closed", "dispute",
                  "play_period", "time_start", "host_vote", "player2_vote", "winner")

    def get_game(self, obj):
        return obj.get_game_display()

    def get_time_start(self, obj):
        return round(obj.time_start.timestamp() * 1000) if obj.time_start else None

    def get_play_period(self, obj):
        return obj.play_period.total_seconds() * 1000


class GameWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = '__all__'
