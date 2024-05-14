from typing import ClassVar

from chat.models import Conversation, Message
from rest_framework.serializers import ModelSerializer


class MessageSerializer(ModelSerializer):
    class Meta:
        model = Message
        fields: ClassVar = "__all__"

class ConversationSerializer(ModelSerializer):
    class Meta:
        model = Conversation
        field: ClassVar = "__all__"
