# Generated by Django 5.0.4 on 2024-05-15 15:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0004_delete_wallet'),
    ]

    operations = [
        migrations.AddField(
            model_name='rules',
            name='deleted',
            field=models.BooleanField(default=False),
        ),
    ]
