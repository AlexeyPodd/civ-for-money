from django.db import models

from steam_auth.models import User, Wallet


class Game(models.Model):
    """Game record"""
    class GameTitle(models.TextChoices):
        CHESS = "CHSS"
        CIVILIZATION_5 = "CIV5"
        CIVILIZATION_6 = "CIV6"
        DOTA_2 = 'DOTA'

    class Vote(models.IntegerChoices):
        NOT_VOTED = 0
        FIRST_PLACE = 1
        SECOND_PLACE = 2
        DRAW = 3

    game_index = models.PositiveIntegerField(unique=True)
    title = models.CharField(max_length=32)
    game = models.CharField(max_length=4, choices=GameTitle.choices, default=GameTitle.choices[0])
    rules = models.ForeignKey('Rules', on_delete=models.PROTECT, related_name='games')
    host = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name='hosted_games')
    player2 = models.ForeignKey(Wallet, on_delete=models.CASCADE, blank=True, null=True, related_name='joined_games')
    bet = models.PositiveBigIntegerField()
    started = models.BooleanField(default=False)
    closed = models.BooleanField(default=False)
    dispute = models.BooleanField(default=False)
    time_creation = models.DateTimeField("creation time", auto_now_add=True)
    play_period = models.DurationField()
    time_start = models.DateTimeField(null=True, blank=True)
    host_vote = models.PositiveSmallIntegerField(choices=Vote, default=Vote.NOT_VOTED)
    player2_vote = models.PositiveSmallIntegerField(choices=Vote, default=Vote.NOT_VOTED)
    winner = models.ForeignKey(Wallet, on_delete=models.CASCADE, null=True, blank=True, related_name='won_games')

    class Meta:
        ordering = ['time_creation']


class Rules(models.Model):
    """Rules, that players can create for their games"""
    title = models.CharField(max_length=32)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='rules')
    description = models.TextField(max_length=2048)
    deleted = models.BooleanField(default=False)

    class Meta:
        verbose_name_plural = 'Rules'
