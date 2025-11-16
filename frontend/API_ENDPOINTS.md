# API Endpoints для платформы "Добрые дела Росатома"

## 🔐 Аутентификация и авторизация

### POST `/api/auth/register`
Регистрация нового пользователя
```json
Request Body:
{
  "email": "user@example.com",
  "password": "password123",
  "name": "Иван Иванов",
  "city": "Ангарск",
  "interests": ["Экология", "Социальная поддержка"]
}

Response:
{
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "Иван Иванов",
    "city": "Ангарск",
    "role": "user",
    "interests": ["Экология", "Социальная поддержка"],
    "favorites": []
  }
}
```

### POST `/api/auth/login`
Вход в систему
```json
Request Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "Иван Иванов",
    "role": "user",
    "favorites": [1, 2, 3]
  }
}
```

### POST `/api/auth/logout`
Выход из системы
```json
Headers: { "Authorization": "Bearer {token}" }
Response: { "message": "Successfully logged out" }
```

### GET `/api/auth/me`
Получение текущего пользователя
```json
Headers: { "Authorization": "Bearer {token}" }
Response:
{
  "id": 1,
  "email": "user@example.com",
  "name": "Иван Иванов",
  "city": "Ангарск",
  "role": "user",
  "interests": ["Экология"],
  "favorites": [1, 2],
  "activityHistory": []
}
```

### PUT `/api/auth/profile`
Обновление профиля пользователя
```json
Headers: { "Authorization": "Bearer {token}" }
Request Body:
{
  "name": "Иван Петров",
  "city": "Нововоронеж",
  "interests": ["Экология", "Культура"]
}

Response:
{
  "id": 1,
  "email": "user@example.com",
  "name": "Иван Петров",
  "city": "Нововоронеж",
  "interests": ["Экология", "Культура"]
}
```

---

## 🏢 НКО (Некоммерческие организации)

### GET `/api/ngos`
Получение списка НКО с фильтрацией и пагинацией
```json
Query Parameters:
- city: string (optional) - фильтр по городу
- category: string (optional) - фильтр по категории
- search: string (optional) - поиск по названию/описанию
- page: number (default: 1) - номер страницы
- limit: number (default: 9) - количество на странице
- sort: string (optional) - сортировка (popular, new, name)

Response:
{
  "data": [
    {
      "id": 1,
      "name": "Эко-друзья",
      "category": "Экология",
      "city": "Ангарск",
      "short_description": "Защита окружающей среды",
      "full_description": "Полное описание...",
      "logo": "https://example.com/logo.jpg",
      "address": "ул. Ленина, 1",
      "website": "https://example.com",
      "phone": "+7 (495) 123-45-67",
      "email": "info@example.com",
      "social_links": {
        "vk": "https://vk.com/example",
        "telegram": "https://t.me/example"
      },
      "projects": ["Проект 1", "Проект 2"],
      "goals": "Цели организации",
      "gallery": ["url1", "url2"],
      "rating": 4.8,
      "volunteers_count": 150,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-15T00:00:00Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_items": 45,
    "items_per_page": 9
  }
}
```

### GET `/api/ngos/:id`
Получение детальной информации о НКО
```json
Response:
{
  "id": 1,
  "name": "Эко-друзья",
  "category": "Экология",
  "city": "Ангарск",
  "short_description": "Краткое описание",
  "full_description": "Полное описание организации...",
  "logo": "https://example.com/logo.jpg",
  "address": "ул. Ленина, 1",
  "website": "https://example.com",
  "phone": "+7 (495) 123-45-67",
  "email": "info@example.com",
  "social_links": {
    "vk": "https://vk.com/example",
    "telegram": "https://t.me/example",
    "website": "https://example.com"
  },
  "projects": [
    {
      "id": 1,
      "title": "Экологический субботник",
      "description": "Регулярные акции по очистке территории"
    }
  ],
  "goals": "Наша миссия — создание устойчивого сообщества...",
  "participation_options": ["Волонтёрство", "Пожертвования", "Партнёрство"],
  "gallery": [
    "https://example.com/photo1.jpg",
    "https://example.com/photo2.jpg"
  ],
  "rating": 4.8,
  "volunteers_count": 150,
  "events_count": 12,
  "is_favorite": false,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### POST `/api/ngos`
Создание нового НКО (требует авторизации и прав модератора/админа)
```json
Headers: { "Authorization": "Bearer {token}" }
Request Body:
{
  "name": "Новое НКО",
  "category": "Экология",
  "city": "Ангарск",
  "short_description": "Краткое описание",
  "full_description": "Полное описание",
  "address": "ул. Ленина, 1",
  "website": "https://example.com",
  "phone": "+7 (495) 123-45-67",
  "email": "info@example.com",
  "social_links": {
    "vk": "https://vk.com/example",
    "telegram": "https://t.me/example"
  }
}

Response:
{
  "id": 10,
  "name": "Новое НКО",
  "status": "pending", // pending, approved, rejected
  "message": "НКО создано и отправлено на модерацию"
}
```

### PUT `/api/ngos/:id`
Обновление НКО (требует авторизации)
```json
Headers: { "Authorization": "Bearer {token}" }
Request Body:
{
  "name": "Обновлённое название",
  "description": "Обновлённое описание"
}

Response:
{
  "id": 1,
  "name": "Обновлённое название",
  "updated_at": "2024-01-20T00:00:00Z"
}
```

### DELETE `/api/ngos/:id`
Удаление НКО (требует прав администратора)
```json
Headers: { "Authorization": "Bearer {token}" }
Response:
{
  "message": "НКО успешно удалено"
}
```

### POST `/api/ngos/:id/favorite`
Добавление НКО в избранное
```json
Headers: { "Authorization": "Bearer {token}" }
Response:
{
  "message": "НКО добавлено в избранное",
  "favorites": [1, 2, 3, 4]
}
```

### DELETE `/api/ngos/:id/favorite`
Удаление НКО из избранного
```json
Headers: { "Authorization": "Bearer {token}" }
Response:
{
  "message": "НКО удалено из избранного",
  "favorites": [1, 2, 3]
}
```

### GET `/api/ngos/:id/events`
Получение событий НКО
```json
Response:
{
  "data": [
    {
      "id": 1,
      "title": "Субботник в парке",
      "date": "2025-11-23T10:00:00Z",
      "description": "Описание события",
      "city": "Ангарск",
      "ngo_id": 1,
      "ngo_name": "Эко-друзья"
    }
  ]
}
```

---

## 📅 События

### GET `/api/events`
Получение списка событий с фильтрацией
```json
Query Parameters:
- city: string (optional) - фильтр по городу
- type: string (optional) - тип события (offline, online)
- date_from: string (optional) - дата начала (ISO format)
- date_to: string (optional) - дата окончания (ISO format)
- ngo_id: number (optional) - фильтр по НКО
- page: number (default: 1)
- limit: number (default: 10)

Response:
{
  "data": [
    {
      "id": 1,
      "title": "Благотворительный концерт",
      "date": "2025-12-05T18:00:00Z",
      "description": "Сбор средств для поддержки семей",
      "city": "Ангарск",
      "address": "ул. Ленина, 1",
      "online": false,
      "format": "offline",
      "ngo_id": 1,
      "ngo_name": "Эко-друзья",
      "participants_count": 50,
      "max_participants": 100,
      "registration_required": true,
      "registration_url": "https://example.com/register",
      "materials": ["url1", "url2"],
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 3,
    "total_items": 25
  }
}
```

### GET `/api/events/:id`
Получение детальной информации о событии
```json
Response:
{
  "id": 1,
  "title": "Благотворительный концерт",
  "date": "2025-12-05T18:00:00Z",
  "description": "Полное описание события",
  "city": "Ангарск",
  "address": "ул. Ленина, 1",
  "coordinates": {
    "lat": 52.5200,
    "lng": 13.4050
  },
  "online": false,
  "format": "offline",
  "online_link": null,
  "ngo_id": 1,
  "ngo_name": "Эко-друзья",
  "participants_count": 50,
  "max_participants": 100,
  "registration_required": true,
  "registration_url": "https://example.com/register",
  "materials": ["url1", "url2"],
  "weather": {
    "temperature": 15,
    "condition": "sunny"
  },
  "is_registered": false,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### POST `/api/events`
Создание нового события (требует авторизации)
```json
Headers: { "Authorization": "Bearer {token}" }
Request Body:
{
  "title": "Новое событие",
  "date": "2025-12-10T18:00:00Z",
  "description": "Описание события",
  "city": "Ангарск",
  "address": "ул. Ленина, 1",
  "online": false,
  "ngo_id": 1,
  "registration_required": true
}

Response:
{
  "id": 10,
  "title": "Новое событие",
  "status": "pending",
  "message": "Событие создано и отправлено на модерацию"
}
```

### PUT `/api/events/:id`
Обновление события
```json
Headers: { "Authorization": "Bearer {token}" }
Request Body:
{
  "title": "Обновлённое название",
  "description": "Обновлённое описание"
}

Response:
{
  "id": 1,
  "title": "Обновлённое название",
  "updated_at": "2024-01-20T00:00:00Z"
}
```

### DELETE `/api/events/:id`
Удаление события
```json
Headers: { "Authorization": "Bearer {token}" }
Response:
{
  "message": "Событие успешно удалено"
}
```

### POST `/api/events/:id/register`
Регистрация на событие
```json
Headers: { "Authorization": "Bearer {token}" }
Request Body:
{
  "name": "Иван Иванов",
  "email": "ivan@example.com",
  "phone": "+7 (495) 123-45-67"
}

Response:
{
  "message": "Вы успешно зарегистрированы на событие",
  "registration_id": 123
}
```

### DELETE `/api/events/:id/register`
Отмена регистрации на событие
```json
Headers: { "Authorization": "Bearer {token}" }
Response:
{
  "message": "Регистрация отменена"
}
```

### POST `/api/events/:id/add-to-plans`
Добавление события в планы пользователя
```json
Headers: { "Authorization": "Bearer {token}" }
Response:
{
  "message": "Событие добавлено в ваши планы"
}
```

---

## 📰 Новости

### GET `/api/news`
Получение списка новостей
```json
Query Parameters:
- city: string (optional) - фильтр по городу
- category: string (optional) - категория новости
- page: number (default: 1)
- limit: number (default: 10)

Response:
{
  "data": [
    {
      "id": 1,
      "title": "Заголовок новости",
      "snippet": "Краткое описание новости",
      "content": "Полный текст новости...",
      "image": "https://example.com/image.jpg",
      "date": "2024-01-15T00:00:00Z",
      "city": "Ангарск",
      "category": "Общие",
      "author": "Администратор",
      "tags": ["экология", "волонтёрство"],
      "views_count": 150,
      "created_at": "2024-01-15T00:00:00Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_items": 45
  }
}
```

### GET `/api/news/:id`
Получение детальной информации о новости
```json
Response:
{
  "id": 1,
  "title": "Заголовок новости",
  "content": "Полный текст новости с форматированием...",
  "image": "https://example.com/image.jpg",
  "date": "2024-01-15T00:00:00Z",
  "city": "Ангарск",
  "category": "Общие",
  "author": "Администратор",
  "tags": ["экология", "волонтёрство"],
  "views_count": 151,
  "related_news": [2, 3, 4],
  "created_at": "2024-01-15T00:00:00Z"
}
```

### POST `/api/news`
Создание новости (требует прав администратора/модератора)
```json
Headers: { "Authorization": "Bearer {token}" }
Request Body:
{
  "title": "Новая новость",
  "content": "Текст новости",
  "snippet": "Краткое описание",
  "city": "Ангарск",
  "category": "Общие",
  "tags": ["экология"],
  "image": "https://example.com/image.jpg"
}

Response:
{
  "id": 10,
  "title": "Новая новость",
  "status": "published",
  "message": "Новость успешно опубликована"
}
```

### PUT `/api/news/:id`
Обновление новости
```json
Headers: { "Authorization": "Bearer {token}" }
Request Body:
{
  "title": "Обновлённый заголовок",
  "content": "Обновлённый текст"
}

Response:
{
  "id": 1,
  "title": "Обновлённый заголовок",
  "updated_at": "2024-01-20T00:00:00Z"
}
```

### DELETE `/api/news/:id`
Удаление новости
```json
Headers: { "Authorization": "Bearer {token}" }
Response:
{
  "message": "Новость успешно удалена"
}
```

---

## 📚 База знаний

### GET `/api/materials`
Получение списка материалов
```json
Query Parameters:
- type: string (optional) - тип материала (PDF, Видео, Ссылка)
- city: string (optional) - фильтр по городу
- category: string (optional) - категория
- page: number (default: 1)
- limit: number (default: 10)

Response:
{
  "data": [
    {
      "id": 1,
      "title": "Руководство по волонтёрству",
      "type": "PDF",
      "link": "https://example.com/file.pdf",
      "description": "Описание материала",
      "city": "Ангарск",
      "category": "Обучение",
      "rating": 4.8,
      "usefulness_count": 150,
      "downloads_count": 200,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 3,
    "total_items": 25
  }
}
```

### GET `/api/materials/:id`
Получение детальной информации о материале
```json
Response:
{
  "id": 1,
  "title": "Руководство по волонтёрству",
  "type": "PDF",
  "link": "https://example.com/file.pdf",
  "description": "Полное описание материала",
  "city": "Ангарск",
  "category": "Обучение",
  "rating": 4.8,
  "usefulness_count": 150,
  "downloads_count": 200,
  "checklist": ["Пункт 1", "Пункт 2"],
  "tags": ["волонтёрство", "обучение"],
  "created_at": "2024-01-01T00:00:00Z"
}
```

### POST `/api/materials/:id/save`
Сохранение материала в личную библиотеку
```json
Headers: { "Authorization": "Bearer {token}" }
Response:
{
  "message": "Материал сохранён в вашу библиотеку"
}
```

### DELETE `/api/materials/:id/save`
Удаление материала из библиотеки
```json
Headers: { "Authorization": "Bearer {token}" }
Response:
{
  "message": "Материал удалён из библиотеки"
}
```

### POST `/api/materials/:id/rate`
Оценка полезности материала
```json
Headers: { "Authorization": "Bearer {token}" }
Request Body:
{
  "rating": 5
}

Response:
{
  "message": "Спасибо за оценку",
  "average_rating": 4.8
}
```

---

## 🤖 AI-рекомендации

### GET `/api/recommendations`
Получение персональных рекомендаций
```json
Headers: { "Authorization": "Bearer {token}" }
Query Parameters:
- type: string (optional) - тип рекомендаций (ngos, events, materials)

Response:
{
  "ngos": [
    {
      "id": 1,
      "name": "Эко-друзья",
      "match_score": 0.95,
      "reason": "Соответствует вашим интересам в экологии"
    }
  ],
  "events": [
    {
      "id": 1,
      "title": "Субботник",
      "match_score": 0.88,
      "reason": "Подходит по вашим интересам"
    }
  ],
  "materials": []
}
```

---

## 🔍 Поиск

### GET `/api/search`
Универсальный поиск по всему контенту
```json
Query Parameters:
- q: string (required) - поисковый запрос
- type: string (optional) - тип контента (ngos, events, news, materials, all)
- city: string (optional) - фильтр по городу
- page: number (default: 1)
- limit: number (default: 10)

Response:
{
  "query": "экология",
  "results": {
    "ngos": [
      {
        "id": 1,
        "name": "Эко-друзья",
        "match_score": 0.95
      }
    ],
    "events": [],
    "news": [],
    "materials": []
  },
  "total_results": 15
}
```

---

## 👤 Пользователь

### GET `/api/user/favorites`
Получение избранных НКО пользователя
```json
Headers: { "Authorization": "Bearer {token}" }
Response:
{
  "data": [
    {
      "id": 1,
      "name": "Эко-друзья",
      "category": "Экология",
      "city": "Ангарск"
    }
  ]
}
```

### GET `/api/user/events`
Получение событий пользователя (зарегистрированные, в планах)
```json
Headers: { "Authorization": "Bearer {token}" }
Query Parameters:
- type: string (optional) - registered, planned, created

Response:
{
  "registered": [
    {
      "id": 1,
      "title": "Субботник",
      "date": "2025-11-23T10:00:00Z"
    }
  ],
  "planned": [],
  "created": []
}
```

### GET `/api/user/library`
Получение сохранённых материалов из базы знаний
```json
Headers: { "Authorization": "Bearer {token}" }
Response:
{
  "data": [
    {
      "id": 1,
      "title": "Руководство по волонтёрству",
      "type": "PDF",
      "saved_at": "2024-01-15T00:00:00Z"
    }
  ]
}
```

### GET `/api/user/activity`
Получение истории активности пользователя
```json
Headers: { "Authorization": "Bearer {token}" }
Response:
{
  "data": [
    {
      "id": 1,
      "type": "event_participation",
      "title": "Субботник в парке",
      "date": "2024-01-15T00:00:00Z",
      "hours": 4
    }
  ],
  "statistics": {
    "total_hours": 120,
    "events_count": 15,
    "funds_raised": 50000
  }
}
```

### GET `/api/user/achievements`
Получение достижений пользователя
```json
Headers: { "Authorization": "Bearer {token}" }
Response:
{
  "data": [
    {
      "id": 1,
      "title": "Первые шаги",
      "description": "Участие в первом событии",
      "icon": "🏆",
      "unlocked_at": "2024-01-15T00:00:00Z"
    }
  ],
  "level": 5,
  "points": 1250
}
```

---

## 🛡️ Модерация

### GET `/api/moderation/pending`
Получение списка заявок на модерацию
```json
Headers: { "Authorization": "Bearer {token}" } // Требует прав модератора
Query Parameters:
- type: string (optional) - ngo, event, news
- page: number (default: 1)

Response:
{
  "data": [
    {
      "id": 1,
      "type": "ngo",
      "title": "Новое НКО",
      "submitted_by": {
        "id": 5,
        "name": "Иван Иванов"
      },
      "submitted_at": "2024-01-20T00:00:00Z",
      "status": "pending"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 2,
    "total_items": 15
  }
}
```

### POST `/api/moderation/:id/approve`
Одобрение заявки
```json
Headers: { "Authorization": "Bearer {token}" }
Request Body:
{
  "comment": "Одобрено" // optional
}

Response:
{
  "message": "Заявка одобрена",
  "item": {
    "id": 1,
    "status": "approved"
  }
}
```

### POST `/api/moderation/:id/reject`
Отклонение заявки
```json
Headers: { "Authorization": "Bearer {token}" }
Request Body:
{
  "reason": "Причина отклонения"
}

Response:
{
  "message": "Заявка отклонена",
  "item": {
    "id": 1,
    "status": "rejected"
  }
}
```

---

## 🗺️ Карта

### GET `/api/map/ngos`
Получение НКО для отображения на карте
```json
Query Parameters:
- bounds: string (optional) - границы карты (lat1,lng1,lat2,lng2)
- city: string (optional) - фильтр по городу

Response:
{
  "data": [
    {
      "id": 1,
      "name": "Эко-друзья",
      "coordinates": {
        "lat": 52.5200,
        "lng": 13.4050
      },
      "city": "Ангарск",
      "category": "Экология"
    }
  ]
}
```

---

## 📊 Статистика

### GET `/api/statistics`
Получение общей статистики платформы
```json
Response:
{
  "ngos_count": 150,
  "events_count": 200,
  "volunteers_count": 5000,
  "cities_count": 32,
  "total_hours": 50000,
  "funds_raised": 1000000
}
```

### GET `/api/statistics/city/:city`
Получение статистики по городу
```json
Response:
{
  "city": "Ангарск",
  "ngos_count": 15,
  "events_count": 25,
  "volunteers_count": 500,
  "upcoming_events": 5
}
```

---

## 📧 Контакты и обратная связь

### POST `/api/contact`
Отправка сообщения через форму контакта
```json
Request Body:
{
  "ngo_id": 1, // optional
  "name": "Иван Иванов",
  "email": "ivan@example.com",
  "message": "Текст сообщения",
  "subject": "Вопрос о волонтёрстве"
}

Response:
{
  "message": "Сообщение успешно отправлено",
  "id": 123
}
```

---

## 📝 Примечания

### Коды ответов HTTP:
- `200 OK` - успешный запрос
- `201 Created` - ресурс создан
- `400 Bad Request` - неверные параметры запроса
- `401 Unauthorized` - требуется авторизация
- `403 Forbidden` - недостаточно прав
- `404 Not Found` - ресурс не найден
- `422 Unprocessable Entity` - ошибка валидации
- `500 Internal Server Error` - ошибка сервера

### Пагинация:
Все списковые endpoints поддерживают пагинацию через параметры:
- `page` - номер страницы (начиная с 1)
- `limit` - количество элементов на странице

### Фильтрация:
Большинство endpoints поддерживают фильтрацию через query parameters

### Сортировка:
Поддерживается через параметр `sort`:
- `popular` - по популярности
- `new` - новые сначала
- `name` - по алфавиту
- `date` - по дате

### Авторизация:
Endpoints, требующие авторизации, должны включать заголовок:
```
Authorization: Bearer {jwt-token}
```

### Формат дат:
Все даты в формате ISO 8601: `2024-01-15T10:30:00Z`

