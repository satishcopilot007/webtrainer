from django.urls import path
from . import views

urlpatterns = [
    path('enquiry/', views.LeadCreateView.as_view(), name='lead-create'),
    path('demo-booking/', views.DemoBookingCreateView.as_view(), name='demo-booking-create'),
]
