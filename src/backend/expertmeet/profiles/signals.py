from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from profiles.models import Profile


@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):  # noqa: ARG001
    """Used for creation of Profiles for newly created users"""
    if created:
        user = instance
        Profile.objects.create(
            user=user,
        )
