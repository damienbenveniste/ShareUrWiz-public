
from django.urls import path, include
from rest_framework import routers
from chat.views import RoomView, MessageView

router = routers.DefaultRouter()
router.register(r'rooms', RoomView)
router.register(r'messages', MessageView)

urlpatterns = [
    path('chat/', include(router.urls)),
]
