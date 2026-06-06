from django.contrib import admin
from .models import Enrollment, Certificate


class CertificateInline(admin.StackedInline):
    model = Certificate
    extra = 0


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('user', 'course', 'batch', 'amount', 'payment_status', 'enrolled_at')
    list_filter = ('payment_status', 'enrolled_at')
    search_fields = ('user__email', 'course__title', 'payment_id')
    date_hierarchy = 'enrolled_at'
    inlines = [CertificateInline]


@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ('certificate_number', 'enrollment', 'issued_at')
    search_fields = ('certificate_number', 'enrollment__user__email')
    date_hierarchy = 'issued_at'
