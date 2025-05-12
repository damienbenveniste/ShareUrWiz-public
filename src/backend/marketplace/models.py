import os
from django.db import models
from django.conf import settings
from django.utils import timezone
from login.models import User


class Category(models.Model):
    name = models.CharField(primary_key=True, max_length=120)
    number_used = models.IntegerField(default=1)

    def _str_(self):
        return self.name

    def save(self, *args, **kwargs):
        self.name = self.name.lower().strip()
        super(Category, self).save(*args, **kwargs)

    class Meta:
        ordering = ('-number_used', 'name')


class Post(models.Model):

    title = models.CharField(max_length=120)
    description = models.TextField()
    min_price = models.IntegerField(db_index=True)
    max_price = models.IntegerField(db_index=True)
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE
    )

    level = models.CharField(
        max_length=30,
        default=None,
        null=True,
        db_index=True,
    )

    categories = models.ManyToManyField(
        Category, 
        blank=True,
        related_name='post_categories',
    )
    time_created = models.DateTimeField(auto_now_add=True, auto_now=False)
    # time_created = models.DateTimeField(default=timezone.now)

    def _str_(self):
        return self.title

    class Meta:
        ordering = ('-time_created',)


def _get_image_path(instance, filename):
    return os.path.join(
        # 'pictures',
        instance.user.id,
        filename
    )


class TutorProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, primary_key=True, on_delete=models.CASCADE, related_name='tutor')
    summary = models.TextField(null=True, blank=True)
    first_name = models.CharField(max_length=30, null=True)
    last_name = models.CharField(max_length=30, null=True)
    balance = models.IntegerField(default=0)  # cents
    picture = models.ImageField(upload_to=_get_image_path, blank=True, null=True)
    price = models.IntegerField(default=0)  # dollars
    specialties = models.ManyToManyField(Category, blank=True)
    rating = models.FloatField(default=5)
    num_rating = models.IntegerField(default=1)
    stripe_account_id = models.CharField(max_length=30, null=True, blank=True)
    account_activated = models.BooleanField(default=False)
    linkedin_url = models.URLField(max_length=200, null=True, blank=True)
    time_created = models.DateTimeField(auto_now_add=True, auto_now=False)
    # time_created = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ('-rating', '-num_rating', 'price')


class Appointment(models.Model):

    STATUSES = (
        ('available', 'available'),
        ('pending', 'pending'),
        ('confirmed', 'confirmed'),
    )

    tutor = models.ForeignKey(TutorProfile, on_delete=models.CASCADE, related_name='appointments')
    tutee = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, default=None)
    payment_method_id = models.CharField(max_length=30, null=True, default=None)
    payment_intent_id = models.CharField(max_length=30, null=True, default=None)
    status = models.CharField(max_length=30, default='available', choices=STATUSES)
    date_time = models.DateTimeField()
    message = models.TextField(null=True, blank=True)
    room_url =  models.URLField(null=True)
    rating = models.IntegerField(null=True)
    duration = models.IntegerField(null=False, default=55)
    cost = models.IntegerField(default=100)  # cents
    time_created = models.DateTimeField(auto_now_add=True, auto_now=False)

    class Meta:
        ordering = ('date_time',)

   # time_created = models.DateTimeField(default=timezone.now)


