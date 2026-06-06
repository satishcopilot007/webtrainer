from django.contrib import admin
from .models import Testimonial


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('name', 'company', 'rating', 'is_featured', 'is_approved', 'order', 'created_at')
    list_filter = ('is_featured', 'is_approved', 'rating')
    search_fields = ('name', 'company', 'content')
    list_editable = ('is_approved', 'is_featured', 'order')
