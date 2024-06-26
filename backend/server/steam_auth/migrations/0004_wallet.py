# Generated by Django 5.0.4 on 2024-05-15 14:17

import django.core.validators
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('steam_auth', '0003_alter_user_uuid'),
    ]

    operations = [
        migrations.CreateModel(
            name='Wallet',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('address', models.CharField(max_length=42, unique=True, validators=[django.core.validators.RegexValidator(regex='^0x[a-fA-F0-9]{40}$')])),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='wallets', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
