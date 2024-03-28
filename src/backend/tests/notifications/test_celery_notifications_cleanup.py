from datetime import datetime, timedelta, UTC
from service.models import Notification
from service.tasks import cleanup_old_notifications
import pytest
import uuid

@pytest.mark.django_db
def test_cleanup_old_notifications():
    # Create test data with 'created_at' dates older than 30 days
    thirty_days_ago = datetime.now(tz=UTC) - timedelta(days=31)
    old_entries = Notification.objects.create(profile=uuid.uuid4())
    old_entries.created_at = thirty_days_ago
    old_entries.save()

    # Call the task function directly
    cleanup_old_notifications()

    # Assert that the old entries have been deleted
    assert Notification.objects.filter(pk=old_entries.pk).exists() is False
