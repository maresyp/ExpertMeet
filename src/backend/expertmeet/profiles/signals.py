from django.contrib.auth.models import User
from django.db.models import Avg
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver
from profiles.models import Profile, Review, ReviewSummary


@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):  # noqa: ARG001
    """Used for creation of Profiles for newly created users"""
    if created:
        user = instance
        Profile.objects.create(
            user=user,
        )

@receiver(post_save, sender=Profile)
def create_reviews_summary(sender, instance, created, **kwargs):  # noqa: ARG001
    """Used for creation of ReviewSummary for newly created profiles"""
    if created:
        profile = instance
        ReviewSummary.objects.create(
            profile=profile,
        )


@receiver([post_save, post_delete], sender=Review)
def update_reviews_summary(sender, instance, created=None, **kwargs):  # noqa: ARG001
    """Each time Review is created or modified, corresponding ReviewSummary needs to be updated"""
    reviews = Review.objects.filter(profile=instance.profile)
    ratings_mean = reviews.aggregate(Avg("rating"))["rating__avg"] or 0
    ratings_count = reviews.count()
    ReviewSummary.objects.filter(profile=instance.profile).update(
        ratings_mean=ratings_mean,
        ratings_count=ratings_count,
    )
