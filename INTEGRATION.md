# Интеграция Frontend и Backend

## Что было сделано

### 1. Создана утилита для API запросов
- Файл: `frontend/src/utils/api.js`
- Содержит функции для всех API endpoints
- Базовая обработка ошибок и авторизации

### 2. Обновлен AuthContext
- Интеграция с реальным API
- Автоматическая загрузка пользователя при инициализации
- Методы login, register, logout, updateUser

### 3. Обновлены страницы для работы с API
- **LoginPage**: использует реальный API для входа
- **RegisterPage**: использует реальный API для регистрации
- **NGOListPage**: загружает НКО из API с фильтрацией и пагинацией
- **NGODetailsPage**: загружает детали НКО из API
- **CalendarPage**: загружает события из API

### 4. Обновлен бэкенд
- Добавлен endpoint для обновления профиля пользователя (PATCH /api/auth/me)
- Обновлены CORS настройки для работы в режиме разработки
- Исправлен сериализатор пользователя (username теперь read-only)

## Настройка

### Backend

1. Убедитесь, что установлены все зависимости:
```bash
cd backend
pip install -r requirements.txt
```

2. Примените миграции:
```bash
python manage.py migrate
```

3. Создайте суперпользователя (если еще не создан):
```bash
python manage.py createsuperuser
```

4. Запустите сервер:
```bash
python manage.py runserver
```

Backend будет доступен по адресу: `http://localhost:8000`

### Frontend

1. Установите зависимости:
```bash
cd frontend
npm install
```

2. Создайте файл `.env` в папке `frontend` (опционально):
```
REACT_APP_API_URL=http://localhost:8000/api
```

3. Запустите приложение:
```bash
npm start
```

Frontend будет доступен по адресу: `http://localhost:3000`

## API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход (использует username, но можно передать email если он совпадает с username)
- `GET /api/auth/me` - Получение текущего пользователя
- `PATCH /api/auth/me` - Обновление профиля
- `POST /api/auth/refresh` - Обновление токена

### НКО
- `GET /api/ngos/` - Список НКО (с фильтрацией по city, category, search)
- `GET /api/ngos/{id}/` - Детали НКО
- `POST /api/ngos/{id}/favorite` - Добавить в избранное
- `DELETE /api/ngos/{id}/favorite` - Удалить из избранного
- `GET /api/ngos/favorites/` - Список избранных НКО

### События
- `GET /api/events/` - Список событий
- `GET /api/events/{id}/` - Детали события
- `POST /api/events/{id}/register` - Регистрация на событие
- `DELETE /api/events/{id}/unregister` - Отмена регистрации

### Категории
- `GET /api/categories/` - Список категорий

### Поиск
- `GET /api/search?q={query}&type={all|ngos|events}&city={city}` - Универсальный поиск

## Важные замечания

1. **Логин**: JWT использует `username` для аутентификации. При регистрации email используется как username, поэтому можно входить используя email.

2. **Изображения**: Если изображения не загружаются, убедитесь, что:
   - Backend настроен для раздачи медиа-файлов (в режиме DEBUG это работает автоматически)
   - URL изображений корректно формируется в компонентах

3. **CORS**: В режиме разработки (DEBUG=True) разрешены все origins. В production нужно указать конкретные домены.

4. **Пагинация**: Backend использует пагинацию по умолчанию (9 элементов на страницу). Это можно изменить в `settings.py`.

## Тестирование

1. Зарегистрируйте нового пользователя через `/register`
2. Войдите в систему через `/login`
3. Просмотрите список НКО на `/ngos`
4. Откройте детали НКО и добавьте в избранное
5. Просмотрите календарь событий на `/calendar`
6. Зарегистрируйтесь на событие

## Возможные проблемы

1. **CORS ошибки**: Убедитесь, что backend запущен и CORS настроен правильно
2. **401 Unauthorized**: Проверьте, что токен сохраняется в localStorage и отправляется в заголовках
3. **404 Not Found**: Проверьте, что API URL правильный и backend запущен
4. **Изображения не загружаются**: Проверьте URL изображений и настройки MEDIA_URL в Django

