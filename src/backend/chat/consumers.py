import json
from channels.generic.websocket import AsyncWebsocketConsumer
from chat.models import Room, Message
from login.models import User
from chat.serializers import MessageSerializer
from channels.db import database_sync_to_async
import logging

LOGGER = logging.getLogger('watchtower')


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):

        try:
            room_name = str(self.scope['url_route']['kwargs']['room_name'])
            self.room_name = str(await self.get_room_name(room_name))
            self.room_group_name = 'chat_%s' % self.room_name
            self.room_instance = None

            # Join room group
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()

        except Exception as e:
            LOGGER.error(e)
            raise(e)


    @database_sync_to_async
    def get_room_name(self, room_name):
        try:
            room_arr = room_name.split('_')
            user1 = room_arr[0]
            user2 = room_arr[1]
            self.users = {
                user1: User.objects.get(id=user1),
                user2: User.objects.get(id=user2)
            }
            return ''.join([u[:15]for u in sorted([user1, user2])]) 
        except Exception as e:
            LOGGER.error(e)
            raise(e)

    @database_sync_to_async
    def create_room(self):
        try:
            if self.room_instance:
                return self.room_instance
            elif not Room.objects.filter(id=self.room_name).exists():
                room = Room(id=self.room_name)
                room.save()
                room.users.set(self.users)
                return room
            else:
                return Room.objects.get(id=self.room_name)

        except Exception as e:
            LOGGER.error(e)
            raise(e)

    @database_sync_to_async
    def create_message(self, content, author, room):

        try:
            message = Message(
                author=self.users[author],
                content=content,
                room=room
            )
            message.save()
            for user_id, user in self.users.items():
                if user_id != author:
                    user.unread_messages += 1
                    user.save(update_fields=['unread_messages'])

            return MessageSerializer(message).data

        except Exception as e:
            LOGGER.error(e)
            raise(e)

    @database_sync_to_async
    def delete_room(self):
        try:
            if self.room_instance and len(self.room_instance.messages.all()) == 0:
                self.room_instance.delete()
        except Exception as e:
            LOGGER.error(e)
            raise(e)

    async def disconnect(self, close_code):
        # Leave room group
        try:
            await self.delete_room()
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
            user = text_data_json['user']

            if user not in self.users:
                return

            self.room_instance = await self.create_room()
            message = await self.create_message(
                content=text_data_json['message'],
                author=user,
                room=self.room_instance,
            )

            await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'chat_message',
                        'message': message
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
