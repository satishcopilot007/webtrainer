from django.urls import path
from . import views

urlpatterns = [
    path('', views.TestimonialListView.as_view(), name='testimonial-list'),
    path('featured/', views.FeaturedTestimonialsView.as_view(), name='testimonial-featured'),
]
