from rest_framework import serializers

from .models import Rules, Game


class RulesSerializer(serializers.ModelSerializer):
    creator = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Rules
        fields = ('id', 'title', 'description', 'creator')


class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = '__all__'

