import uuid

from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils.translation import gettext_lazy as _lazy


class Profile(models.Model):
    class ProfileStatus(models.IntegerChoices):
        PUBLIC = (0, _lazy("Public profile"))
        PRIVATE = (1, _lazy("Private profile"))
        UNDER_REVIEW = (2, _lazy("Profile under review"))
        DISABLED = (3, _lazy("Disabled profile"))

    id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=False)
    is_active = models.BooleanField(default=False)
    is_premium = models.BooleanField(default=False)
    status = models.IntegerField(choices=ProfileStatus, default=ProfileStatus.DISABLED)
    profile_image = models.ImageField(upload_to="profiles", null=True, default="profiles/user-default.png")
    bio = models.CharField(max_length=256, default="", blank=True)
    description = models.CharField(max_length=1028, default="", blank=True)
    category = models.ForeignKey("Category", on_delete=models.DO_NOTHING, null=True, blank=True)

    def __str__(self) -> str:
        return f"Profile of {self.user.email} {self.id}"

class ReviewSummary(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE, primary_key=True)
    ratings_mean = models.FloatField(default=0.0)
    ratings_count = models.IntegerField(default=0)

    def __str__(self) -> str:
        return f"Review summary for {self.profile.user.email} profile"


class Review(models.Model):
    id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False)
    author = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, null=False)
    rating = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(5)])
    content = models.CharField(max_length=256)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.rating} star review for {self.profile.user.email}"

class Category(models.Model):
    id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False)
    name = models.CharField(max_length=64)

    def __str__(self) -> str:
        return f"{self.name} category"
