from __future__ import annotations

from chat.models import Conversation, Message
from django.db.models import DateTimeField, OuterRef, Q, Subquery
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .pagination import StandardResultsSetPagination
from .serializers import ConversationSerializer, MessageSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_messages(request, recipient_id: int):
    user_id = request.user.id

    messages = Message.objects.filter(
        Q(sender_id=user_id, recipient_id=recipient_id) | Q(sender_id=recipient_id, recipient_id=user_id),
    ).order_by("-send_timestamp")

    # Set up pagination
    paginator = StandardResultsSetPagination()
    paginated_messages = paginator.paginate_queryset(messages, request)

    serializer = MessageSerializer(paginated_messages, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_conversations(request):
    user_id = request.user.id

    # Subquery to get the timestamp of the latest message for each conversation
    latest_message_subquery = (
        Message.objects.filter(
            Q(sender_id=OuterRef("person1"), recipient_id=OuterRef("person2")) | Q(sender_id=OuterRef("person2"), recipient_id=OuterRef("person1")),
        )
        .order_by("-send_timestamp")
        .values("send_timestamp")[:1]
    )

    # Annotate conversations with the latest message timestamp
    conversations = Conversation.objects.filter(Q(person1=user_id) | Q(person2=user_id)).annotate(
        last_message_time=Subquery(latest_message_subquery, output_field=DateTimeField()),
    )

    # Order conversations by the latest message timestamp
    conversations = conversations.order_by("last_message_time")

    # Set up pagination
    paginator = StandardResultsSetPagination()
    paginator.page_size = 15
    paginated_conversations = paginator.paginate_queryset(conversations, request)

    serializer = ConversationSerializer(paginated_conversations, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)
