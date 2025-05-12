
from rest_framework import viewsets
from meeting_note.serializers import NoteSerializer, NoteCellSerializer
from meeting_note.models import Note, NoteCell
from marketplace.pagination import Pagination
from rest_framework.response import Response


class NoteView(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    queryset = Note.objects.all()
    pagination_class = Pagination


class NoteCellView(viewsets.ModelViewSet):
    serializer_class = NoteCellSerializer
    queryset = NoteCell.objects.all()
    pagination_class = Pagination
