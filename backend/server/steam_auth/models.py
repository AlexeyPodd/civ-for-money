from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.db import models


class User(AbstractUser):
    """Overrides the standard user by adding fields"""
    username = models.CharField(max_length=32)
    uuid = models.CharField(max_length=17, null=True, unique=True, validators=[RegexValidator(regex=r'^\d{17}$')])
    avatar = models.URLField(max_length=128, blank=True)
    avatar_full = models.URLField(max_length=128, blank=True)
    victories = models.PositiveSmallIntegerField(default=0)
    defeats = models.PositiveSmallIntegerField(default=0)
    draws = models.PositiveSmallIntegerField(default=0)
    banned = models.BooleanField(default=False)

    USERNAME_FIELD = "uuid"
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.username


class PreBanWarning(models.Model):
    """Warning that admin can give to player"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='warnings')
    reason = models.CharField(max_length=256)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_warnings')
    time_creation = models.DateTimeField("date of warn", auto_now_add=True)

    class Meta:
        ordering = ['time_creation']


class Wallet(models.Model):
    """Ethereum address recordings of players"""
    address = models.CharField(max_length=42, unique=True, validators=[RegexValidator(regex=r'^0x[a-fA-F0-9]{40}$')])
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="wallets")
