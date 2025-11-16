# Руководство по интеграции Frontend и Backend

## Настройка Backend

1. Перейдите в директорию backend:
```bash
cd backend
```

2. Установите зависимости:
```bash
pip install -r requirements.txt
```

3. Примените миграции:
```bash
python manage.py migrate
```

4. Создайте суперпользователя (опционально):
```bash
python manage.py createsuperuser
```

5. Загрузите тестовые данные (если есть CSV файлы):
```bash
python manage.py load_csv_data
```

6. Запустите сервер:
```bash
python manage.py runserver
```

Backend будет доступен по адресу: `http://localhost:8000`

## Настройка Frontend

1. Создайте файл `.env` в корне проекта (на основе `.env.example`):
```env
REACT_APP_API_URL=http://localhost:8000/api
```

2. Установите зависимости:
```bash
npm install
```

3. Запустите dev сервер:
```bash
npm start
```

Frontend будет доступен по адресу: `http://localhost:3000`

## CORS настройки

CORS уже настроен в `backend/config/settings.py`:
- В режиме разработки (`DEBUG=True`) разрешены все origins
- В production укажите конкретные домены в `CORS_ALLOWED_ORIGINS`

## API Endpoints

Все API endpoints доступны через `/api/`:
- `/api/auth/login` - вход
- `/api/auth/register` - регистрация
- `/api/auth/me` - текущий пользователь
- `/api/ngos/` - список НКО
- `/api/events/` - список событий
- `/api/materials/` - материалы
- `/api/news/` - новости
- `/api/categories/` - категории

Полный список endpoints см. в `API_ENDPOINTS.md`

## Структура API Service

API service находится в `src/services/api.js` и предоставляет методы для:
- `authAPI` - аутентификация
- `ngoAPI` - работа с НКО
- `eventAPI` - работа с событиями
- `materialAPI` - работа с материалами
- `newsAPI` - работа с новостями
- `categoryAPI` - категории
- `recommendationsAPI` - рекомендации
- `statisticsAPI` - статистика

## Обновленные компоненты

Следующие компоненты обновлены для работы с API:
- `AuthContext` - использует реальные API endpoints
- `LoginPage` - подключен к backend
- `RegisterPage` - подключен к backend
- `NGOListPage` - загружает данные с API
- `NewsPage` - загружает данные с API
- `KnowledgeBasePage` - загружает данные с API

## Фирменный стиль

Применены официальные цвета и стили Росатома:
- Основной цвет: `#1a2165` (темно-синий)
- Светлый синий: `#4896d2`
- Зеленый акцент: `#00A651`
- Шрифт: Rosatom (Regular, Light, Bold, Italic)

Добавлены паттерны и градиенты на основе фирменного стиля.

## Troubleshooting

### Ошибка CORS
Убедитесь, что backend запущен и CORS настроен правильно.

### Ошибка подключения к API
Проверьте переменную окружения `REACT_APP_API_URL` в `.env`

### Токен не сохраняется
Проверьте, что localStorage доступен в браузере.

