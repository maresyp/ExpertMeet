from __future__ import annotations

from typing import TYPE_CHECKING

from chat.models import Conversation

if TYPE_CHECKING:
    from uuid import UUID

from chat.models import Message
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .serializers import ConversationSerializer, MessageSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_messages(request, recipient_id: int, message_id: UUID | None = None):
    user_id = request.user.id

    if message_id:
        last_message = get_object_or_404(Message, pk=message_id)
        messages = Message.objects.filter(
            Q(sender_id=user_id, recipient_id=recipient_id) | Q(sender_id=recipient_id, recipient_id=user_id),
            send_timestamp__lt=last_message.send_timestamp,
        ).order_by("send_timestamp")[:10]
    else:
        messages = Message.objects.filter(
            Q(sender_id=user_id, recipient_id=recipient_id) | Q(sender_id=recipient_id, recipient_id=user_id),
        ).order_by("send_timestamp")[:10]

    serializer = MessageSerializer(messages, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_conversations(request):
    user_id = request.user.id

    # TODO(<maresyp>): implement pagination for more friends
    conversations = Conversation.objects.filter(Q(person1=user_id) | Q(person2=user_id))
    for conv in conversations:
        conv.last_message_time = Message.objects.filter(
            Q(sender_id=conv.person1, recipient_id=conv.person2) | Q(sender_id=conv.person2, recipient_id=conv.person1),
        ).order_by("-send_timestamp")[:1]

    conversations.order_by("-last_message_time")
    serializer = ConversationSerializer(conversations, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)
