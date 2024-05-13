import logging
from datetime import UTC, datetime, timedelta

from celery import shared_task

from .models import Message

logger = logging.getLogger(__name__)


@shared_task
def cleanup_old_conversations():
    # Calculate the date 30 days ago
    thirty_days_ago = datetime.now(tz=UTC) - timedelta(days=30)

    # TODO(<maresyp>): implement
    # Query and delete entries older than 30 days
    # get each conversation
    # check for old messages
    # delete old messages
    # check if conversation has any messages
    # if not delete conversation

    old_entries = Message.objects.filter(send_timestamp__lt=thirty_days_ago)
    num_deleted = old_entries.delete()[0]

    msg: str = f"{num_deleted} old messages deleted."
    logger.info(msg)
