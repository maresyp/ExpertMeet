import json

from channels.generic.websocket import AsyncWebsocketConsumer


class VideoConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = f"video_{self.scope['user_id']}"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

    async def receive(self, text_data=None, _bytes_data=None):
        if text_data is None:
            return
        text_data_json = json.loads(text_data)

        try:
            match text_data_json["type"]:
                case "video_offer":
                    await self.video_offer_handler(text_data_json)
                case "video_answer":
                    await self.video_answer_handler(text_data_json)
                case "new-ice-candidate":
                    await self.new_ice_candidate_handler(text_data_json)
                case "end_call":
                    await self.end_call_handler(text_data_json)
                case "video_rejected":
                    await self.video_rejected_handler(text_data_json)
                case "ping":
                    await self.chat_ping_handler(text_data_json)
        except KeyError:
            # TODO: send error message to user
            return

    async def chat_ping_handler(self, _data):
        await self.send(text_data="pong")

    async def video_offer_handler(self, data):
        await self.channel_layer.group_send(
            f"video_{data['recipient']}",
            {
                "type": "video_offer",
                "callerID": self.scope["user_id"],
                "offer": data["offer"],
            },
        )

    async def video_offer(self, data):
        await self.send(
            text_data=json.dumps(
                {
                    "type": "video_offer",
                    "callerID": data["callerID"],
                    "offer": data["offer"],
                },
            ),
        )

    async def video_answer_handler(self, data):
        await self.channel_layer.group_send(
            f"video_{data['recipient']}",
            {
                "type": "video_result",
                "recipient": self.scope["user"].id,
                "answer": data["answer"],
            },
        )

    async def video_result(self, data):
        await self.send(
            text_data=json.dumps(
                {
                    "type": "video_result",
                    "recipient": data["recipient"],
                    "answer": data["answer"],
                },
            ),
        )

    async def new_ice_candidate_handler(self, data):
        await self.channel_layer.group_send(
            f"video_{data['recipient']}",
            {
                "type": "new-ice-candidate",
                "recipient": self.scope["user"].id,
                "candidate": data["candidate"],
            },
        )

    async def new_ice_candidate(self, data):
        await self.send(
            text_data=json.dumps(
                {
                    "type": "new-ice-candidate",
                    "recipient": data["recipient"],
                    "candidate": data["candidate"],
                },
            ),
        )

    async def disconnect(self, _code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def end_call_handler(self, data):
        await self.channel_layer.group_send(
            f"video_{data['recipient']}",
            {
                "type": "end_call",
                "reason": "finished",
                "recipient": self.scope["user"].id,
            },
        )

    # Handler for the video_rejected message
    async def video_rejected_handler(self, data):
        await self.channel_layer.group_send(
            f"video_{data['recipient']}",
            {
                "type": "end_call",
                "reason": "rejected",
                "recipient": data["recipient"],
            },
        )

    async def end_call(self, data):
        await self.send(
            text_data=json.dumps(
                {
                    "type": "end_call",
                    "reason": data["reason"],
                    "recipient": data["recipient"],
                },
            ),
        )
