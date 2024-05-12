from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from uuid import UUID

from chat.models import Message
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .serializers import MessageSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_messages(request, recipient_id: int, message_id: UUID | None = None):
    user_id = request.user.id

    if message_id:
        last_message = get_object_or_404(Message, pk=message_id)
        messages = Message.objects.filter(
            Q(sender_id=user_id, recipient_id=recipient_id) | Q(sender_id=recipient_id, recipient_id=user_id),
            send_timestamp__lt=last_message.send_timestamp,
        ).order_by("-send_timestamp")[:10]
    else:
        messages = Message.objects.filter(
            Q(sender_id=user_id, recipient_id=recipient_id) | Q(sender_id=recipient_id, recipient_id=user_id),
        ).order_by("-send_timestamp")[:10]

    serializer = MessageSerializer(messages, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)
