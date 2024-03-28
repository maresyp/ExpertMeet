import uuid

from django.db import models
from django.utils.translation import gettext_lazy as _lazy

# Create your models here.


class Notification(models.Model):
    class NotificationType(models.IntegerChoices):
        NEW_MESSAGE = (0, _lazy("New message"))
        MISSED_CALL = (1, _lazy("Missed call"))

    id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False)
    profile = models.UUIDField(unique=False, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return super().__str__()
