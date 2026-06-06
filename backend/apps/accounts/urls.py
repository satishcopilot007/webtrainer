from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

router = DefaultRouter()
router.register(r'enrollments', views.CourseEnrollmentViewSet, basename='enrollment')
router.register(r'callbacks', views.EnrollmentCallbackViewSet, basename='callback')
router.register(r'progress', views.LearningProgressViewSet, basename='progress')

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', views.UserProfileView.as_view(), name='profile'),
    path('profile/details/', views.UpdateProfileDetailsView.as_view(), name='profile-details'),
    path('change-password/', views.ChangePasswordView.as_view(), name='change-password'),
    path('', include(router.urls)),
]
