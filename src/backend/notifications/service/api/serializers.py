from typing import ClassVar

from rest_framework.serializers import ModelSerializer, Serializer, UUIDField
from service.models import Notification


class NotificationSerializer(ModelSerializer):
    class Meta:
        fields: ClassVar = "__all__"
        model = Notification

class NotificationDeserializer(Serializer):
    profile_id = UUIDField()
