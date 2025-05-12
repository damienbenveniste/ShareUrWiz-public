from django.contrib import admin
from chat.models import Room, RoomConnection, Message

admin.site.register(Room, admin.ModelAdmin)
admin.site.register(RoomConnection, admin.ModelAdmin)
admin.site.register(Message, admin.ModelAdmin)

