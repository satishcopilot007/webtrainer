from django.urls import path
from . import views

urlpatterns = [
    path('', views.CourseListView.as_view(), name='course-list'),
    path('featured/', views.FeaturedCoursesView.as_view(), name='featured-courses'),
    path('trending/', views.TrendingCoursesView.as_view(), name='trending-courses'),
    path('categories/', views.CategoryListView.as_view(), name='category-list'),
    path('categories/<slug:slug>/', views.CategoryDetailView.as_view(), name='category-detail'),
    path('categories/<slug:slug>/courses/', views.CourseByCategoryView.as_view(), name='category-courses'),
    path('mentors/', views.MentorListView.as_view(), name='mentor-list'),
    path('mentors/<slug:slug>/', views.MentorDetailView.as_view(), name='mentor-detail'),
    path('<slug:slug>/', views.CourseDetailView.as_view(), name='course-detail'),
    path('<slug:slug>/reviews/', views.CourseReviewCreateView.as_view(), name='course-review'),
]
