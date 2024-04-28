import pytest

from chat.consumers.chat import ChatConsumer
from conversations.asgi import application
from channels.testing import WebsocketCommunicator
from rest_framework import status

@pytest.mark.django_db
@pytest.mark.asyncio
async def test_missing_token():
    communicator = WebsocketCommunicator(application, r"ws/socket-server/chat/")

    connected, response = await communicator.connect()

    assert not connected
    assert response == status.HTTP_400_BAD_REQUEST

    await communicator.disconnect()
