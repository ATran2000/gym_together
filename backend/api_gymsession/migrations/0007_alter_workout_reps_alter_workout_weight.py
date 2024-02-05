# Generated by Django 4.2.7 on 2024-02-05 00:36

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_gymsession', '0006_rename_user_id_gymsession_user_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='workout',
            name='reps',
            field=models.DecimalField(decimal_places=0, max_digits=2, validators=[django.core.validators.MinValueValidator(1)]),
        ),
        migrations.AlterField(
            model_name='workout',
            name='weight',
            field=models.DecimalField(decimal_places=1, max_digits=5, validators=[django.core.validators.MinValueValidator(1)]),
        ),
    ]
