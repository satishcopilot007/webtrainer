from rest_framework import serializers
from .models import Lead, DemoBooking


class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = ['id', 'name', 'email', 'phone', 'course', 'message', 'source', 'created_at']
        read_only_fields = ['id', 'created_at']


class DemoBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = DemoBooking
        fields = [
            'id', 'name', 'email', 'phone', 'course',
            'preferred_date', 'preferred_time', 'message', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']
