from rest_framework import serializers
from .models import Enrollment, Certificate


class CertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificate
        fields = ['id', 'certificate_number', 'issued_at']


class EnrollmentSerializer(serializers.ModelSerializer):
    certificate = CertificateSerializer(read_only=True)
    course_title = serializers.CharField(source='course.title', read_only=True)

    class Meta:
        model = Enrollment
        fields = [
            'id', 'user', 'course', 'course_title', 'batch',
            'amount', 'payment_status', 'payment_id',
            'enrolled_at', 'certificate',
        ]
        read_only_fields = ['id', 'user', 'payment_status', 'enrolled_at']


class EnrollmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = ['course', 'batch', 'amount', 'payment_id']
