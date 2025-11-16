# Backend API для платформы "Добрые дела Росатома"

Django Rest Framework backend для платформы НКО.

## Установка

1. Создайте виртуальное окружение:
```bash
python -m venv venv
```

2. Активируйте виртуальное окружение:
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

3. Установите зависимости:
```bash
pip install -r requirements.txt
```

4. Примените миграции:
```bash
python manage.py makemigrations
python manage.py migrate
```

5. Создайте суперпользователя:
```bash
python manage.py createsuperuser
```

6. Запустите сервер:
```bash
python manage.py runserver
```

API будет доступен по адресу: `http://localhost:8000/api/`

## Переменные окружения

Создайте файл `.env` в корне проекта (опционально):

```
SECRET_KEY=your-secret-key-here
DEBUG=True
HUGGINGFACE_API_KEY=your-huggingface-api-key
```

## API Endpoints

### Аутентификация

- `POST /api/auth/register` - Регистрация пользователя
- `POST /api/auth/login` - Вход (получение JWT токена)
- `POST /api/auth/refresh` - Обновление токена
- `GET /api/auth/me` - Получение текущего пользователя

### НКО

- `GET /api/ngos/` - Список НКО (с фильтрацией и поиском)
- `GET /api/ngos/{id}/` - Детали НКО
- `POST /api/ngos/` - Создание НКО (требует авторизации)
- `POST /api/ngos/{id}/favorite` - Добавить в избранное
- `DELETE /api/ngos/{id}/favorite` - Удалить из избранного
- `GET /api/ngos/favorites/` - Список избранных НКО
- `POST /api/ngos/{id}/review` - Создать отзыв

**Параметры фильтрации:**
- `city` - фильтр по городу
- `category` - фильтр по категории (slug)
- `search` - поиск по названию и описанию
- `ordering` - сортировка (rating, created_at, participants_count)

### События

- `GET /api/events/` - Список событий
- `GET /api/events/{id}/` - Детали события
- `POST /api/events/{id}/register` - Регистрация на событие
- `DELETE /api/events/{id}/unregister` - Отмена регистрации

**Параметры:**
- `upcoming=true` - только будущие события
- `ngo_id` - фильтр по НКО

### Категории

- `GET /api/categories/` - Список категорий

### Рекомендации

- `GET /api/recommendations?type=ngos` - Рекомендации НКО
- `GET /api/recommendations?type=events` - Рекомендации событий

### Поиск

- `GET /api/search?q=query&type=all&city=city` - Универсальный поиск

### Статистика

- `GET /api/statistics` - Статистика платформы

### Карта

- `GET /api/map/ngos?city=city&bounds=lat1,lng1,lat2,lng2` - НКО для карты

### Контакты

- `POST /api/contact` - Отправка формы контакта

### Модерация

- `GET /api/moderation/` - Список заявок на модерацию
- `POST /api/moderation/{id}/approve` - Одобрить заявку
- `POST /api/moderation/{id}/reject` - Отклонить заявку

## Примеры использования

### Регистрация пользователя

```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "user123",
  "email": "user@example.com",
  "password": "password123",
  "password_confirm": "password123",
  "first_name": "Иван",
  "last_name": "Иванов",
  "city": "Москва"
}
```

### Получение списка НКО с фильтрацией

```bash
GET /api/ngos/?city=Москва&category=экология&search=природа
Authorization: Bearer {token}
```

### Добавление в избранное

```bash
POST /api/ngos/1/favorite
Authorization: Bearer {token}
```

### Регистрация на событие

```bash
POST /api/events/1/register
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Иван Иванов",
  "email": "user@example.com",
  "phone": "+79001234567"
}
```

### Получение рекомендаций

```bash
GET /api/recommendations?type=ngos
Authorization: Bearer {token}
```

## Структура проекта

```
backend/
├── config/          # Настройки Django
├── api/             # Основное приложение
│   ├── models.py    # Модели данных
│   ├── serializers.py  # Сериализаторы
│   ├── views.py     # API views
│   ├── urls.py      # URL маршруты
│   └── recommendations.py  # Логика рекомендаций
├── manage.py
├── requirements.txt
└── README.md
```

## Модели данных

- **User** - Пользователь (расширенная модель)
- **Category** - Категории НКО
- **NGO** - Некоммерческие организации
- **Favorite** - Избранные НКО
- **Event** - События
- **EventRegistration** - Регистрации на события
- **Review** - Отзывы о НКО
- **ActivityHistory** - История активности пользователя
- **ModerationRequest** - Заявки на модерацию
- **ContactMessage** - Сообщения через форму контакта

## AI-рекомендации

Система рекомендаций использует алгоритм на основе правил:
- Фильтрация по городу пользователя
- Совпадение категорий с интересами
- Популярность НКО (участники, события)
- Рейтинг НКО
- История активности пользователя

Опционально можно интегрировать Hugging Face API для более продвинутых рекомендаций (требует настройки `HUGGINGFACE_API_KEY`).

## Разработка

Для разработки рекомендуется использовать SQLite (по умолчанию). Для production используйте PostgreSQL или другую подходящую БД.

## Лицензия

Проект для платформы "Добрые дела Росатома"

