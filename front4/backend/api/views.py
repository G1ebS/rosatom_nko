from rest_framework import viewsets, status, filters
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count
from django.db import models
from django.utils import timezone

from django.contrib.auth import get_user_model
from .models import (
    Category, NGO, Favorite, Event, EventRegistration,
    Review, ActivityHistory, ModerationRequest, ContactMessage,
    Tag, Material, UserLibrary, News
)
from .serializers import (
    UserSerializer, UserRegistrationSerializer, CategorySerializer,
    NGOSerializer, FavoriteSerializer, EventSerializer,
    EventRegistrationSerializer, ReviewSerializer,
    ActivityHistorySerializer, ModerationRequestSerializer,
    ContactMessageSerializer, TagSerializer, MaterialSerializer,
    UserLibrarySerializer, NewsSerializer
)
from .recommendations import get_recommendations

User = get_user_model()


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """API для категорий"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


class NGOViewSet(viewsets.ModelViewSet):
    """API для НКО"""
    queryset = NGO.objects.filter(status='approved')
    serializer_class = NGOSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    # filterset_fields = ['city', 'category']
    search_fields = ['name', 'description', 'short_description']
    ordering_fields = ['rating', 'created_at', 'participants_count']
    ordering = ['-rating', '-created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Фильтр по городу
        print("NGOView base queryset ", queryset.all())
        city = self.request.query_params.get('city')
        print("NGOView city", city)
        if city:
            city = city.strip().split(",")[0].strip()
            print("NGOView city filter", city)
            queryset = queryset.filter(city__icontains=city)
        print("NGOView after city filter", queryset.all())
        # Фильтр по категории
        category = self.request.query_params.get('category')
        print("NGOView category", category)
        print(bool(category))
        if category:
            queryset = queryset.filter(category__slug=category)
        print("NGOView after category filter", queryset.all())
        
        return queryset
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def create(self, request, *args, **kwargs):
        """Создание НКО (требует авторизации)"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(created_by=request.user, status='pending')
        
        # Создание заявки на модерацию
        ModerationRequest.objects.create(ngo=serializer.instance)
        
        # Запись в историю активности
        ActivityHistory.objects.create(
            user=request.user,
            activity_type='view',
            ngo=serializer.instance
        )
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post', 'delete'], permission_classes=[IsAuthenticated])
    def favorite(self, request, pk=None):
        """Добавление/удаление из избранного"""
        ngo = self.get_object()
        
        if request.method == 'POST':
            favorite, created = Favorite.objects.get_or_create(
                user=request.user,
                ngo=ngo
            )
            if created:
                ActivityHistory.objects.create(
                    user=request.user,
                    activity_type='favorite',
                    ngo=ngo
                )
                return Response({'message': 'Добавлено в избранное'}, status=status.HTTP_201_CREATED)
            return Response({'message': 'Уже в избранном'}, status=status.HTTP_200_OK)
        
        elif request.method == 'DELETE':
            Favorite.objects.filter(user=request.user, ngo=ngo).delete()
            return Response({'message': 'Удалено из избранного'}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def favorites(self, request):
        """Список избранных НКО пользователя"""
        favorites = Favorite.objects.filter(user=request.user)
        serializer = FavoriteSerializer(favorites, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def review(self, request, pk=None):
        """Создание отзыва о НКО"""
        ngo = self.get_object()
        serializer = ReviewSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save(ngo=ngo)
        
        ActivityHistory.objects.create(
            user=request.user,
            activity_type='review',
            ngo=ngo,
            metadata={'rating': serializer.data['rating']}
        )
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class EventViewSet(viewsets.ModelViewSet):
    """API для событий"""
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['ngo']
    search_fields = ['title', 'description']
    ordering_fields = ['event_date']
    ordering = ['event_date']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Фильтр по дате (будущие события)
        upcoming = self.request.query_params.get('upcoming')
        if upcoming == 'true':
            queryset = queryset.filter(event_date__gte=timezone.now())
        
        # Фильтр по НКО
        ngo_id = self.request.query_params.get('ngo_id')
        if ngo_id:
            queryset = queryset.filter(ngo_id=ngo_id)
        
        return queryset
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def register(self, request, pk=None):
        """Регистрация на событие"""
        event = self.get_object()
        serializer = EventRegistrationSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save(event=event)
        
        ActivityHistory.objects.create(
            user=request.user,
            activity_type='event_registration',
            event=event
        )
        
        return Response({
            'message': 'Вы успешно зарегистрированы на событие',
            'registration': serializer.data
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['delete'], permission_classes=[IsAuthenticated])
    def unregister(self, request, pk=None):
        """Отмена регистрации на событие"""
        event = self.get_object()
        EventRegistration.objects.filter(user=request.user, event=event).delete()
        return Response({'message': 'Регистрация отменена'}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """Регистрация нового пользователя"""
    print("request.data", request.data)
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        print("serializer is valid")
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    """Получение и обновление текущего пользователя"""
    if request.method == 'GET':
        serializer = UserSerializer(request.user, context={'request': request})
        return Response(serializer.data)
    elif request.method in ['PUT', 'PATCH']:
        serializer = UserSerializer(
            request.user, 
            data=request.data, 
            partial=request.method == 'PATCH',
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recommendations(request):
    """AI-рекомендации для пользователя"""
    rec_type = request.query_params.get('type', 'ngos')
    
    if rec_type == 'ngos':
        recommendations_data = get_recommendations(request.user, 'ngos')
        serializer = NGOSerializer(recommendations_data, many=True, context={'request': request})
        return Response({
            'ngos': serializer.data,
            'type': 'ngos'
        })
    elif rec_type == 'events':
        recommendations_data = get_recommendations(request.user, 'events')
        serializer = EventSerializer(recommendations_data, many=True, context={'request': request})
        return Response({
            'events': serializer.data,
            'type': 'events'
        })
    
    return Response({'error': 'Invalid type'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def search(request):
    """Универсальный поиск"""
    query = request.query_params.get('q', '')
    search_type = request.query_params.get('type', 'all')
    city = request.query_params.get('city', '').strip().split(",")[0].strip()
    
    if not query:
        return Response({'results': {}}, status=status.HTTP_200_OK)
    
    results = {}
    
    if search_type in ['all', 'ngos']:
        ngos = NGO.objects.filter(status='approved')
        if city:
            print("search city", city)
            ngos = ngos.filter(city__icontains=city)
        ngos = ngos.filter(
            Q(name__icontains=query) |
            Q(description__icontains=query) |
            Q(short_description__icontains=query)
        )[:10]
        results['ngos'] = NGOSerializer(ngos, many=True, context={'request': request}).data
    
    if search_type in ['all', 'events']:
        events = Event.objects.filter(event_date__gte=timezone.now())
        if city:
            events = events.filter(ngo__city=city)
        events = events.filter(
            Q(title__icontains=query) |
            Q(description__icontains=query)
        )[:10]
        results['events'] = EventSerializer(events, many=True, context={'request': request}).data
    
    return Response({'results': results})


@api_view(['GET'])
@permission_classes([AllowAny])
def statistics(request):
    """Статистика платформы"""
    stats = {
        'total_ngos': NGO.objects.filter(status='approved').count(),
        'total_events': Event.objects.filter(event_date__gte=timezone.now()).count(),
        'total_users': User.objects.count(),
        'total_registrations': EventRegistration.objects.count(),
        'categories': Category.objects.annotate(
            ngo_count=Count('ngos', filter=Q(ngos__status='approved'))
        ).values('name', 'ngo_count'),
    }
    return Response(stats)


@api_view(['GET'])
@permission_classes([AllowAny])
def map_ngos(request):
    """НКО для карты"""
    city = request.query_params.get('city', '').strip().split(",")[0].strip()
    bounds = request.query_params.get('bounds', '')
    
    ngos = NGO.objects.filter(status='approved')
    
    if city:
        print("map_ngos city", city)
        ngos = ngos.filter(city__icontains=city)
    
    if bounds:
        # Парсинг bounds (формат: "lat1,lng1,lat2,lng2")
        try:
            coords = [float(x) for x in bounds.split(',')]
            if len(coords) == 4:
                min_lat, min_lng, max_lat, max_lng = coords
                ngos = ngos.filter(
                    latitude__gte=min_lat,
                    latitude__lte=max_lat,
                    longitude__gte=min_lng,
                    longitude__lte=max_lng
                )
        except:
            pass
    
    # Только НКО с координатами
    ngos = ngos.exclude(latitude__isnull=True).exclude(longitude__isnull=True)
    
    data = [{
        'id': ngo.id,
        'name': ngo.name,
        'latitude': float(ngo.latitude),
        'longitude': float(ngo.longitude),
        'category': ngo.category.name,
    } for ngo in ngos]
    
    return Response({'data': data})


@api_view(['POST'])
@permission_classes([AllowAny])
def contact(request):
    """Отправка формы контакта"""
    serializer = ContactMessageSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'message': 'Сообщение успешно отправлено!'
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ModerationViewSet(viewsets.ReadOnlyModelViewSet):
    """API для модерации (только для модераторов)"""
    queryset = ModerationRequest.objects.filter(status='pending')
    serializer_class = ModerationRequestSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Только для администраторов
        if not (self.request.user.is_staff or self.request.user.is_superuser):
            return ModerationRequest.objects.none()
        return super().get_queryset()
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Одобрение заявки"""
        moderation_request = self.get_object()
        moderation_request.status = 'approved'
        moderation_request.moderator = request.user
        moderation_request.comment = request.data.get('comment', '')
        moderation_request.reviewed_at = timezone.now()
        moderation_request.save()
        
        # Одобрение НКО
        ngo = moderation_request.ngo
        ngo.status = 'approved'
        ngo.save()
        
        return Response({'message': 'Заявка одобрена'})
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Отклонение заявки"""
        moderation_request = self.get_object()
        moderation_request.status = 'rejected'
        moderation_request.moderator = request.user
        moderation_request.reason = request.data.get('reason', '')
        moderation_request.reviewed_at = timezone.now()
        moderation_request.save()
        
        # Отклонение НКО
        ngo = moderation_request.ngo
        ngo.status = 'rejected'
        ngo.save()
        
        return Response({'message': 'Заявка отклонена'})


class TagViewSet(viewsets.ReadOnlyModelViewSet):
    """API для тегов"""
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [AllowAny]


class MaterialViewSet(viewsets.ReadOnlyModelViewSet):
    """API для материалов"""
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['tags', 'course', 'author']
    search_fields = ['title', 'description', 'course', 'author']
    ordering_fields = ['created_at', 'views_count']
    ordering = ['-created_at']
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def all(self, request):
        materials = Material.objects.all()
        serializer = MaterialSerializer(materials, many=True, context={'request': request})
        return Response(serializer.data)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def save(self, request, pk=None):
        """Добавление материала в библиотеку"""
        material = self.get_object()
        library_item, created = UserLibrary.objects.get_or_create(
            user=request.user,
            material=material,
            defaults={'notes': request.data.get('notes', '')}
        )
        
        if created:
            return Response({'message': 'Материал добавлен в библиотеку'}, status=status.HTTP_201_CREATED)
        else:
            # Обновляем заметки, если они переданы
            if 'notes' in request.data:
                library_item.notes = request.data['notes']
                library_item.save()
            return Response({'message': 'Материал уже в библиотеке'}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['delete'], permission_classes=[IsAuthenticated])
    def unsave(self, request, pk=None):
        """Удаление материала из библиотеки"""
        material = self.get_object()
        UserLibrary.objects.filter(user=request.user, material=material).delete()
        return Response({'message': 'Материал удален из библиотеки'}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'], permission_classes=[AllowAny])
    def view(self, request, pk=None):
        """Увеличение счетчика просмотров"""
        material = self.get_object()
        material.views_count += 1
        material.save(update_fields=['views_count'])
        return Response({'views_count': material.views_count})


class UserLibraryViewSet(viewsets.ModelViewSet):
    """API для библиотеки пользователя"""
    serializer_class = UserLibrarySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        print("UserLibraryView", UserLibrary.objects.filter(user=self.request.user).all())
        return UserLibrary.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class NewsViewSet(viewsets.ModelViewSet):
    """API для новостей"""
    queryset = News.objects.all()
    serializer_class = NewsSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'category']  # city обрабатывается вручную в get_queryset
    search_fields = ['title', 'content', 'snippet']
    ordering_fields = ['created_at', 'published_at', 'views_count']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        # Для неавторизованных пользователей показываем только опубликованные новости
        if not self.request.user.is_authenticated:
            queryset = queryset.filter(status='published')
        # Для авторизованных пользователей показываем опубликованные и их собственные
        elif not self.request.user.is_staff:
            queryset = queryset.filter(
                models.Q(status='published') | 
                models.Q(author=self.request.user)
            )
        
        # Фильтрация по городу: если передан city, показываем новости этого города + глобальные (без города)
        city = self.request.query_params.get('city')
        if city and city.strip():
            queryset = queryset.filter(
                models.Q(city=city.strip()) | 
                models.Q(city='') | 
                models.Q(city__isnull=True)
            )
        
        return queryset
    
    def perform_create(self, serializer):
        """Создание новости (автоматически ставит статус pending)"""
        serializer.save(author=self.request.user, status='pending')
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

