# Создание администратора

## Способ 1: Через Django команду (рекомендуется)

```bash
cd backend
python manage.py createsuperuser
```

Вам будет предложено ввести:
- Username (имя пользователя)
- Email (опционально)
- Password (пароль - будет скрыт при вводе)
- Password confirmation (подтверждение пароля)

После создания вы сможете войти в систему используя эти данные.

## Способ 2: Через Django shell

```bash
cd backend
python manage.py shell
```

Затем выполните:

```python
from api.models import User

# Создание суперпользователя
admin = User.objects.create_superuser(
    username='admin',
    email='admin@example.com',
    password='your_password_here',
    first_name='Администратор',
    city='Москва'
)

print(f"Создан администратор: {admin.username}")
```

## Способ 3: Сделать существующего пользователя администратором

```bash
cd backend
python manage.py shell
```

```python
from api.models import User

# Найти пользователя
user = User.objects.get(username='username_here')

# Сделать администратором
user.is_staff = True
user.is_superuser = True
user.save()

print(f"Пользователь {user.username} теперь администратор")
```

## Вход в систему

После создания администратора:

1. Откройте фронтенд приложение
2. Перейдите на страницу входа (`/login`)
3. Введите username и password администратора
4. После входа вы увидите ссылку "Админка" в шапке сайта (только для администраторов)

## Проверка прав

Администратор должен иметь:
- `is_staff = True` - доступ к админ-панели Django
- `is_superuser = True` - полные права администратора

Оба флага можно установить через Django shell или админ-панель Django.

## Доступ к админ-панели Django

Также доступна стандартная админ-панель Django:
- URL: `http://localhost:8000/admin/`
- Используйте те же credentials что и для входа в приложение

