from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from payment.views import (
    CreateAccountView, 
    CreateSetupIntent,
    ConfirmPaymentView,
    InvoiceHistoryView
)

urlpatterns = [
    path('payment/create-account/', CreateAccountView.as_view()),
    path('payment/create-setup-intent/', CreateSetupIntent.as_view()),
    path('payment/create-payment-intent/', ConfirmPaymentView.as_view()),
    path('payment/create-customer-portal-session/', InvoiceHistoryView.as_view())
]

