import uuid

from django.contrib.auth.models import User
from django.db import models


class Profile(models.Model):
    id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True)
    is_active = models.BooleanField(default=False)
    is_premium = models.BooleanField(default=False)
    profile_image = models.ImageField(upload_to="profiles", null=True, default="profiles/user-default.png")

    def __str__(self) -> str:
        return f"Profile of {self.user.username} {self.id}"
