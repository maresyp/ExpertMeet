from typing import ClassVar

from chat.models import Message
from rest_framework.serializers import ModelSerializer


class MessageSerializer(ModelSerializer):
    class Meta:
        model = Message
        fields: ClassVar = "__all__"
