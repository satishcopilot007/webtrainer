from rest_framework import generics, permissions
from .models import Placement, HiringPartner
from .serializers import PlacementSerializer, HiringPartnerSerializer


class PlacementListView(generics.ListAPIView):
    serializer_class = PlacementSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Placement.objects.select_related('course').all()


class FeaturedPlacementsView(generics.ListAPIView):
    serializer_class = PlacementSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Placement.objects.filter(is_featured=True).select_related('course')


class HiringPartnerListView(generics.ListAPIView):
    serializer_class = HiringPartnerSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return HiringPartner.objects.filter(is_active=True)
