from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.db import models


class User(AbstractUser):
    """Overrides the standard user by adding fields"""
    uuid = models.CharField(max_length=17, null=True, unique=True, validators=[RegexValidator(regex=r'^\d{17}$')])
    avatar = models.URLField(max_length=128, blank=True)
    victories = models.PositiveSmallIntegerField(default=0)
    defeats = models.PositiveSmallIntegerField(default=0)
    draws = models.PositiveSmallIntegerField(default=0)
    banned = models.BooleanField(default=False)

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
