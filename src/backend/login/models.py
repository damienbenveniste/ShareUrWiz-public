from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.fields import IntegerField


class User(AbstractUser):
    id = models.CharField(primary_key=True, max_length=30)
    username = models.CharField(max_length=30, unique=False)
    email = models.EmailField(max_length=255, unique=True)
    stripe_customer_id = models.CharField(max_length=30, unique=True, null=True, blank=True)
    credit = models.IntegerField(default=0) # cents
    unread_messages = models.IntegerField(default=0)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'id']


class Suggestion(models.Model):
    content = models.TextField()
    time_created = models.DateTimeField(auto_now_add=True, auto_now=False)



