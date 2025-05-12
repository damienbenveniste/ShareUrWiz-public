
from django.urls import path, include
from rest_framework import routers
from login.views import UserView, SuggestionView, ReactLoggingView

router = routers.DefaultRouter()
router.register(r'users', UserView)
router.register(r'suggestions', SuggestionView)

urlpatterns = [
    path('login/', include(router.urls)),
    path('react-logging/', ReactLoggingView.as_view())
]
