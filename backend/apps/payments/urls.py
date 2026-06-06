from django.urls import path
from . import views

urlpatterns = [
    path('enroll/', views.EnrollmentCreateView.as_view(), name='enrollment-create'),
    path('my-enrollments/', views.UserEnrollmentsView.as_view(), name='user-enrollments'),
]
