# Инструкция по исправлению проблемы с миграциями

## Проблема
Ошибка: `django.db.migrations.exceptions.InconsistentMigrationHistory: Migration admin.0001_initial is applied before its dependency api.0001_initial`

Это происходит потому, что миграции admin были применены до создания миграций api, но admin зависит от api (используется кастомная модель User).

## Решение

### Вариант 1: Удалить базу данных и создать заново (рекомендуется для разработки)

1. **Остановите сервер Django** (Ctrl+C в терминале где запущен `python manage.py runserver`)

2. **Удалите базу данных:**
   ```bash
   cd backend
   del db.sqlite3
   ```
   Или вручную удалите файл `backend/db.sqlite3`

3. **Примените миграции:**
   ```bash
   python manage.py migrate
   ```

4. **Создайте суперпользователя (если нужно):**
   ```bash
   python manage.py createsuperuser
   ```

5. **Запустите сервер снова:**
   ```bash
   python manage.py runserver
   ```

### Вариант 2: Исправить существующую базу данных

1. **Остановите сервер Django**

2. **Запустите скрипт исправления:**
   ```bash
   cd backend
   python fix_migrations.py
   ```

3. **Примените миграции:**
   ```bash
   python manage.py migrate
   ```

4. **Запустите сервер снова:**
   ```bash
   python manage.py runserver
   ```

## После исправления

После применения миграций регистрация должна работать корректно.

