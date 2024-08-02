# TODO: send notification to user when new appointment is created

from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Schedule


@receiver(post_save, sender=User)
def create_schedule(sender, instance, created, **kwargs):  # noqa: ARG001
    """Used for creation of Profiles for newly created users"""
    if created:
        user = instance
        Schedule.objects.create(
            owner=user,
        )
