import pytest

from conversations.asgi import application
from channels.testing import WebsocketCommunicator
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model


@pytest.fixture
async def user(db):

    @database_sync_to_async
    def create_user():
        model, _ = get_user_model().objects.get_or_create(username="test@test.com", password="test")
        return model

    return await create_user()


@pytest.mark.django_db
@pytest.mark.asyncio
async def test_missing_token():
    communicator = WebsocketCommunicator(application, r"ws/socket-server/chat/")

    connected, response = await communicator.connect()
    assert not connected
    assert response == status.HTTP_400_BAD_REQUEST

    await communicator.disconnect()

@pytest.mark.django_db
@pytest.mark.asyncio
async def test_invalid_token():
    communicator = WebsocketCommunicator(application, r"ws/socket-server/chat/?token=12345")

    connected, response = await communicator.connect()
    assert not connected
    assert response == status.HTTP_401_UNAUTHORIZED

    await communicator.disconnect()

@pytest.mark.django_db
@pytest.mark.asyncio
async def test_valid_token(user):
    usr = await user
    token = RefreshToken.for_user(usr)
    communicator = WebsocketCommunicator(application, f"ws/socket-server/chat/?token={token.access_token}")

    connected, _ = await communicator.connect()
    assert connected

    await communicator.disconnect()

@pytest.mark.django_db
@pytest.mark.asyncio
async def test_chat(user):
    usr = await user
    token = RefreshToken.for_user(usr)
    communicator = WebsocketCommunicator(application, f"ws/socket-server/chat/?token={token.access_token}")

    connected, _ = await communicator.connect()
    assert connected

    # Test all possible routes

    await communicator.send_json_to({
        "type": "chat-message",
        "message": "chunk one \x01 chunk two",
        "recipient": 10,
    })

    await communicator.send_json_to({
        "type": "recipient-change",
        "message": "chunk one \x01 chunk two",
        "recipient": 10,
    })

    await communicator.send_json_to({
        "type": "chat_message_read",
        "message": "chunk one \x01 chunk two",
        "recipient": 10,
    })

    await communicator.send_json_to({
        "type": "chat-request-more-messages",
        "message": "chunk one \x01 chunk two",
        "recipient": 10,
    })

    await communicator.disconnect()