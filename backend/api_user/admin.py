from django.contrib import admin
from .models import User, Friendship

class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'email', 'username', 'is_staff', 'is_active', 'date_joined')

# register the models so that they can be viewed in the admin panel
admin.site.register(User, UserAdmin)
admin.site.register(Friendship)