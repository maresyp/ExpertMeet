# Generated by Django 5.0.3 on 2024-03-21 15:23

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0007_category_profile_category'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='bio',
            field=models.CharField(blank=True, default='', max_length=256),
        ),
        migrations.AlterField(
            model_name='profile',
            name='category',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='profiles.category'),
        ),
        migrations.AlterField(
            model_name='profile',
            name='description',
            field=models.CharField(blank=True, default='', max_length=1028),
        ),
    ]
