# Generated by Django 5.0.4 on 2024-06-13 14:33

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0008_remove_game_sc_address_game_bet_game_game_index_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='game',
            name='time_expire',
        ),
        migrations.AddField(
            model_name='game',
            name='play_period',
            field=models.DurationField(default=datetime.timedelta(days=3)),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='game',
            name='time_start',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
