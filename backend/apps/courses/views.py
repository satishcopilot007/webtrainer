from rest_framework import generics, permissions, status, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Mentor, Course, CourseReview
from .serializers import (CategorySerializer, MentorSerializer, CourseListSerializer,
                          CourseDetailSerializer, CourseReviewSerializer)
from .filters import CourseFilter


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = None


class CategoryDetailView(generics.RetrieveAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'


class MentorListView(generics.ListAPIView):
    queryset = Mentor.objects.filter(is_active=True)
    serializer_class = MentorSerializer
    pagination_class = None


class MentorDetailView(generics.RetrieveAPIView):
    queryset = Mentor.objects.filter(is_active=True)
    serializer_class = MentorSerializer
    lookup_field = 'slug'


class CourseListView(generics.ListAPIView):
    queryset = Course.objects.filter(is_published=True).select_related('category', 'mentor')
    serializer_class = CourseListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = CourseFilter
    search_fields = ['title', 'short_description', 'tools_covered']
    ordering_fields = ['price', 'created_at', 'rating', 'enrollment_count']


class CourseDetailView(generics.RetrieveAPIView):
    queryset = Course.objects.filter(is_published=True).select_related(
        'category', 'mentor'
    ).prefetch_related('curriculum', 'batches', 'reviews')
    serializer_class = CourseDetailSerializer
    lookup_field = 'slug'


class FeaturedCoursesView(generics.ListAPIView):
    queryset = Course.objects.filter(is_published=True, is_featured=True).select_related('category', 'mentor')[:8]
    serializer_class = CourseListSerializer
    pagination_class = None


class TrendingCoursesView(generics.ListAPIView):
    queryset = Course.objects.filter(is_published=True, is_trending=True).select_related('category', 'mentor')[:8]
    serializer_class = CourseListSerializer
    pagination_class = None


class CourseReviewCreateView(generics.CreateAPIView):
    serializer_class = CourseReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        course = Course.objects.get(slug=self.kwargs['slug'])
        serializer.save(user=self.request.user, course=course)


class CourseByCategoryView(generics.ListAPIView):
    serializer_class = CourseListSerializer

    def get_queryset(self):
        return Course.objects.filter(
            is_published=True,
            category__slug=self.kwargs['slug']
        ).select_related('category', 'mentor')
