from django.contrib import admin
from meeting_note.models import Note, NoteCell, NoteConnection


admin.site.register(Note, admin.ModelAdmin)
admin.site.register(NoteCell, admin.ModelAdmin)
admin.site.register(NoteConnection, admin.ModelAdmin)

