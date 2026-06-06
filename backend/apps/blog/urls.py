from django.urls import path
from . import views

urlpatterns = [
    path('', views.BlogListView.as_view(), name='blog-list'),
    path('featured/', views.FeaturedBlogsView.as_view(), name='blog-featured'),
    path('<slug:slug>/', views.BlogDetailView.as_view(), name='blog-detail'),
]
