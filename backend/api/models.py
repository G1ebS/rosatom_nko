from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator


class User(AbstractUser):
    """Расширенная модель пользователя"""
    city = models.CharField(max_length=100, blank=True, verbose_name='Город')
    phone = models.CharField(max_length=20, blank=True, verbose_name='Телефон')
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True, verbose_name='Аватар')
    bio = models.TextField(blank=True, verbose_name='О себе')
    interests = models.JSONField(default=list, blank=True, verbose_name='Интересы')
    preferences = models.JSONField(default=dict, blank=True, verbose_name='Предпочтения')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'

    def __str__(self):
        return self.username


class Category(models.Model):
    """Категории НКО"""
    name = models.CharField(max_length=100, unique=True, verbose_name='Название')
    slug = models.SlugField(unique=True, verbose_name='URL')
    description = models.TextField(blank=True, verbose_name='Описание')
    icon = models.CharField(max_length=50, blank=True, verbose_name='Иконка')

    class Meta:
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'
        ordering = ['name']

    def __str__(self):
        return self.name


class NGO(models.Model):
    """Некоммерческая организация"""
    STATUS_CHOICES = [
        ('pending', 'На модерации'),
        ('approved', 'Одобрено'),
        ('rejected', 'Отклонено'),
    ]

    name = models.CharField(max_length=200, verbose_name='Название')
    slug = models.SlugField(unique=True, verbose_name='URL')
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='ngos', verbose_name='Категория')
    short_description = models.CharField(max_length=300, verbose_name='Краткое описание')
    description = models.TextField(verbose_name='Описание')
    city = models.CharField(max_length=100, verbose_name='Город')
    address = models.CharField(max_length=300, blank=True, verbose_name='Адрес')
    website = models.URLField(blank=True, verbose_name='Сайт')
    email = models.EmailField(blank=True, verbose_name='Email')
    phone = models.CharField(max_length=20, blank=True, verbose_name='Телефон')
    logo = models.ImageField(upload_to='ngo_logos/', null=True, blank=True, verbose_name='Логотип')
    images = models.JSONField(default=list, blank=True, verbose_name='Изображения')
    
    # Статистика
    rating = models.FloatField(default=0.0, validators=[MinValueValidator(0), MaxValueValidator(5)], verbose_name='Рейтинг')
    participants_count = models.IntegerField(default=0, verbose_name='Количество участников')
    events_count = models.IntegerField(default=0, verbose_name='Количество событий')
    
    # Модерация
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name='Статус')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_ngos', verbose_name='Создано пользователем')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')
    
    # Координаты для карты
    latitude = models.FloatField(null=True, blank=True, verbose_name='Широта')
    longitude = models.FloatField(null=True, blank=True, verbose_name='Долгота')

    class Meta:
        verbose_name = 'НКО'
        verbose_name_plural = 'НКО'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['city', 'status']),
            models.Index(fields=['category', 'status']),
        ]

    def __str__(self):
        return self.name


class Favorite(models.Model):
    """Избранные НКО пользователя"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites', verbose_name='Пользователь')
    ngo = models.ForeignKey(NGO, on_delete=models.CASCADE, related_name='favorited_by', verbose_name='НКО')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата добавления')

    class Meta:
        verbose_name = 'Избранное'
        verbose_name_plural = 'Избранное'
        unique_together = ['user', 'ngo']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.ngo.name}"


class Event(models.Model):
    """События НКО"""
    ngo = models.ForeignKey(NGO, on_delete=models.CASCADE, related_name='events', verbose_name='НКО')
    title = models.CharField(max_length=200, verbose_name='Название')
    description = models.TextField(verbose_name='Описание')
    event_date = models.DateTimeField(verbose_name='Дата события')
    location = models.CharField(max_length=300, verbose_name='Место проведения')
    max_participants = models.IntegerField(null=True, blank=True, verbose_name='Максимум участников')
    image = models.ImageField(upload_to='event_images/', null=True, blank=True, verbose_name='Изображение')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')

    class Meta:
        verbose_name = 'Событие'
        verbose_name_plural = 'События'
        ordering = ['event_date']
        indexes = [
            models.Index(fields=['event_date']),
            models.Index(fields=['ngo']),
        ]

    def __str__(self):
        return self.title

    @property
    def registered_count(self):
        return self.registrations.count()


class EventRegistration(models.Model):
    """Регистрация на событие"""
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='registrations', verbose_name='Событие')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='event_registrations', verbose_name='Пользователь')
    name = models.CharField(max_length=200, verbose_name='Имя')
    email = models.EmailField(verbose_name='Email')
    phone = models.CharField(max_length=20, blank=True, verbose_name='Телефон')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата регистрации')

    class Meta:
        verbose_name = 'Регистрация на событие'
        verbose_name_plural = 'Регистрации на события'
        unique_together = ['event', 'user']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.event.title}"


class Review(models.Model):
    """Отзывы о НКО"""
    ngo = models.ForeignKey(NGO, on_delete=models.CASCADE, related_name='reviews', verbose_name='НКО')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews', verbose_name='Пользователь')
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)], verbose_name='Рейтинг')
    comment = models.TextField(verbose_name='Комментарий')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')

    class Meta:
        verbose_name = 'Отзыв'
        verbose_name_plural = 'Отзывы'
        unique_together = ['ngo', 'user']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.ngo.name} ({self.rating})"


class ActivityHistory(models.Model):
    """История активности пользователя"""
    ACTIVITY_TYPES = [
        ('view', 'Просмотр'),
        ('favorite', 'Добавлено в избранное'),
        ('event_registration', 'Регистрация на событие'),
        ('review', 'Отзыв'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activity_history', verbose_name='Пользователь')
    activity_type = models.CharField(max_length=20, choices=ACTIVITY_TYPES, verbose_name='Тип активности')
    ngo = models.ForeignKey(NGO, on_delete=models.CASCADE, null=True, blank=True, related_name='activities', verbose_name='НКО')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, null=True, blank=True, related_name='activities', verbose_name='Событие')
    metadata = models.JSONField(default=dict, blank=True, verbose_name='Метаданные')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата активности')

    class Meta:
        verbose_name = 'История активности'
        verbose_name_plural = 'История активности'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'activity_type']),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.get_activity_type_display()}"


class ModerationRequest(models.Model):
    """Заявки на модерацию"""
    STATUS_CHOICES = [
        ('pending', 'На рассмотрении'),
        ('approved', 'Одобрено'),
        ('rejected', 'Отклонено'),
    ]

    ngo = models.ForeignKey(NGO, on_delete=models.CASCADE, related_name='moderation_requests', verbose_name='НКО')
    moderator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='moderated_requests', verbose_name='Модератор')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name='Статус')
    comment = models.TextField(blank=True, verbose_name='Комментарий модератора')
    reason = models.TextField(blank=True, verbose_name='Причина отклонения')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    reviewed_at = models.DateTimeField(null=True, blank=True, verbose_name='Дата рассмотрения')

    class Meta:
        verbose_name = 'Заявка на модерацию'
        verbose_name_plural = 'Заявки на модерацию'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.ngo.name} - {self.get_status_display()}"


class ContactMessage(models.Model):
    """Сообщения через форму контакта"""
    ngo = models.ForeignKey(NGO, on_delete=models.CASCADE, related_name='contact_messages', verbose_name='НКО')
    name = models.CharField(max_length=200, verbose_name='Имя')
    email = models.EmailField(verbose_name='Email')
    message = models.TextField(verbose_name='Сообщение')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата отправки')
    is_read = models.BooleanField(default=False, verbose_name='Прочитано')

    class Meta:
        verbose_name = 'Сообщение'
        verbose_name_plural = 'Сообщения'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.ngo.name}"


class Tag(models.Model):
    """Теги для материалов"""
    name = models.CharField(max_length=100, unique=True, verbose_name='Название')
    slug = models.SlugField(unique=True, verbose_name='URL')

    class Meta:
        verbose_name = 'Тег'
        verbose_name_plural = 'Теги'
        ordering = ['name']

    def __str__(self):
        return self.name


class Material(models.Model):
    """Материалы для базы знаний"""
    title = models.CharField(max_length=300, verbose_name='Название')
    description = models.TextField(blank=True, verbose_name='Описание')
    course = models.CharField(max_length=200, blank=True, verbose_name='Курс')
    author = models.CharField(max_length=200, blank=True, verbose_name='Автор')
    url = models.URLField(verbose_name='Ссылка')
    tags = models.ManyToManyField(Tag, related_name='materials', blank=True, verbose_name='Теги')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')
    views_count = models.IntegerField(default=0, verbose_name='Количество просмотров')

    class Meta:
        verbose_name = 'Материал'
        verbose_name_plural = 'Материалы'
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class UserLibrary(models.Model):
    """Библиотека пользователя - сохраненные материалы"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='library_items', verbose_name='Пользователь')
    material = models.ForeignKey(Material, on_delete=models.CASCADE, related_name='saved_by', verbose_name='Материал')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата добавления')
    notes = models.TextField(blank=True, verbose_name='Заметки пользователя')

    class Meta:
        verbose_name = 'Элемент библиотеки'
        verbose_name_plural = 'Библиотека пользователя'
        unique_together = ['user', 'material']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.material.title}"


class News(models.Model):
    """Новости"""
    STATUS_CHOICES = [
        ('pending', 'На модерации'),
        ('published', 'Опубликовано'),
        ('rejected', 'Отклонено'),
    ]
    
    title = models.CharField(max_length=300, verbose_name='Заголовок')
    snippet = models.CharField(max_length=500, blank=True, verbose_name='Краткое описание')
    content = models.TextField(verbose_name='Содержание')
    city = models.CharField(max_length=100, blank=True, verbose_name='Город')
    category = models.CharField(max_length=100, blank=True, default='Общие', verbose_name='Категория')
    image = models.ImageField(upload_to='news_images/', null=True, blank=True, verbose_name='Изображение')
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='news', verbose_name='Автор')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name='Статус')
    views_count = models.IntegerField(default=0, verbose_name='Количество просмотров')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')
    published_at = models.DateTimeField(null=True, blank=True, verbose_name='Дата публикации')

    class Meta:
        verbose_name = 'Новость'
        verbose_name_plural = 'Новости'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'created_at']),
            models.Index(fields=['city']),
        ]

    def __str__(self):
        return self.title