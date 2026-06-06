from rest_framework import serializers
from .models import Placement, HiringPartner


class PlacementSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True, default='')

    class Meta:
        model = Placement
        fields = [
            'id', 'student_name', 'course', 'course_title',
            'company_name', 'company_logo', 'role', 'package',
            'testimonial', 'photo', 'is_featured', 'created_at',
        ]


class HiringPartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = HiringPartner
        fields = ['id', 'name', 'logo', 'website_url', 'order']
