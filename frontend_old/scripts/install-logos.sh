#!/bin/bash

# Скрипт для установки официальных логотипов Росатома
# Использование: ./scripts/install-logos.sh <путь_к_скачанным_файлам>

LOGOS_DIR="public/logos"
SOURCE_DIR="$1"

if [ -z "$SOURCE_DIR" ]; then
    echo "Использование: $0 <путь_к_папке_со_скачанными_логотипами>"
    echo ""
    echo "Пример:"
    echo "  $0 ~/Downloads/rosatom-logos"
    exit 1
fi

if [ ! -d "$SOURCE_DIR" ]; then
    echo "Ошибка: Папка '$SOURCE_DIR' не найдена"
    exit 1
fi

echo "Поиск логотипов в $SOURCE_DIR..."

# Создаем директорию если не существует
mkdir -p "$LOGOS_DIR"

# Функция для поиска и копирования файлов
find_and_copy() {
    local pattern="$1"
    local dest="$2"
    local found=$(find "$SOURCE_DIR" -type f -iname "$pattern" | head -1)
    
    if [ -n "$found" ]; then
        echo "  Найден: $found -> $dest"
        cp "$found" "$LOGOS_DIR/$dest"
        return 0
    else
        echo "  Не найден: $pattern"
        return 1
    fi
}

echo ""
echo "Копирование файлов..."

# Ищем полный логотип (цветной)
find_and_copy "*logo*full*.svg" "rosatom-logo-full.svg" || \
find_and_copy "*logo*full*.png" "rosatom-logo-full.png" || \
find_and_copy "*logo*horizontal*.svg" "rosatom-logo-full.svg" || \
find_and_copy "*logo*horizontal*.png" "rosatom-logo-full.png"

# Ищем полный логотип (белый)
find_and_copy "*logo*white*.svg" "rosatom-logo-white.svg" || \
find_and_copy "*logo*white*.png" "rosatom-logo-white.png" || \
find_and_copy "*logo*light*.svg" "rosatom-logo-white.svg" || \
find_and_copy "*logo*light*.png" "rosatom-logo-white.png"

# Ищем символ (цветной)
find_and_copy "*symbol*.svg" "rosatom-logo-symbol.svg" || \
find_and_copy "*symbol*.png" "rosatom-logo-symbol.png" || \
find_and_copy "*icon*.svg" "rosatom-logo-symbol.svg" || \
find_and_copy "*icon*.png" "rosatom-logo-symbol.png"

# Ищем символ (белый)
find_and_copy "*symbol*white*.svg" "rosatom-logo-symbol-white.svg" || \
find_and_copy "*symbol*white*.png" "rosatom-logo-symbol-white.png" || \
find_and_copy "*symbol*light*.svg" "rosatom-logo-symbol-white.svg" || \
find_and_copy "*symbol*light*.png" "rosatom-logo-symbol-white.png"

echo ""
echo "Готово! Проверьте файлы в $LOGOS_DIR"
echo ""
echo "Если файлы имеют другие имена, переименуйте их вручную:"
echo "  - Полный логотип (цветной) -> rosatom-logo-full.svg"
echo "  - Полный логотип (белый) -> rosatom-logo-white.svg"
echo "  - Символ (цветной) -> rosatom-logo-symbol.svg"
echo "  - Символ (белый) -> rosatom-logo-symbol-white.svg"

