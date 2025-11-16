# Инструкция по настройке базы данных

## Шаг 1: Применение миграций

После добавления новых моделей (Material, Tag, UserLibrary) нужно применить миграции:

```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

## Шаг 2: Загрузка данных из CSV

После применения миграций загрузите данные из CSV файлов:

```bash
cd backend
python manage.py load_csv_data
```

Эта команда:
- Загрузит НКО из `api/res.csv`
- Загрузит материалы из `api/materials.csv`
- Создаст категории и теги автоматически

## Шаг 3: Создание администратора

Создайте администратора для доступа к админ-панели:

```bash
cd backend
python manage.py createsuperuser
```

Подробнее см. `CREATE_ADMIN.md`

## Проверка

После выполнения всех шагов:

1. Проверьте что НКО загружены:
   ```bash
   python manage.py shell
   >>> from api.models import NGO
   >>> NGO.objects.count()
   ```

2. Проверьте что материалы загружены:
   ```bash
   >>> from api.models import Material
   >>> Material.objects.count()
   ```

3. Проверьте что теги созданы:
   ```bash
   >>> from api.models import Tag
   >>> Tag.objects.count()
   ```

## Структура CSV файлов

### res.csv (НКО)
Формат: `Город; Категория; Название; Описание; Ссылка`
- Разделитель: `;`
- Все поля обязательны кроме ссылки

### materials.csv (Материалы)
Формат: `Теги; Название; Курс; Автор; Ссылка`
- Разделитель: `;`
- Теги разделены `{{`
- Обязательны: Название, Ссылка

## API Endpoints

После загрузки данных доступны новые endpoints:

- `GET /api/materials/` - Список материалов
- `GET /api/materials/{id}/` - Детали материала
- `POST /api/materials/{id}/save/` - Добавить в библиотеку
- `DELETE /api/materials/{id}/unsave/` - Удалить из библиотеки
- `GET /api/library/` - Библиотека пользователя
- `GET /api/tags/` - Список тегов

