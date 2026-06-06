import django_filters
from .models import Course


class CourseFilter(django_filters.FilterSet):
    category = django_filters.CharFilter(field_name='category__slug')
    level = django_filters.CharFilter(field_name='level')
    mode = django_filters.CharFilter(field_name='mode')
    min_price = django_filters.NumberFilter(field_name='effective_price', lookup_expr='gte',
                                            method='filter_effective_price_gte')
    max_price = django_filters.NumberFilter(field_name='effective_price', lookup_expr='lte',
                                            method='filter_effective_price_lte')
    is_featured = django_filters.BooleanFilter(field_name='is_featured')
    is_trending = django_filters.BooleanFilter(field_name='is_trending')

    class Meta:
        model = Course
        fields = ['category', 'level', 'mode', 'is_featured', 'is_trending']

    def filter_effective_price_gte(self, queryset, name, value):
        return queryset.filter(
            models.Q(discount_price__gte=value) |
            models.Q(discount_price__isnull=True, price__gte=value)
        )

    def filter_effective_price_lte(self, queryset, name, value):
        return queryset.filter(
            models.Q(discount_price__lte=value) |
            models.Q(discount_price__isnull=True, price__lte=value)
        )
