import logging
from datetime import UTC, datetime, timedelta

from celery import shared_task
from django.db.models import Q

from .models import Conversation, Message

logger = logging.getLogger(__name__)


@shared_task
def cleanup_old_conversations():
    # Calculate the date 30 days ago
    thirty_days_ago = datetime.now(tz=UTC) - timedelta(days=30)

    # Query and delete entries older than 30 days
    num_deleted: int = 0
    conversations = Conversation.objects.all()
    for conv in conversations:
        messages = Message.objects.filter(
            Q(sender_id=conv.person1, recipient_id=conv.person2) | Q(sender_id=conv.person2, recipient_id=conv.person1),
        )

        len_before_deletion: int = len(messages)
        to_delete = messages.filter(send_timestamp__lt=thirty_days_ago)

        len_deleted: int = to_delete.delete()[0]
        num_deleted += len_deleted
        if len_before_deletion <= len_deleted:
            conv.delete()

    msg: str = f"{num_deleted} old messages deleted."
    logger.info(msg)
