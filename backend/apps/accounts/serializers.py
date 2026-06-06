from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import UserProfile, CourseEnrollment, EnrollmentCallback, LearningProgress

User = get_user_model()


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['linkedin_url', 'github_url', 'portfolio_url', 'city',
                  'experience_years', 'current_company', 'current_role', 'skills']


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    full_name = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'full_name',
                  'phone', 'role', 'avatar', 'bio', 'date_joined', 'profile']
        read_only_fields = ['id', 'email', 'date_joined', 'role']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'phone', 'password', 'password_confirm']

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({'password_confirm': 'Passwords do not match.'})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(user=user)
        return user


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Old password is incorrect.')
        return value


class CourseEnrollmentSerializer(serializers.ModelSerializer):
    """Serializer for course enrollments"""
    course_title = serializers.CharField(source='course.title', read_only=True)
    course_slug = serializers.CharField(source='course.slug', read_only=True)
    mentor_name = serializers.CharField(source='course.mentor.name', read_only=True, allow_null=True)
    batch_name = serializers.CharField(source='batch.batch_name', read_only=True, allow_null=True)
    batch_start_date = serializers.DateField(source='batch.start_date', read_only=True, allow_null=True)

    class Meta:
        model = CourseEnrollment
        fields = [
            'id', 'course', 'course_title', 'course_slug', 'batch', 'batch_name', 'batch_start_date',
            'mentor_name', 'enrollment_status', 'payment_status', 'amount_paid',
            'discount_amount', 'payment_method', 'progress_percentage', 'modules_completed',
            'enrolled_at', 'started_at', 'completed_at', 'certificate_issued', 'certificate_date'
        ]
        read_only_fields = ['id', 'enrolled_at', 'started_at', 'completed_at', 'certificate_date']


class EnrollmentCallbackSerializer(serializers.ModelSerializer):
    """Serializer for callback requests"""
    course_title = serializers.CharField(source='course.title', read_only=True)
    course_slug = serializers.CharField(source='course.slug', read_only=True)

    class Meta:
        model = EnrollmentCallback
        fields = [
            'id', 'course', 'course_title', 'course_slug', 'email', 'phone',
            'first_name', 'last_name', 'message', 'preferred_time', 'status',
            'created_at', 'called_at'
        ]
        read_only_fields = ['id', 'created_at', 'called_at', 'status']

    def create(self, validated_data):
        """Add user reference if authenticated"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['user'] = request.user
        return super().create(validated_data)


class LearningProgressSerializer(serializers.ModelSerializer):
    """Serializer for tracking learning progress"""
    module_title = serializers.CharField(source='module.title', read_only=True)
    module_order = serializers.IntegerField(source='module.order', read_only=True)

    class Meta:
        model = LearningProgress
        fields = [
            'id', 'module', 'module_title', 'module_order', 'is_completed',
            'completion_percentage', 'lessons_completed', 'total_lessons',
            'started_at', 'completed_at', 'total_hours_spent', 'last_accessed_at'
        ]
        read_only_fields = ['id', 'last_accessed_at']


class EnrollmentDetailSerializer(serializers.ModelSerializer):
    """Detailed enrollment serializer with learning progress"""
    course = serializers.SerializerMethodField()
    batch_details = serializers.SerializerMethodField()
    learning_progress = LearningProgressSerializer(many=True, read_only=True)

    class Meta:
        model = CourseEnrollment
        fields = [
            'id', 'course', 'batch_details', 'enrollment_status', 'payment_status',
            'amount_paid', 'discount_amount', 'progress_percentage', 'modules_completed',
            'enrolled_at', 'started_at', 'completed_at', 'certificate_issued',
            'certificate_id', 'certificate_date', 'learning_progress'
        ]
        read_only_fields = ['id', 'enrolled_at']

    def get_course(self, obj):
        """Return course details"""
        from courses.serializers import CourseDetailSerializer
        return CourseDetailSerializer(obj.course).data

    def get_batch_details(self, obj):
        """Return batch details if enrolled in batch"""
        if obj.batch:
            return {
                'id': str(obj.batch.id),
                'name': obj.batch.batch_name,
                'start_date': obj.batch.start_date,
                'end_date': obj.batch.end_date,
                'timing': obj.batch.timing,
                'enrolled_count': obj.batch.enrolled_count,
                'max_students': obj.batch.max_students,
            }
        return None
