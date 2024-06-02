from datetime import datetime, timedelta, UTC
from chat.models import Message, Conversation
from chat.tasks import cleanup_old_conversations
import pytest

@pytest.mark.django_db
def test_cleanup_old_notifications():
    # Create test data with 'created_at' dates older than 30 days
    thirty_days_ago = datetime.now(tz=UTC) - timedelta(days=31)
    old_entries = Message.objects.create(
        sender_id=1,
        recipient_id=2,
        body="New Message"
    )

    assert Conversation.objects.filter(person1=1).exists() is True
    assert Message.objects.filter(sender_id=1).exists() is True

    old_entries.send_timestamp = thirty_days_ago
    old_entries.save()

    # Call the task function directly
    cleanup_old_conversations()

    # Assert that the old entries have been deleted
    assert Message.objects.filter(sender_id=1).exists() is False
    assert Conversation.objects.filter(person1=1).exists() is False

@pytest.mark.django_db
def test_cleanup_old_notifications_subset():
    # Create test data with 'created_at' dates older than 30 days
    thirty_days_ago = datetime.now(tz=UTC) - timedelta(days=31)
    for _ in range(5):
        old_entries = Message.objects.create(
            sender_id=1,
            recipient_id=2,
            body="Old Message"
        )
        old_entries.send_timestamp = thirty_days_ago
        old_entries.save()

        Message.objects.create(
            sender_id=1,
            recipient_id=2,
            body="New Message"
        )

    # Call the task function directly
    cleanup_old_conversations()

    # Assert that the old entries have been deleted
    messages =  Message.objects.filter(sender_id=1)
    assert messages.exists() is True
    assert len(messages) == 5
    assert Conversation.objects.filter(person1=1).exists() is True
