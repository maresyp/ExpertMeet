# Generated by Django 5.0.3 on 2024-03-27 19:13

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('receiver', models.UUIDField(editable=False, unique=True)),
                ('registration_date', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
