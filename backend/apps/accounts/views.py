from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils import timezone
from .serializers import (
    RegisterSerializer, UserSerializer, ChangePasswordSerializer,
    UserProfileSerializer, CourseEnrollmentSerializer, EnrollmentCallbackSerializer,
    LearningProgressSerializer, EnrollmentDetailSerializer
)
from .models import UserProfile, CourseEnrollment, EnrollmentCallback, LearningProgress

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class UpdateProfileDetailsView(generics.UpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, _ = UserProfile.objects.get_or_create(user=self.request.user)
        return profile


class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save()
        return Response({'detail': 'Password updated successfully.'}, status=status.HTTP_200_OK)


class CourseEnrollmentViewSet(viewsets.ModelViewSet):
    """ViewSet for managing course enrollments"""
    serializer_class = CourseEnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'post', 'patch', 'delete']

    def get_queryset(self):
        """Return enrollments for the current user"""
        return CourseEnrollment.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        """Use detailed serializer for retrieve action"""
        if self.action == 'retrieve':
            return EnrollmentDetailSerializer
        return CourseEnrollmentSerializer

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        """Create a new enrollment"""
        from courses.models import Course
        
        course_id = request.data.get('course')
        batch_id = request.data.get('batch')
        
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response({'detail': 'Course not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Check if already enrolled
        existing = CourseEnrollment.objects.filter(
            user=request.user,
            course=course
        ).exists()
        
        if existing:
            return Response(
                {'detail': 'You are already enrolled in this course.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create enrollment
        enrollment = CourseEnrollment.objects.create(
            user=request.user,
            course=course,
            batch_id=batch_id if batch_id else None,
            amount_paid=0,
            enrollment_status='pending'  # Pending payment initially
        )

        # Create learning progress for each module
        from courses.models import CurriculumModule
        modules = CurriculumModule.objects.filter(course=course)
        
        for module in modules:
            LearningProgress.objects.create(
                enrollment=enrollment,
                module=module,
                total_lessons=len(module.topics) if module.topics else 0
            )

        serializer = self.get_serializer(enrollment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def mark_payment_complete(self, request, pk=None):
        """Mark enrollment payment as complete"""
        enrollment = self.get_object()
        
        if enrollment.payment_status == 'completed':
            return Response(
                {'detail': 'Payment already completed.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        enrollment.payment_status = 'completed'
        enrollment.enrollment_status = 'active'
        enrollment.started_at = timezone.now()
        
        # Set amount paid to effective price
        enrollment.amount_paid = enrollment.course.effective_price
        enrollment.save()

        serializer = self.get_serializer(enrollment)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def update_progress(self, request, pk=None):
        """Update enrollment progress"""
        enrollment = self.get_object()
        
        progress = request.data.get('progress_percentage', enrollment.progress_percentage)
        modules_completed = request.data.get('modules_completed', enrollment.modules_completed)

        enrollment.progress_percentage = int(progress)
        enrollment.modules_completed = int(modules_completed)
        
        # Mark as completed if 100%
        if enrollment.progress_percentage >= 100:
            enrollment.enrollment_status = 'completed'
            enrollment.completed_at = timezone.now()
            enrollment.certificate_issued = True
            enrollment.certificate_date = timezone.now()

        enrollment.save()
        serializer = self.get_serializer(enrollment)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def cancel_enrollment(self, request, pk=None):
        """Cancel an enrollment"""
        enrollment = self.get_object()
        
        if enrollment.enrollment_status == 'cancelled':
            return Response(
                {'detail': 'Enrollment is already cancelled.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        enrollment.enrollment_status = 'cancelled'
        enrollment.save()

        serializer = self.get_serializer(enrollment)
        return Response(serializer.data, status=status.HTTP_200_OK)


class EnrollmentCallbackViewSet(viewsets.ModelViewSet):
    """ViewSet for managing callback requests"""
    queryset = EnrollmentCallback.objects.all()
    serializer_class = EnrollmentCallbackSerializer
    permission_classes = [permissions.AllowAny]  # Allow anonymous users to request callbacks
    http_method_names = ['post', 'get']

    def get_queryset(self):
        """Authenticated users can only see their own callbacks"""
        if self.request.user.is_authenticated:
            return EnrollmentCallback.objects.filter(user=self.request.user)
        return EnrollmentCallback.objects.none()

    def create(self, request, *args, **kwargs):
        """Create a callback request"""
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response(
            {'detail': 'Callback request submitted successfully. Our team will contact you soon.'},
            status=status.HTTP_201_CREATED
        )


class LearningProgressViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing learning progress"""
    serializer_class = LearningProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Return learning progress for user's enrollments"""
        return LearningProgress.objects.filter(
            enrollment__user=self.request.user
        )

    @action(detail=True, methods=['post'])
    def mark_complete(self, request, pk=None):
        """Mark a module as complete"""
        progress = self.get_object()
        
        progress.is_completed = True
        progress.completion_percentage = 100
        progress.completed_at = timezone.now()
        progress.save()

        # Update parent enrollment progress
        enrollment = progress.enrollment
        completed_modules = enrollment.learning_progress.filter(is_completed=True).count()
        total_modules = enrollment.learning_progress.count()
        
        if total_modules > 0:
            enrollment.modules_completed = completed_modules
            enrollment.progress_percentage = int((completed_modules / total_modules) * 100)
            enrollment.save()

        serializer = self.get_serializer(progress)
        return Response(serializer.data, status=status.HTTP_200_OK)
