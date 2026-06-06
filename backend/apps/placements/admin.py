from django.contrib import admin
from .models import Placement, HiringPartner


@admin.register(Placement)
class PlacementAdmin(admin.ModelAdmin):
    list_display = ('student_name', 'company_name', 'role', 'package', 'course', 'is_featured', 'created_at')
    list_filter = ('is_featured', 'company_name', 'created_at')
    search_fields = ('student_name', 'company_name', 'role')


@admin.register(HiringPartner)
class HiringPartnerAdmin(admin.ModelAdmin):
    list_display = ('name', 'website_url', 'is_active', 'order')
    list_filter = ('is_active',)
    search_fields = ('name',)
    list_editable = ('is_active', 'order')
