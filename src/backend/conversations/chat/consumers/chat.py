import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from chat.models import Message
from django.db.models import Q
from django.utils import timezone


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = f"chat_{self.scope['user_id']}"
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name,
        )

        await self.accept()

    async def receive(self, text_data=None, _bytes_data=None):
        if text_data is None:
            return
        text_data_json = json.loads(text_data)

        try:
            match text_data_json["type"]:
                case "chat_message":
                    await self.chat_message_handler(text_data_json)
                case "chat_message_read":
                    await self.chat_message_read_handler(text_data_json)
                case "ping":
                    await self.chat_ping_handler(text_data_json)
        except KeyError:
            return

    async def disconnect(self, _close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def chat_error_handler(self, error):
        await self.send(text_data=json.dumps({"type": "chat-error", "error": error}))

    async def chat_ping_handler(self, _data):
        await self.send(text_data="pong")

    async def chat_message_handler(self, data):
        message = data["message"]
        if not message:
            return

        recipient = int(data["recipient"])
        user = int(self.scope["user_id"])

        message_id = await self.save_message(user, recipient, message)
        # Update the recipient with the new message
        await self.channel_layer.group_send(
            f"chat_{recipient}",
            {
                "type": "chat_message",
                "message": message,
                "message_id": str(message_id),
                "sender": user,
                "recipient": recipient,
            },
        )

    async def chat_message(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "type": "chat-single-message",
                    "body": event["message"],
                    "message_id": str(event["message_id"]),
                    "sender": event["sender"],
                    "recipient": event["recipient"],
                    "send_timestamp": timezone.now().isoformat(),
                },
            ),
        )

    @database_sync_to_async
    def chat_message_read_handler(self, data):
        messages = Message.objects.filter(
            (Q(sender_id=data["recipient"], recipient_id=self.scope["user_id"]) | Q(sender_id=self.scope["user_id"], recipient_id=data["recipient"]))
            & Q(view_timestamp__isnull=True),
        )

        for message in messages:
            message.view_timestamp = timezone.now()
            message.is_read = True
            message.save()

    @database_sync_to_async
    def save_message(self, sender, recipient, message):
        message_obj = Message.objects.create(sender_id=sender, recipient_id=recipient, body=message)
        return message_obj.message_id
