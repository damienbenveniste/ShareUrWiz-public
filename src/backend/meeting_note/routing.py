# chat/routing.py
from django.urls import re_path
from meeting_note import consumers


websocket_urlpatterns = [
  re_path(r'ws/meeting-note/(?P<room_name>\w+)/$', consumers.MeetingNoteConsumer.as_asgi()), # Using asgi
]
