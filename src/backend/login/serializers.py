
from rest_framework import serializers
from login.models import User, Suggestion
from marketplace.models import TutorProfile


class TutorProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = TutorProfile
        fields = [
            'user',
            'first_name',
            'last_name',
            'summary',
            'picture',
            'specialties',
            'price',
            'rating',
            'num_rating',
            'linkedin_url',
            'account_activated',
            'stripe_account_id',
            'balance',
        ]


class UserSerializer(serializers.ModelSerializer):

    tutor = TutorProfileSerializer(read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'tutor', 'credit', 'unread_messages']


class SuggestionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Suggestion
        fields = ['content']