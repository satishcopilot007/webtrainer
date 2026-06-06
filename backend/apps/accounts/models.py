import uuid
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from .managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('mentor', 'Mentor'),
        ('admin', 'Admin'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, blank=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    bio = models.TextField(blank=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['-date_joined']

    def __str__(self):
        return self.email

    @property
    def full_name(self):
        return f'{self.first_name} {self.last_name}'.strip()


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    linkedin_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    portfolio_url = models.URLField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    experience_years = models.PositiveIntegerField(default=0)
    current_company = models.CharField(max_length=200, blank=True)
    current_role = models.CharField(max_length=200, blank=True)
    skills = models.JSONField(default=list, blank=True)

    def __str__(self):
        return f'{self.user.full_name} Profile'


class CourseEnrollment(models.Model):
    """Model to track student enrollments in courses"""
    ENROLLMENT_STATUS_CHOICES = [
        ('pending', 'Pending Payment'),
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('suspended', 'Suspended'),
    ]
    
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='course_enrollments')
    course = models.ForeignKey('courses.Course', on_delete=models.CASCADE, related_name='student_enrollments')
    batch = models.ForeignKey('courses.BatchSchedule', on_delete=models.SET_NULL, null=True, blank=True, related_name='student_enrollments')
    
    enrollment_status = models.CharField(max_length=20, choices=ENROLLMENT_STATUS_CHOICES, default='pending')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    
    # Payment details
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    payment_method = models.CharField(max_length=50, blank=True)
    transaction_id = models.CharField(max_length=200, unique=True, blank=True)
    
    # Learning progress
    progress_percentage = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    modules_completed = models.IntegerField(default=0)
    
    # Dates
    enrolled_at = models.DateTimeField(auto_now_add=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Certificate
    certificate_issued = models.BooleanField(default=False)
    certificate_date = models.DateTimeField(null=True, blank=True)
    certificate_id = models.CharField(max_length=100, unique=True, blank=True)

    class Meta:
        unique_together = ('user', 'course')
        ordering = ['-enrolled_at']
        indexes = [
            models.Index(fields=['user', 'enrollment_status']),
            models.Index(fields=['course', 'enrollment_status']),
        ]

    def __str__(self):
        return f'{self.user.full_name} - {self.course.title}'

    @property
    def is_active_enrollment(self):
        return self.enrollment_status == 'active'

    @property
    def is_payment_complete(self):
        return self.payment_status == 'completed'


class EnrollmentCallback(models.Model):
    """Model to track callback requests from interested users"""
    CALLBACK_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('called', 'Called'),
        ('scheduled', 'Scheduled'),
        ('completed', 'Completed'),
        ('not_interested', 'Not Interested'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    course = models.ForeignKey('courses.Course', on_delete=models.CASCADE, related_name='callbacks')
    
    # Contact info - can be anonymous
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100, blank=True)
    
    # Optional: Link to user if logged in
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='callback_requests')
    
    # Details
    message = models.TextField(blank=True)
    preferred_time = models.CharField(max_length=50, blank=True, help_text='e.g., "9 AM - 12 PM", "after 6 PM"')
    status = models.CharField(max_length=20, choices=CALLBACK_STATUS_CHOICES, default='pending')
    
    # Tracking
    created_at = models.DateTimeField(auto_now_add=True)
    called_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['course', 'status']),
            models.Index(fields=['email']),
        ]

    def __str__(self):
        return f'{self.first_name} - {self.course.title}'


class LearningProgress(models.Model):
    """Model to track detailed learning progress for each module"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    enrollment = models.ForeignKey(CourseEnrollment, on_delete=models.CASCADE, related_name='learning_progress')
    module = models.ForeignKey('courses.CurriculumModule', on_delete=models.CASCADE)
    
    # Progress tracking
    is_completed = models.BooleanField(default=False)
    completion_percentage = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    lessons_completed = models.IntegerField(default=0)
    total_lessons = models.IntegerField(default=0)
    
    # Time tracking
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    total_hours_spent = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    
    last_accessed_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('enrollment', 'module')
        ordering = ['module__order']

    def __str__(self):
        return f'{self.enrollment.user.full_name} - Module {self.module.title}'
