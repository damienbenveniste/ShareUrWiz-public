import json
from channels.generic.websocket import AsyncWebsocketConsumer
from login.models import User
from channels.db import database_sync_to_async
import logging

LOGGER = logging.getLogger('watchtower')


class MeetingNoteConsumer(AsyncWebsocketConsumer):

    async def connect(self):

        try:
            room_name = str(self.scope['url_route']['kwargs']['room_name'])
            print(room_name)
            self.room_name = room_name
            self.room_group_name = 'chat_%s' % self.room_name


            # Join room group
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()

        except Exception as e:
            LOGGER.error(e)
            raise(e)

    async def disconnect(self, close_code):
        # Leave room group
        try:
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
        except Exception as e:
            LOGGER.error(e)
            raise(e)

    # Receive message from WebSocket
    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'chat_message',
                        'message': text_data_json['message']
                    },
                )
        except Exception as e:
            LOGGER.error(e)
            raise(e)

    # Receive message from room group
    async def chat_message(self, event):
        # Send message to WebSocket
        try:
            await self.send(text_data=json.dumps(event['message']))
        except Exception as e:
            LOGGER.error(e)
            raise(e)
