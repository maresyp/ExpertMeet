import uuid
from enum import Enum
from typing import ClassVar

from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone

# Create your models here.


class Schedule(models.Model): ...

class AppointmentStatus(Enum):
    PENDING = "1"
    ACCEPTED = "2"
    REJECTED = "3"

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]


class Appointment(models.Model):
    STATUS_CHOICES: ClassVar = AppointmentStatus.choices()

    id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False)
    requested_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name="appointments_requested")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name="appointments_received")
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default="1")
    date_scheduled = models.DateTimeField()
    date_created = models.DateTimeField(default=timezone.now)

    def __str__(self) -> str:
        return f"Appointment requested by {self.requested_by} with {self.receiver} on {self.date_scheduled}"
