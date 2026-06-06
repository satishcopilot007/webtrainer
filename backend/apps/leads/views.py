from rest_framework import generics, permissions
from .models import Lead, DemoBooking
from .serializers import LeadSerializer, DemoBookingSerializer
from .tasks import send_lead_notification_email


class LeadCreateView(generics.CreateAPIView):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        lead = serializer.save()
        send_lead_notification_email.delay(str(lead.id))


class DemoBookingCreateView(generics.CreateAPIView):
    queryset = DemoBooking.objects.all()
    serializer_class = DemoBookingSerializer
    permission_classes = [permissions.AllowAny]
