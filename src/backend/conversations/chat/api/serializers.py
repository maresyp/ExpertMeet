from typing import ClassVar

from chat.models import Conversation, Message
from rest_framework.serializers import DateTimeField, ModelSerializer


class MessageSerializer(ModelSerializer):
    class Meta:
        model = Message
        fields: ClassVar = "__all__"

class ConversationSerializer(ModelSerializer):
    last_message_time = DateTimeField(read_only=True)

    class Meta:
        model = Conversation
        fields: ClassVar = ["id", "person1", "person2", "last_message_time"]
