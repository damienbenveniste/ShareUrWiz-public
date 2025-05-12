from django.db import models
from django.core.exceptions import ValidationError
from django.conf import settings
from django.utils import timezone


def validate_message_content(content):
    if content is None or content == "" or content.isspace():
        raise ValidationError(
            'Content is empty/invalid',
            code='invalid',
            params={'content': content},
        )


class Room(models.Model):

    id = models.CharField(primary_key=True, max_length=30)
    last_updated = models.DateTimeField(default=timezone.now)

    users = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        blank=False,
        through='RoomConnection',
        related_name='rooms'
    )

    class Meta:
        ordering = ('-last_updated',)


class Message(models.Model):

    content = models.TextField(validators=[validate_message_content])

    room = models.ForeignKey(
        Room,
        on_delete=models.CASCADE,
        null=False,
        default=-1,
        related_name='messages',
    )

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        blank=False,
        null=False,
        related_name='author_messages',
        on_delete=models.CASCADE
    )

    time_created = models.DateTimeField(auto_now_add=True, blank=True)
    # time_created = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ('-time_created',)


class RoomConnection(models.Model):

    room = models.ForeignKey(
        Room,
        on_delete=models.CASCADE,
        null=False,
        related_name='rooms',
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        blank=False,
        null=False,
        on_delete=models.CASCADE,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                name='unique_room_user',
                fields=['room', 'user']
            ),
        ]
