from rest_framework import serializers
from chat.models import Room, Message
from login.serializers import UserSerializer


class RoomSerializer(serializers.ModelSerializer):
    users = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Room
        fields = ['id', 'users', 'last_updated']


class MessageSerializer(serializers.ModelSerializer):

    author = UserSerializer(read_only=True)
    class Meta:
        model = Message
        fields = ['author', 'content', 'time_created', 'room']
