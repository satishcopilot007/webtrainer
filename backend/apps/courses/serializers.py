from rest_framework import serializers
from .models import Category, Mentor, Course, CurriculumModule, BatchSchedule, CourseReview


class CategorySerializer(serializers.ModelSerializer):
    course_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'icon', 'color',
                  'image', 'is_featured', 'course_count']


class MentorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mentor
        fields = ['id', 'name', 'slug', 'title', 'bio', 'photo',
                  'experience_years', 'specializations', 'linkedin_url',
                  'twitter_url', 'github_url']


class CurriculumModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CurriculumModule
        fields = ['id', 'title', 'topics', 'duration_hours', 'order']


class BatchScheduleSerializer(serializers.ModelSerializer):
    seats_available = serializers.IntegerField(read_only=True)

    class Meta:
        model = BatchSchedule
        fields = ['id', 'batch_name', 'start_date', 'end_date', 'timing',
                  'max_students', 'enrolled_count', 'seats_available', 'is_active']


class CourseReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.full_name', read_only=True)

    class Meta:
        model = CourseReview
        fields = ['id', 'user_name', 'rating', 'review', 'created_at']
        read_only_fields = ['id', 'created_at']


class CourseListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    mentor = MentorSerializer(read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
    effective_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Course
        fields = ['id', 'title', 'slug', 'category', 'mentor', 'short_description',
                  'thumbnail', 'level', 'mode', 'duration_hours', 'duration_weeks',
                  'price', 'discount_price', 'discount_percentage', 'effective_price',
                  'is_featured', 'is_trending', 'is_bestseller', 'enrollment_count',
                  'rating', 'review_count', 'tools_covered', 'highlights']


class CourseDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    mentor = MentorSerializer(read_only=True)
    curriculum = CurriculumModuleSerializer(many=True, read_only=True)
    batches = BatchScheduleSerializer(many=True, read_only=True, source='batches')
    reviews = CourseReviewSerializer(many=True, read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
    effective_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Course
        fields = ['id', 'title', 'slug', 'category', 'mentor', 'short_description',
                  'description', 'thumbnail', 'level', 'mode', 'duration_hours',
                  'duration_weeks', 'price', 'discount_price', 'discount_percentage',
                  'effective_price', 'highlights', 'prerequisites', 'tools_covered',
                  'career_opportunities', 'is_featured', 'is_trending', 'is_bestseller',
                  'enrollment_count', 'rating', 'review_count', 'curriculum', 'batches',
                  'reviews', 'meta_title', 'meta_description', 'created_at']
