import logging
from datetime import UTC, datetime, timedelta

from celery import shared_task

from .models import Notification

logger = logging.getLogger(__name__)


@shared_task
def cleanup_old_notifications():
    # Calculate the date 30 days ago
    thirty_days_ago = datetime.now(tz=UTC) - timedelta(days=30)

    # Query and delete entries older than 30 days
    old_entries = Notification.objects.filter(created_at__lt=thirty_days_ago)
    num_deleted = old_entries.delete()[0]

    msg: str = f"{num_deleted} old notifications deleted."
    logger.info(msg)
