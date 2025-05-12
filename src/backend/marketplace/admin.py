from django.contrib import admin
from marketplace.models import Post, Category, TutorProfile, Appointment


admin.site.register(Post, admin.ModelAdmin)
admin.site.register(Category, admin.ModelAdmin)
admin.site.register(TutorProfile, admin.ModelAdmin)
admin.site.register(Appointment, admin.ModelAdmin)

