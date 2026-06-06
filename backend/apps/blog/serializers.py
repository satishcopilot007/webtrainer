from rest_framework import serializers
from .models import BlogPost


class BlogPostListSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.full_name', read_only=True)

    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'author_name', 'category',
            'excerpt', 'featured_image', 'tags', 'views_count',
            'created_at', 'updated_at',
        ]


class BlogPostDetailSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.full_name', read_only=True)

    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'author_name', 'category',
            'content', 'excerpt', 'featured_image', 'tags',
            'is_published', 'views_count', 'created_at', 'updated_at',
        ]
