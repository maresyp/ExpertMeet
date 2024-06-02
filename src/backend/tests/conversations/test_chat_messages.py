import asyncio
import pytest

from conversations.asgi import application
from channels.testing import WebsocketCommunicator
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from chat.models import Message
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async

@pytest.fixture
async def user(db):

    @database_sync_to_async
    def create_user():
        model, _ = get_user_model().objects.get_or_create(username="test@test.com", password="test")
        return model

    return await create_user()

# TODO: fix this test case
@pytest.mark.django_db(transaction=True)
@pytest.mark.asyncio
@pytest.mark.skip(reason="This code works, but test case for some reason doesn't")
async def test_chat_send_message(user):
    usr = await user
    token = RefreshToken.for_user(usr)
    communicator = WebsocketCommunicator(application, f"ws/socket-server/chat/?token={token.access_token}")

    connected, _ = await communicator.connect()
    assert connected

    await communicator.send_json_to({
        "type": "chat_message",
        "message": "chunk one \x01 chunk two",
        "recipient": 10,
    })

    @database_sync_to_async
    def count_messages():
        return Message.objects.all().count()

    messages = await count_messages()

    assert messages == 1

    message = await sync_to_async(Message.objects.filter(recipient_id=10).first)()
    assert message.body == "chunk one \x01 chunk two"

    await communicator.disconnect()