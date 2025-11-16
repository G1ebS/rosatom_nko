"""
Модуль для AI-рекомендаций
Реализует алгоритм рекомендаций на основе правил и опционально внешние AI-сервисы
"""
from django.conf import settings


def get_recommendations(user, rec_type='ngos', limit=5):
    """
    Получение рекомендаций для пользователя
    
    Args:
        user: Объект пользователя
        rec_type: Тип рекомендаций ('ngos' или 'events')
        limit: Количество рекомендаций
    
    Returns:
        Список рекомендованных объектов
    """
    if rec_type == 'ngos':
        return get_ngo_recommendations(user, limit)
    elif rec_type == 'events':
        return get_event_recommendations(user, limit)
    return []


def get_ngo_recommendations(user, limit=5):
    """Рекомендации НКО на основе правил"""
    from .models import NGO, Favorite, Review, ActivityHistory
    
    # Базовый queryset - только одобренные НКО
    ngos = NGO.objects.filter(status='approved')
    
    # Фильтр по городу пользователя
    if user.city:
        ngos = ngos.filter(city=user.city)
    
    # Получаем уже просмотренные/избранные НКО
    favorite_ngo_ids = Favorite.objects.filter(user=user).values_list('ngo_id', flat=True)
    viewed_ngo_ids = ActivityHistory.objects.filter(
        user=user,
        activity_type='view'
    ).values_list('ngo_id', flat=True)
    excluded_ids = list(set(list(favorite_ngo_ids) + list(viewed_ngo_ids)))
    
    if excluded_ids:
        ngos = ngos.exclude(id__in=excluded_ids)
    
    # Подсчет баллов для каждого НКО
    scored_ngos = []
    user_interests = user.interests or []
    
    for ngo in ngos:
        score = 0
        
        # Совпадение категории с интересами пользователя
        if user_interests and ngo.category.name in user_interests:
            score += 10
        
        # Популярность (количество участников)
        score += min(ngo.participants_count / 10, 5)
        
        # Активность (количество событий)
        score += min(ngo.events_count, 5)
        
        # Рейтинг
        score += ngo.rating * 2
        
        # Если пользователь оставлял отзывы на похожие НКО
        similar_reviews = Review.objects.filter(
            user=user,
            ngo__category=ngo.category
        ).count()
        if similar_reviews > 0:
            score += 3
        
        scored_ngos.append({
            'ngo': ngo,
            'score': score
        })
    
    # Сортировка по баллам
    scored_ngos.sort(key=lambda x: x['score'], reverse=True)
    
    # Возвращаем топ-N
    recommended_ngos = [item['ngo'] for item in scored_ngos[:limit]]
    
    # Если не хватает рекомендаций, добавляем случайные
    if len(recommended_ngos) < limit:
        remaining = limit - len(recommended_ngos)
        additional = NGO.objects.filter(status='approved').exclude(
            id__in=[n.id for n in recommended_ngos]
        )[:remaining]
        recommended_ngos.extend(additional)
    
    return recommended_ngos


def get_event_recommendations(user, limit=5):
    """Рекомендации событий на основе правил"""
    from .models import Event, EventRegistration, ActivityHistory
    from django.utils import timezone
    
    # Будущие события
    events = Event.objects.filter(event_date__gte=timezone.now())
    
    # Фильтр по городу пользователя
    if user.city:
        events = events.filter(ngo__city=user.city)
    
    # Исключаем уже зарегистрированные события
    registered_event_ids = EventRegistration.objects.filter(
        user=user
    ).values_list('event_id', flat=True)
    
    if registered_event_ids:
        events = events.exclude(id__in=registered_event_ids)
    
    # Подсчет баллов
    scored_events = []
    user_interests = user.interests or []
    
    for event in events:
        score = 0
        
        # Совпадение категории НКО с интересами
        if user_interests and event.ngo.category.name in user_interests:
            score += 10
        
        # Популярность события
        score += min(event.registered_count / 5, 5)
        
        # Рейтинг НКО
        score += event.ngo.rating * 2
        
        # Близость события (чем ближе, тем выше балл)
        days_until = (event.event_date.date() - timezone.now().date()).days
        if days_until <= 7:
            score += 5
        elif days_until <= 30:
            score += 3
        
        scored_events.append({
            'event': event,
            'score': score
        })
    
    # Сортировка
    scored_events.sort(key=lambda x: x['score'], reverse=True)
    
    # Возвращаем топ-N
    recommended_events = [item['event'] for item in scored_events[:limit]]
    
    return recommended_events


def get_ai_recommendations_huggingface(user, ngos, limit=5):
    """
    Получение рекомендаций через Hugging Face API
    Требует настройки HUGGINGFACE_API_KEY в settings
    """
    if not settings.HUGGINGFACE_API_KEY:
        return get_ngo_recommendations(user, limit)
    
    try:
        # Формируем запрос к Hugging Face
        user_text = f"Интересы: {', '.join(user.interests or [])}. Город: {user.city or 'не указан'}"
        
        ngo_texts = [f"{ngo.name}: {ngo.short_description}" for ngo in ngos]
        
        # Здесь должна быть логика получения эмбеддингов и сравнения
        # Упрощенная версия - возвращаем рекомендации на основе правил
        return get_ngo_recommendations(user, limit)
        
    except Exception as e:
        # В случае ошибки возвращаем рекомендации на основе правил
        return get_ngo_recommendations(user, limit)

