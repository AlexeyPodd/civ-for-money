from rest_framework import serializers

from .models import Rules


class RulesSerializer(serializers.ModelSerializer):
    creator = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Rules
        fields = ('id', 'title', 'description', 'creator')
