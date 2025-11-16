#!/usr/bin/env python3
"""
Скрипт для извлечения логотипов и значков из PDF брендбука Росатома
Требует установки: pip install pdf2image pillow
"""

import os
from pathlib import Path
try:
    from pdf2image import convert_from_path
    from PIL import Image
except ImportError:
    print("Требуется установка библиотек:")
    print("pip install pdf2image pillow")
    print("\nТакже требуется poppler:")
    print("macOS: brew install poppler")
    print("Ubuntu: sudo apt-get install poppler-utils")
    exit(1)

def extract_images_from_pdf(pdf_path, output_dir):
    """Извлекает изображения из PDF"""
    pdf_path = Path(pdf_path)
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    if not pdf_path.exists():
        print(f"Файл не найден: {pdf_path}")
        return
    
    print(f"Извлечение изображений из {pdf_path}...")
    
    try:
        # Конвертируем PDF в изображения
        images = convert_from_path(str(pdf_path), dpi=300)
        
        print(f"Найдено страниц: {len(images)}")
        
        # Сохраняем каждую страницу
        for i, image in enumerate(images):
            page_path = output_dir / f"page_{i+1:03d}.png"
            image.save(page_path, 'PNG')
            print(f"Сохранено: {page_path}")
        
        print(f"\nВсе изображения сохранены в: {output_dir}")
        print("Теперь вы можете вручную выбрать нужные логотипы и сохранить их в public/logos/")
        
    except Exception as e:
        print(f"Ошибка при извлечении: {e}")
        print("\nУбедитесь, что установлен poppler:")
        print("macOS: brew install poppler")
        print("Ubuntu: sudo apt-get install poppler-utils")

if __name__ == "__main__":
    pdf_file = "rosatom_brand_guide.pdf"
    output_directory = "extracted_images"
    
    extract_images_from_pdf(pdf_file, output_directory)

