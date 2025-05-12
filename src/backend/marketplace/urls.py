from django.urls import path, include
from rest_framework import routers
from marketplace.views import (
    PostView, 
    CategoryView, 
    TutorProfileView,
    AppointmentView,
    ConfirmAppointment,
    AppointmentListView,
    AppointmentCalendarView
)

router = routers.DefaultRouter()
router.register(r'posts', PostView)
router.register(r'categories', CategoryView)
router.register(r'tutors', TutorProfileView)
router.register(r'appointments', AppointmentView)
router.register(r'appointments-list', AppointmentListView)
router.register(r'appointments-calendar', AppointmentCalendarView)

urlpatterns = [
    path('marketplace/', include(router.urls)),
    path('marketplace/confirm-appointment/', ConfirmAppointment.as_view())
]
