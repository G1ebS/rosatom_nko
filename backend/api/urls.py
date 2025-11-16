from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    CategoryViewSet, NGOViewSet, EventViewSet, ModerationViewSet,
    TagViewSet, MaterialViewSet, UserLibraryViewSet, NewsViewSet,
    register_user, get_current_user, recommendations, search,
    statistics, map_ngos, contact
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'ngos', NGOViewSet, basename='ngo')
router.register(r'events', EventViewSet, basename='event')
router.register(r'moderation', ModerationViewSet, basename='moderation')
router.register(r'tags', TagViewSet, basename='tag')
router.register(r'materials', MaterialViewSet, basename='material')
router.register(r'library', UserLibraryViewSet, basename='library')
router.register(r'news', NewsViewSet, basename='news')

urlpatterns = [
    # Аутентификация
    path('auth/register', register_user, name='register'),
    path('auth/login', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me', get_current_user, name='current_user'),
    
    # Рекомендации
    path('recommendations', recommendations, name='recommendations'),
    
    # Поиск
    path('search', search, name='search'),
    
    # Статистика
    path('statistics', statistics, name='statistics'),
    
    # Карта
    path('map/ngos', map_ngos, name='map_ngos'),
    
    # Контакты
    path('contact', contact, name='contact'),
    
    # Router endpoints
    path('', include(router.urls)),
]

