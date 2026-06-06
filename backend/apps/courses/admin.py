from django.contrib import admin
from .models import Category, Mentor, Course, CurriculumModule, BatchSchedule, CourseReview


class CurriculumModuleInline(admin.TabularInline):
    model = CurriculumModule
    extra = 1


class BatchScheduleInline(admin.TabularInline):
    model = BatchSchedule
    extra = 0


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_featured', 'order', 'course_count')
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ('is_featured', 'order')


@admin.register(Mentor)
class MentorAdmin(admin.ModelAdmin):
    list_display = ('name', 'title', 'experience_years', 'is_active', 'order')
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ('is_active', 'order')


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'level', 'price', 'discount_price',
                    'is_published', 'is_featured', 'is_trending', 'enrollment_count')
    list_filter = ('category', 'level', 'is_published', 'is_featured', 'is_trending')
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ('title', 'short_description')
    list_editable = ('is_published', 'is_featured', 'is_trending')
    inlines = [CurriculumModuleInline, BatchScheduleInline]


@admin.register(CourseReview)
class CourseReviewAdmin(admin.ModelAdmin):
    list_display = ('course', 'user', 'rating', 'is_approved', 'created_at')
    list_filter = ('is_approved', 'rating')
    list_editable = ('is_approved',)
