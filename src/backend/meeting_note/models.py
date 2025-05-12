from django.db import models
from login.models import User


class Note(models.Model):

    title = models.CharField(max_length=120, null=True, blank=True, default='Untitled')
    
    participants = models.ManyToManyField(
        User,
        blank=False,
        through='NoteConnection',
        related_name='notes'
    )

    time_created = models.DateTimeField(auto_now_add=True, auto_now=False)

    class Meta:
        ordering = ('-time_created',)


class NoteCell(models.Model):

    note = models.ForeignKey(
        Note,
        on_delete=models.CASCADE,
        null=False,
        related_name='note_cells',
    )
    type = models.CharField(max_length=30, null=False)
    content = models.TextField(null=False, blank=True, default='')
    time_created = models.DateTimeField(auto_now_add=True, auto_now=False)

    class Meta:
        ordering = ('time_created',)



class NoteConnection(models.Model):

    note = models.ForeignKey(
        Note,
        on_delete=models.CASCADE,
        null=False
    )

    user = models.ForeignKey(
        User,
        blank=False,
        null=False,
        on_delete=models.CASCADE,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                name='unique_note_user',
                fields=['note', 'user']
            ),
        ]
