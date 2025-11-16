from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import get_user_model
from .models import (
    Category, NGO, Favorite, Event, EventRegistration,
    Review, ActivityHistory, ModerationRequest, ContactMessage,
    Tag, Material, UserLibrary, News
)

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Сериализатор пользователя"""
    favorites = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                  'city', 'phone', 'avatar', 'bio', 'interests', 'preferences',
                  'favorites', 'is_staff', 'is_superuser', 'date_joined']
        read_only_fields = ['id', 'username', 'is_staff', 'is_superuser', 'date_joined']  # username нельзя менять
    
    def get_favorites(self, obj):
        return list(obj.favorites.values_list('ngo_id', flat=True))


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Сериализатор регистрации пользователя"""
    # password = serializers.CharField(write_only=True, validators=[validate_password]) раскоментить на проде
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 
                  'first_name', 'last_name', 'city', 'phone']
    
    def validate(self, attrs):
        print("validate", attrs)
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Пароли не совпадают"})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        print("before create user", validated_data)
        user = User.objects.create_user(**validated_data)
        print("after create user", user)
        return user


class CategorySerializer(serializers.ModelSerializer):
    """Сериализатор категории"""
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'icon']


class NGOSerializer(serializers.ModelSerializer):
    """Сериализатор НКО"""
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), 
        source='category', 
        write_only=True
    )
    is_favorite = serializers.SerializerMethodField()
    reviews_count = serializers.SerializerMethodField()
    
    class Meta:
        model = NGO
        fields = [
            'id', 'name', 'slug', 'category', 'category_id', 'short_description',
            'description', 'city', 'address', 'website', 'email', 'phone',
            'logo', 'images', 'rating', 'participants_count', 'events_count',
            'status', 'latitude', 'longitude', 'is_favorite', 'reviews_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'rating', 'participants_count', 
                          'events_count', 'status', 'created_at', 'updated_at']
    
    def get_is_favorite(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Favorite.objects.filter(user=request.user, ngo=obj).exists()
        return False
    
    def get_reviews_count(self, obj):
        return obj.reviews.count()


class FavoriteSerializer(serializers.ModelSerializer):
    """Сериализатор избранного"""
    ngo = NGOSerializer(read_only=True)
    
    class Meta:
        model = Favorite
        fields = ['id', 'ngo', 'created_at']
        read_only_fields = ['id', 'created_at']


class EventSerializer(serializers.ModelSerializer):
    """Сериализатор события"""
    ngo = NGOSerializer(read_only=True)
    ngo_id = serializers.PrimaryKeyRelatedField(
        queryset=NGO.objects.all(),
        source='ngo',
        write_only=True
    )
    registered_count = serializers.ReadOnlyField()
    is_registered = serializers.SerializerMethodField()
    
    class Meta:
        model = Event
        fields = [
            'id', 'ngo', 'ngo_id', 'title', 'description', 'event_date',
            'location', 'max_participants', 'image', 'registered_count',
            'is_registered', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_is_registered(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return EventRegistration.objects.filter(
                user=request.user, 
                event=obj
            ).exists()
        return False


class EventRegistrationSerializer(serializers.ModelSerializer):
    """Сериализатор регистрации на событие"""
    event = EventSerializer(read_only=True)
    event_id = serializers.PrimaryKeyRelatedField(
        queryset=Event.objects.all(),
        source='event',
        write_only=True
    )
    
    class Meta:
        model = EventRegistration
        fields = ['id', 'event', 'event_id', 'name', 'email', 'phone', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def validate(self, attrs):
        event = attrs.get('event')
        user = self.context['request'].user
        
        # Проверка на дублирование регистрации
        if EventRegistration.objects.filter(event=event, user=user).exists():
            raise serializers.ValidationError("Вы уже зарегистрированы на это событие")
        
        # Проверка на максимальное количество участников
        if event.max_participants and event.registrations.count() >= event.max_participants:
            raise serializers.ValidationError("Достигнуто максимальное количество участников")
        
        return attrs
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class ReviewSerializer(serializers.ModelSerializer):
    """Сериализатор отзыва"""
    user = UserSerializer(read_only=True)
    ngo = NGOSerializer(read_only=True)
    ngo_id = serializers.PrimaryKeyRelatedField(
        queryset=NGO.objects.all(),
        source='ngo',
        write_only=True
    )
    
    class Meta:
        model = Review
        fields = ['id', 'ngo', 'ngo_id', 'user', 'rating', 'comment', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        review = super().create(validated_data)
        
        # Обновление рейтинга НКО
        ngo = review.ngo
        reviews = ngo.reviews.all()
        if reviews.exists():
            ngo.rating = sum(r.rating for r in reviews) / reviews.count()
            ngo.save()
        
        return review


class ActivityHistorySerializer(serializers.ModelSerializer):
    """Сериализатор истории активности"""
    ngo = NGOSerializer(read_only=True)
    event = EventSerializer(read_only=True)
    
    class Meta:
        model = ActivityHistory
        fields = ['id', 'user', 'activity_type', 'ngo', 'event', 'metadata', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']


class ModerationRequestSerializer(serializers.ModelSerializer):
    """Сериализатор заявки на модерацию"""
    ngo = NGOSerializer(read_only=True)
    moderator = UserSerializer(read_only=True)
    
    class Meta:
        model = ModerationRequest
        fields = ['id', 'ngo', 'moderator', 'status', 'comment', 'reason', 
                 'created_at', 'reviewed_at']
        read_only_fields = ['id', 'moderator', 'created_at', 'reviewed_at']


class ContactMessageSerializer(serializers.ModelSerializer):
    """Сериализатор сообщения контакта"""
    ngo = NGOSerializer(read_only=True)
    ngo_id = serializers.PrimaryKeyRelatedField(
        queryset=NGO.objects.all(),
        source='ngo',
        write_only=True
    )
    
    class Meta:
        model = ContactMessage
        fields = ['id', 'ngo', 'ngo_id', 'name', 'email', 'message', 'created_at', 'is_read']
        read_only_fields = ['id', 'created_at', 'is_read']


class TagSerializer(serializers.ModelSerializer):
    """Сериализатор тега"""
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']
        read_only_fields = ['id']


class MaterialSerializer(serializers.ModelSerializer):
    """Сериализатор материала"""
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(),
        source='tags',
        many=True,
        write_only=True,
        required=False
    )
    is_saved = serializers.SerializerMethodField()
    
    class Meta:
        model = Material
        fields = [
            'id', 'title', 'description', 'course', 'author', 'url',
            'tags', 'tag_ids', 'views_count', 'is_saved',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'views_count', 'created_at', 'updated_at']
    
    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return UserLibrary.objects.filter(user=request.user, material=obj).exists()
        return False


class UserLibrarySerializer(serializers.ModelSerializer):
    """Сериализатор библиотеки пользователя"""
    material = MaterialSerializer(read_only=True)
    material_id = serializers.PrimaryKeyRelatedField(
        queryset=Material.objects.all(),
        source='material',
        write_only=True
    )
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserLibrary
        fields = ['id', 'user', 'material', 'material_id', 'notes', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']


class NewsSerializer(serializers.ModelSerializer):
    """Сериализатор новостей"""
    author = UserSerializer(read_only=True)
    author_name = serializers.SerializerMethodField()
    
    class Meta:
        model = News
        fields = [
            'id', 'title', 'snippet', 'content', 'city', 'category',
            'image', 'author', 'author_name', 'status', 'views_count',
            'created_at', 'updated_at', 'published_at'
        ]
        read_only_fields = ['id', 'author', 'views_count', 'created_at', 'updated_at', 'published_at']
    
    def get_author_name(self, obj):
        return obj.author.username if obj.author else 'Неизвестно'

