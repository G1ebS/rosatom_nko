"""
Команда для загрузки данных из CSV файлов в базу данных
Использование: python manage.py load_csv_data
"""
import csv
import os
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from django.db import transaction
from api.models import Category, NGO, Tag, Material


class Command(BaseCommand):
    help = 'Загружает данные из res.csv и materials.csv в базу данных'

    def handle(self, *args, **options):
        # Получаем путь к директории api
        import django
        from django.conf import settings
        api_dir = os.path.join(settings.BASE_DIR, 'api')
        
        # Загрузка НКО из res.csv
        ngo_file = os.path.join(api_dir, 'res.csv')
        if os.path.exists(ngo_file):
            self.load_ngos(ngo_file)
        else:
            self.stdout.write(self.style.WARNING(f'Файл {ngo_file} не найден'))
        
        # Загрузка материалов из materials.csv
        material_file = os.path.join(api_dir, 'materials.csv')
        if os.path.exists(material_file):
            self.load_materials(material_file)
        else:
            self.stdout.write(self.style.WARNING(f'Файл {material_file} не найден'))
        
        self.stdout.write(self.style.SUCCESS('Данные успешно загружены!'))

    @transaction.atomic
    def load_ngos(self, csv_file):
        """Загрузка НКО из res.csv"""
        self.stdout.write('Загрузка НКО...')
        
        if not os.path.exists(csv_file):
            self.stdout.write(self.style.WARNING(f'Файл {csv_file} не найден'))
            return
        
        with open(csv_file, 'r', encoding='utf-8') as f:
            reader = csv.reader(f, delimiter=';')
            count = 0
            skipped = 0
            row_num = 0
            
            for row in reader:
                row_num += 1
                
                # Пропускаем пустые строки
                if not row or all(not cell.strip() for cell in row):
                    continue
                
                # Минимум 3 поля: город, категория, название
                if len(row) < 3:
                    self.stdout.write(self.style.WARNING(f'Строка {row_num}: недостаточно полей ({len(row)}), пропущена'))
                    skipped += 1
                    continue
                
                city = row[0].strip() if len(row) > 0 else ''
                category_name = row[1].strip() if len(row) > 1 else ''
                name = row[2].strip() if len(row) > 2 else ''
                description = row[3].strip() if len(row) > 3 else ''
                website = row[4].strip() if len(row) > 4 else ''
                
                if not name:
                    self.stdout.write(self.style.WARNING(f'Строка {row_num}: пустое название, пропущена'))
                    skipped += 1
                    continue
                
                if not category_name:
                    self.stdout.write(self.style.WARNING(f'Строка {row_num}: пустая категория, пропущена'))
                    skipped += 1
                    continue
                
                # Получаем или создаем категорию
                category_slug = slugify(category_name)
                category, _ = Category.objects.get_or_create(
                    slug=category_slug,
                    defaults={'name': category_name}
                )
                
                # Создаем уникальный slug из name + city для избежания дубликатов
                if city:
                    slug_base = f"{name} {city}"
                else:
                    slug_base = name
                
                ngo_slug = slugify(slug_base)
                
                # Если slug уже существует, добавляем суффикс
                original_slug = ngo_slug
                counter = 1
                while NGO.objects.filter(slug=ngo_slug).exists():
                    ngo_slug = f"{original_slug}-{counter}"
                    counter += 1
                
                # Создаем НКО
                ngo, created = NGO.objects.get_or_create(
                    slug=ngo_slug,
                    defaults={
                        'name': name,
                        'category': category,
                        'city': city if city else 'Не указан',
                        'short_description': description[:300] if description else f'НКО: {name}',
                        'description': description if description else f'НКО: {name}',
                        'website': website if website and website != '-' else '',
                        'status': 'approved',  # Автоматически одобряем загруженные НКО
                    }
                )
                
                if created:
                    count += 1
                else:
                    self.stdout.write(self.style.WARNING(f'Строка {row_num}: НКО "{name}" уже существует (slug: {ngo_slug})'))
            
            self.stdout.write(self.style.SUCCESS(f'Загружено {count} НКО'))
            if skipped > 0:
                self.stdout.write(self.style.WARNING(f'Пропущено {skipped} строк'))

    @transaction.atomic
    def load_materials(self, csv_file):
        """Загрузка материалов из materials.csv"""
        self.stdout.write('Загрузка материалов...')
        
        if not os.path.exists(csv_file):
            self.stdout.write(self.style.WARNING(f'Файл {csv_file} не найден'))
            return
        
        with open(csv_file, 'r', encoding='utf-8') as f:
            reader = csv.reader(f, delimiter=';')
            count = 0
            
            for row in reader:
                if len(row) < 5:
                    continue
                
                tags_str = row[0].strip()
                title = row[1].strip()
                course = row[2].strip() if len(row) > 2 else ''
                author = row[3].strip() if len(row) > 3 else ''
                url = row[4].strip() if len(row) > 4 else ''
                
                if not title or not url:
                    continue
                
                # Создаем материал
                material, created = Material.objects.get_or_create(
                    url=url,
                    defaults={
                        'title': title,
                        'course': course,
                        'author': author,
                    }
                )
                
                if created:
                    # Обрабатываем теги (разделены {{)
                    if tags_str:
                        tag_names = [t.strip() for t in tags_str.split('{{') if t.strip()]
                        for tag_name in tag_names:
                            tag_slug = slugify(tag_name)
                            tag, _ = Tag.objects.get_or_create(
                                slug=tag_slug,
                                defaults={'name': tag_name}
                            )
                            material.tags.add(tag)
                    
                    count += 1
            
            self.stdout.write(self.style.SUCCESS(f'Загружено {count} материалов'))

