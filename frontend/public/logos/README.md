# Логотипы Росатом

Эта директория содержит официальные логотипы и значки Росатома.

## Доступные файлы

- `rosatom-logo-full.svg` - Полный логотип с текстом "РОСАТОМ" (цветной)
- `rosatom-logo-symbol.svg` - Только символ атома (цветной)
- `rosatom-logo-white.svg` - Полный логотип с текстом (белый, для темного фона)
- `rosatom-logo-symbol-white.svg` - Только символ атома (белый, для темного фона)

## Извлечение дополнительных логотипов из PDF

Официальный брендбук Росатома находится по адресу:
https://rosatom-service.ru/style/files/BB_GD_RUS_WEB_full_med.pdf

Для извлечения изображений из PDF можно использовать:

### Вариант 1: Python с pdf2image
```bash
pip install pdf2image pillow
python extract_logos.py
```

### Вариант 2: ImageMagick
```bash
convert rosatom_brand_guide.pdf rosatom_brand_guide-%02d.png
```

### Вариант 3: Онлайн-сервисы
Используйте онлайн-конвертеры PDF в изображения для извлечения логотипов.

## Использование в компонентах

```jsx
import logoFull from '/logos/rosatom-logo-full.svg';
import logoSymbol from '/logos/rosatom-logo-symbol.svg';

<img src={logoFull} alt="Росатом" />
```

## Цветовая палитра

- Основной синий: `#003D82`
- Акцентный зеленый: `#00A651`
- Белый: `#FFFFFF` (для темных фонов)

