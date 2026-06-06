from django.contrib import admin
from .models import Lead, DemoBooking


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'course', 'source', 'status', 'created_at')
    list_filter = ('source', 'status', 'created_at')
    search_fields = ('name', 'email', 'phone')
    date_hierarchy = 'created_at'


@admin.register(DemoBooking)
class DemoBookingAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'course', 'preferred_date', 'preferred_time', 'status', 'created_at')
    list_filter = ('status', 'preferred_date', 'created_at')
    search_fields = ('name', 'email', 'phone')
    date_hierarchy = 'created_at'
