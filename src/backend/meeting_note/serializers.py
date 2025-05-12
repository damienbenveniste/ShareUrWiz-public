from rest_framework import serializers
from meeting_note.models import Note, NoteCell
from login.serializers import UserSerializer
from login.models import User


class NoteCellSerializer(serializers.ModelSerializer):

    note_id = serializers.PrimaryKeyRelatedField(queryset=Note.objects.all(), source='note')

    class Meta:
        model = NoteCell
        fields = [
            'id',
            'type',
            'content',
            'note_id',
            'time_created'
        ]


class NoteSerializer(serializers.ModelSerializer):
    # participants = UserSerializer(many=True, read_only=True)
    participants_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='participants', many=True)
    note_cells = NoteCellSerializer(many=True, read_only=True)

    class Meta:
        model = Note
        fields = [
            'id',
            'title',
            'time_created',
            # 'participants',
            'participants_id',
            'note_cells',
        ]
