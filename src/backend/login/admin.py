from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from login.models import User, Suggestion


ADDITIONAL_USER_FIELDS = (
    (None, {'fields': ('stripe_customer_id', 'credit', 'unread_messages')}),
)

class CustomUserAdmin(UserAdmin):
    model = User

    add_fieldsets = UserAdmin.add_fieldsets + ADDITIONAL_USER_FIELDS
    fieldsets = UserAdmin.fieldsets + ADDITIONAL_USER_FIELDS

admin.site.register(User, CustomUserAdmin)
admin.site.register(Suggestion, admin.ModelAdmin)
