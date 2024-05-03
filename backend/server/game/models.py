from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator
from django.db import models

from steam_auth.models import User


class Wallet(models.Model):
    """Ethereum address recordings of players"""
    address = models.CharField(max_length=42, unique=True, validators=[RegexValidator(regex=r'^0x[a-fA-F0-9]{40}$')])
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="wallets")


class Game(models.Model):
    """Game record"""
    sc_address = models.CharField(
        verbose_name="smart contract address",
        max_length=42,
        unique=True,
        validators=[RegexValidator(regex=r'^0x[a-fA-F0-9]{40}$')],
    )
    rules = models.ForeignKey('Rules', on_delete=models.PROTECT, related_name='games')
    host = models.ForeignKey(User, on_delete=models.CASCADE, related_name='hosted_games')
    player2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='joined_games')
    started = models.BooleanField(default=False)
    closed = models.BooleanField(default=False)
    dispute = models.BooleanField(default=False)
    time_creation = models.DateTimeField("creation time", auto_now_add=True)

    class Meta:
        ordering = ['time_creation']

    def clean(self):
        if self.host == self.player2:
            raise ValidationError('Host can not appoint himself as player2')


class Rules(models.Model):
    """Rules, that players can create for their games"""
    title = models.CharField(max_length=32)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='rules')
    description = models.TextField(max_length=2048)

    class Meta:
        verbose_name_plural = 'Rules'
