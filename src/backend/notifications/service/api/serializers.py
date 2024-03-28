from typing import ClassVar

from rest_framework.serializers import ModelSerializer
from service.models import Notification


class NotificationSerializer(ModelSerializer):
    class Meta:
        fields: ClassVar = "__all__"
        model = Notification
