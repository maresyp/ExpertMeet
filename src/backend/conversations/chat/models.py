import uuid

from django.db import models

# Create your models here.

class Message(models.Model):
    message_id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False)
    sender_id = models.IntegerField(editable=False, null=False, blank=False)
    recipient_id = models.IntegerField(editable=False, null=False, blank=False)
    body = models.TextField(max_length=5000)
    send_timestamp = models.DateTimeField(auto_now_add=True)
    view_timestamp = models.DateTimeField(null=True, blank=True, default=None)

    def __str__(self) -> str:
        return str(f"{self.message_id} {self.send_timestamp}: {self.sender_id}: {self.body}")

    def save(self, *args, **kwargs):
        Conversation.objects.get_or_create(person1=min(self.sender_id, self.recipient_id), person2=max(self.sender_id, self.recipient_id))
        super().save(*args, **kwargs)


class Conversation(models.Model):
    person1 = models.IntegerField()
    person2 = models.IntegerField()

    class Meta:
        unique_together = ("person1", "person2")

    def __str__(self):
        return f"Conversation between {self.person1} and {self.person2}"
