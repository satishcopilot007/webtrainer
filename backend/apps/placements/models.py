import uuid
from django.db import models


class Placement(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student_name = models.CharField(max_length=200)
    course = models.ForeignKey(
        'courses.Course', on_delete=models.SET_NULL,
        null=True, blank=True, related_name='placements'
    )
    company_name = models.CharField(max_length=200)
    company_logo = models.ImageField(upload_to='placements/logos/', blank=True, null=True)
    role = models.CharField(max_length=200)
    package = models.CharField(max_length=100, blank=True, help_text='e.g. 8 LPA')
    testimonial = models.TextField(blank=True)
    photo = models.ImageField(upload_to='placements/photos/', blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-is_featured', '-created_at']
        verbose_name = 'Placement'
        verbose_name_plural = 'Placements'

    def __str__(self):
        return f'{self.student_name} - {self.company_name}'


class HiringPartner(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    logo = models.ImageField(upload_to='partners/')
    website_url = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']
        verbose_name = 'Hiring Partner'
        verbose_name_plural = 'Hiring Partners'

    def __str__(self):
        return self.name
