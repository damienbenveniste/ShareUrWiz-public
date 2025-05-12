
from rest_framework import serializers
from login.models import User
from marketplace.models import Post, Category, Appointment, TutorProfile
from login.serializers import UserSerializer, TutorProfileSerializer


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['name']


class AppointmentSerializer(serializers.ModelSerializer):
    tutee = UserSerializer(allow_null=True)
    tutor = TutorProfileSerializer(read_only=True)
    tutor_id = serializers.PrimaryKeyRelatedField(queryset=TutorProfile.objects.all(), source='tutor')

    class Meta:
        model = Appointment
        fields = [
            'id',
            'tutor',
            'tutor_id',
            'tutee',
            'date_time',
            'message',
            'room_url',
            'duration',
            'rating',
            'status',
            'cost'
        ]


class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    author_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='author')

    class Meta:
        model = Post
        fields = [
            'id',
            'title',
            'description',
            'categories',
            'author',
            'author_id',
            'min_price',
            'max_price',
            'time_created',
            'level'
        ]
