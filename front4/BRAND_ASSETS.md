# Бренд-активы Росатома

Этот документ описывает использование официальных логотипов и значков Росатома в проекте.

## Источник

Официальный брендбук Росатома доступен по адресу:
**https://rosatom-service.ru/style/files/BB_GD_RUS_WEB_full_med.pdf**

PDF файл сохранен в корне проекта как `rosatom_brand_guide.pdf`.

## Структура директорий

```
public/
├── logos/          # Официальные логотипы Росатома
│   ├── rosatom-logo-full.svg
│   ├── rosatom-logo-symbol.svg
│   ├── rosatom-logo-white.svg
│   └── rosatom-logo-symbol-white.svg
└── icons/          # Иконки и значки из брендбука
```

## Использование логотипов

### В компоненте RosatomLogo

Компонент `RosatomLogo` поддерживает два режима:

#### 1. Встроенный SVG (по умолчанию)
```jsx
import RosatomLogo from './components/RosatomLogo'

// Цветной логотип
<RosatomLogo height={32} />

// Белый логотип для темного фона
<RosatomLogo variant="white" height={32} />

// Только символ атома
<RosatomLogo variant="symbol" height={40} />
```

#### 2. Официальные SVG файлы
```jsx
// Использование официальных файлов из public/logos
<RosatomLogo useOfficial={true} height={32} />
<RosatomLogo useOfficial={true} variant="white" height={32} />
<RosatomLogo useOfficial={true} variant="symbol" height={40} />
```

### Прямое использование файлов

```jsx
import logoFull from '/logos/rosatom-logo-full.svg'
import logoSymbol from '/logos/rosatom-logo-symbol.svg'

<img src={logoFull} alt="Росатом" height={40} />
<img src={logoSymbol} alt="Росатом" height={40} />
```

## Варианты логотипов

| Вариант | Описание | Файл |
|---------|----------|------|
| `default` | Цветной логотип с текстом | `rosatom-logo-full.svg` |
| `white` | Белый логотип с текстом (для темного фона) | `rosatom-logo-white.svg` |
| `symbol` | Только символ атома (цветной) | `rosatom-logo-symbol.svg` |
| `symbol-white` | Только символ атома (белый) | `rosatom-logo-symbol-white.svg` |

## Извлечение дополнительных активов из PDF

### Метод 1: Python скрипт

1. Установите зависимости:
```bash
pip install pdf2image pillow
# macOS
brew install poppler
# Ubuntu/Debian
sudo apt-get install poppler-utils
```

2. Запустите скрипт:
```bash
python3 extract_logos.py
```

3. Извлеченные изображения будут сохранены в `extracted_images/`

4. Выберите нужные логотипы и иконки и скопируйте их в:
   - `public/logos/` для логотипов
   - `public/icons/` для иконок

### Метод 2: ImageMagick

```bash
convert rosatom_brand_guide.pdf rosatom_brand_guide-%02d.png
```

### Метод 3: Онлайн-конвертеры

Используйте онлайн-сервисы для конвертации PDF в изображения:
- PDF24
- SmallPDF
- ILovePDF

## Цветовая палитра

Официальные цвета Росатома:

- **Основной синий**: `#003D82`
- **Акцентный зеленый**: `#00A651`
- **Белый**: `#FFFFFF`

Эти цвета уже настроены в `tailwind.config.js`:
- `primary`: `#003D82`
- `accent`: `#00A651`

## Рекомендации по использованию

1. **Минимальный размер**: Логотип должен быть читаемым. Минимальная высота: 20px для символа, 30px для полного логотипа.

2. **Зона безопасности**: Оставляйте свободное пространство вокруг логотипа (минимум 20% от высоты логотипа).

3. **Фон**: 
   - Цветной логотип на светлом фоне
   - Белый логотип на темном/цветном фоне

4. **Формат**: Предпочтительно использовать SVG для масштабируемости.

## Обновление логотипов

Если в брендбуке появились обновленные версии логотипов:

1. Извлеките новые файлы из PDF
2. Замените файлы в `public/logos/`
3. Обновите компонент `RosatomLogo` при необходимости
4. Проверьте отображение на всех страницах

## Иконки

Иконки из брендбука следует размещать в `public/icons/` и организовать по категориям:

```
public/icons/
├── social/        # Социальные иконки
├── navigation/    # Навигационные иконки
├── actions/       # Иконки действий
└── categories/    # Иконки категорий
```

Использование:
```jsx
import icon from '/icons/categories/environment.svg'
<img src={icon} alt="Экология" className="w-6 h-6" />
```

