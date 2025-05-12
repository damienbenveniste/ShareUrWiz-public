
from rest_framework import viewsets
from chat.serializers import RoomSerializer, MessageSerializer
from chat.models import Message, Room
from login.models import User
from marketplace.pagination import Pagination
import logging

LOGGER = logging.getLogger('watchtower')


class RoomView(viewsets.ModelViewSet):
    serializer_class = RoomSerializer
    queryset = Room.objects.all()
    pagination_class = Pagination

    def get_queryset(self):

        try:
            user_id = self.request.query_params.get('user_id')

            if not user_id:
                raise KeyError('Missing User ID')

            queryset =  User.objects.get(id=user_id).rooms.all() 
            return queryset
        except Exception as e:
            LOGGER.error(e)
            raise(e)



class MessageView(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    queryset = Message.objects.all()
    pagination_class = Pagination

    def get_queryset(self):

        try:
            user_id = self.request.query_params.get('user_id')
            connection_id = self.request.query_params.get('connection_id')

            if not user_id:
                raise KeyError('Missing User ID')

            if not connection_id:
                raise KeyError('Missing connection_id')

            if user_id == connection_id:
                return []

            room = Room.objects.filter(users__id=user_id) & Room.objects.filter(users__id=connection_id)
            if room:
                queryset = room[0].messages.all()
            else:
                queryset = []

            if queryset:
                user = User.objects.get(id=user_id)
                if user.unread_messages > 0:
                    user.unread_messages = max(user.unread_messages - len(queryset), 0)
                    user.save(update_fields=['unread_messages'])

            return queryset

        except Exception as e:
            LOGGER.error(e)
            raise(e)