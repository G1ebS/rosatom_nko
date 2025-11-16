from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import (
    User, Category, NGO, Favorite, Event, EventRegistration,
    Review, ActivityHistory, ModerationRequest, ContactMessage,
    Tag, Material, UserLibrary, News
)


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'city', 'created_at']
    list_filter = ['city', 'created_at']
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Дополнительная информация', {'fields': ('city', 'phone', 'avatar', 'bio', 'interests', 'preferences')}),
    )


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(NGO)
class NGOAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'city', 'status', 'rating', 'created_at']
    list_filter = ['status', 'category', 'city', 'created_at']
    search_fields = ['name', 'description', 'city']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ['user', 'ngo', 'created_at']
    list_filter = ['created_at']


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['title', 'ngo', 'event_date', 'location']
    list_filter = ['event_date', 'ngo']
    search_fields = ['title', 'description']


@admin.register(EventRegistration)
class EventRegistrationAdmin(admin.ModelAdmin):
    list_display = ['user', 'event', 'name', 'email', 'created_at']
    list_filter = ['created_at', 'event']


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['user', 'ngo', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']


@admin.register(ActivityHistory)
class ActivityHistoryAdmin(admin.ModelAdmin):
    list_display = ['user', 'activity_type', 'ngo', 'created_at']
    list_filter = ['activity_type', 'created_at']


@admin.register(ModerationRequest)
class ModerationRequestAdmin(admin.ModelAdmin):
    list_display = ['ngo', 'status', 'moderator', 'created_at']
    list_filter = ['status', 'created_at']


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'ngo', 'is_read', 'created_at']
    list_filter = ['is_read', 'created_at']


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name']


@admin.register(Material)
class MaterialAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'author', 'views_count', 'created_at']
    list_filter = ['course', 'author', 'created_at', 'tags']
    search_fields = ['title', 'description', 'course', 'author']
    filter_horizontal = ['tags']
    readonly_fields = ['views_count', 'created_at', 'updated_at']


@admin.register(UserLibrary)
class UserLibraryAdmin(admin.ModelAdmin):
    list_display = ['user', 'material', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'material__title']


@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'status', 'city', 'category', 'created_at', 'views_count']
    list_filter = ['status', 'category', 'city', 'created_at']
    search_fields = ['title', 'content', 'snippet', 'author__username']
    readonly_fields = ['created_at', 'updated_at', 'published_at', 'views_count']
    prepopulated_fields = {}

