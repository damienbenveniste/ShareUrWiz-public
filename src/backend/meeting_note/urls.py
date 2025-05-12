from django.urls import path, include
from rest_framework import routers
from meeting_note.views import NoteView, NoteCellView

router = routers.DefaultRouter()
router.register(r'notes', NoteView)
router.register(r'note-cells', NoteCellView)


urlpatterns = [
    path('meeting-note/', include(router.urls)),
]