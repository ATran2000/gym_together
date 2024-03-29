# Generated by Django 4.2.7 on 2024-02-04 07:10

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('api_gymsession', '0005_rename_user_gymsession_user_id_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='gymsession',
            old_name='user_id',
            new_name='user',
        ),
        migrations.AlterUniqueTogether(
            name='gymsession',
            unique_together={('user', 'day')},
        ),
    ]
