# Быстрый старт

## Шаг 1: Применить миграции

```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

## Шаг 2: Загрузить данные из CSV

```bash
python manage.py load_csv_data
```

Это загрузит:
- НКО из `backend/api/res.csv`
- Материалы из `backend/api/materials.csv`

## Шаг 3: Создать администратора

```bash
python manage.py createsuperuser
```

Введите username и password (например: `admin` / `admin123`)

## Шаг 4: Запустить серверы

**Backend:**
```bash
cd backend
python manage.py runserver
```

**Frontend:**
```bash
cd frontend
npm start
```

## Вход как администратор

1. Откройте `http://localhost:3000`
2. Перейдите на `/login`
3. Введите username и password администратора
4. После входа увидите ссылку "Админка" в шапке сайта

## Что изменилось

✅ Добавлены материалы с тегами (из materials.csv)
✅ Добавлена библиотека пользователя (сохранение материалов)
✅ Админка скрыта от обычных пользователей
✅ НКО загружаются из res.csv
✅ Все загруженные НКО автоматически одобрены

## Проверка

После загрузки данных проверьте:

```bash
python manage.py shell
```

```python
from api.models import NGO, Material, Tag

# Количество НКО
print(f"НКО: {NGO.objects.count()}")

# Количество материалов
print(f"Материалы: {Material.objects.count()}")

# Количество тегов
print(f"Теги: {Tag.objects.count()}")
```

