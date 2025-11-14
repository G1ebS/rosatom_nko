# AI-рекомендации для платформы "Добрые дела Росатома"

## Обзор

AI-рекомендательная система поможет пользователям находить наиболее подходящие НКО и события на основе их интересов, истории активности и предпочтений.

## 🆓 Бесплатные варианты

### 1. Hugging Face Inference API (Рекомендуется)
- **Бесплатно**: до 1000 запросов в месяц
- **Регистрация**: https://huggingface.co/settings/tokens
- **Модель**: `sentence-transformers/all-MiniLM-L6-v2`
- **Использование**: См. `src/utils/aiRecommendations.js`

### 2. Cohere API
- **Бесплатно**: 100 запросов в месяц
- **Регистрация**: https://cohere.com/
- **Модель**: `embed-english-v2.0`

### 3. Локальный алгоритм (без API)
- **Бесплатно**: Работает всегда
- **Алгоритм**: На основе правил и совпадений
- **Использование**: `getRuleBasedRecommendations()`

## Архитектура решения

### 1. Сбор данных о пользователе

```javascript
// Пример структуры данных пользователя
const userProfile = {
  id: 1,
  interests: ['Экология', 'Социальная поддержка', 'Культура'],
  city: 'Ангарск',
  activityHistory: [
    { ngoId: 1, rating: 5, date: '2024-01-15' },
    { eventId: 3, attended: true, date: '2024-02-20' }
  ],
  savedNGOs: [1, 5, 8],
  savedEvents: [2, 4],
  preferences: {
    preferredCategories: ['Экология', 'Социальная поддержка'],
    preferredActivityTypes: ['Волонтёрство', 'Обучение'],
    timeAvailability: 'weekends'
  }
}
```

### 2. Алгоритм рекомендаций

#### Вариант A: Простой алгоритм на основе правил (для MVP)

```javascript
// src/utils/recommendations.js

export function getRecommendations(user, ngos, events) {
  const scores = []
  
  // 1. Фильтрация по городу
  const cityFiltered = ngos.filter(ngo => ngo.city === user.city)
  
  // 2. Подсчёт баллов на основе интересов
  cityFiltered.forEach(ngo => {
    let score = 0
    
    // Совпадение категорий
    if (user.interests.includes(ngo.category)) {
      score += 10
    }
    
    // Популярность НКО (количество участников)
    score += Math.min(ngo.participantsCount / 10, 5)
    
    // Активность НКО (количество событий)
    score += Math.min(ngo.eventsCount, 5)
    
    // Рейтинг НКО
    score += ngo.rating * 2
    
    scores.push({ ngo, score })
  })
  
  // 3. Сортировка по баллам
  scores.sort((a, b) => b.score - a.score)
  
  return scores.slice(0, 5).map(item => item.ngo)
}
```

#### Вариант B: Машинное обучение (для production)

### Использование библиотек ML:

1. **TensorFlow.js** - для браузерного ML
2. **ML5.js** - упрощённый интерфейс для ML
3. **Collaborative Filtering** - для рекомендаций на основе похожих пользователей

```javascript
// Пример с TensorFlow.js
import * as tf from '@tensorflow/tfjs'

// Создание модели
const model = tf.sequential({
  layers: [
    tf.layers.dense({ inputShape: [10], units: 64, activation: 'relu' }),
    tf.layers.dense({ units: 32, activation: 'relu' }),
    tf.layers.dense({ units: 1, activation: 'sigmoid' })
  ]
})

// Обучение модели на исторических данных
async function trainModel(userData, interactions) {
  // Подготовка данных
  const xs = tf.tensor2d(userData)
  const ys = tf.tensor2d(interactions)
  
  // Обучение
  await model.fit(xs, ys, {
    epochs: 100,
    batchSize: 32,
    validationSplit: 0.2
  })
}

// Получение рекомендаций
function getMLRecommendations(userFeatures) {
  const prediction = model.predict(tf.tensor2d([userFeatures]))
  return prediction.dataSync()
}
```

### 3. Интеграция с внешними AI-сервисами

#### OpenAI API (GPT-4)

```javascript
// src/services/aiRecommendations.js

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY
})

export async function getAIRecommendations(userProfile, ngos) {
  const prompt = `
    Пользователь интересуется: ${userProfile.interests.join(', ')}
    Город: ${userProfile.city}
    История активности: ${JSON.stringify(userProfile.activityHistory)}
    
    Доступные НКО:
    ${ngos.map(ngo => `- ${ngo.name} (${ngo.category}): ${ngo.short_description}`).join('\n')}
    
    Рекомендуй 3 наиболее подходящих НКО с объяснением почему.
    Ответ в формате JSON:
    {
      "recommendations": [
        {
          "ngoId": 1,
          "reason": "Подходит потому что...",
          "matchScore": 0.95
        }
      ]
    }
  `
  
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "Ты помощник по подбору НКО для волонтёров." },
      { role: "user", content: prompt }
    ],
    temperature: 0.7
  })
  
  return JSON.parse(response.choices[0].message.content)
}
```

#### Yandex GPT

```javascript
import { YandexGPT } from '@yandex-cloud/ai'

const yandexGPT = new YandexGPT({
  apiKey: process.env.REACT_APP_YANDEX_API_KEY,
  folderId: process.env.REACT_APP_YANDEX_FOLDER_ID
})

export async function getYandexRecommendations(userProfile, ngos) {
  const prompt = `Рекомендуй НКО для пользователя...`
  
  const response = await yandexGPT.complete(prompt)
  return response
}
```

### 4. Реализация в React компоненте

```javascript
// src/components/AIRecommendations.jsx

import React, { useState, useEffect } from 'react'
import { getRecommendations } from '../utils/recommendations'
import { useAuth } from '../context/AuthContext'
import { ngos } from '../data/ngos'

export default function AIRecommendations() {
  const { user } = useAuth()
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (user) {
      // Простой алгоритм
      const recs = getRecommendations(user, ngos, [])
      setRecommendations(recs)
      setLoading(false)
      
      // Или AI-рекомендации (асинхронно)
      // getAIRecommendations(user, ngos).then(setRecommendations)
    }
  }, [user])
  
  if (loading) return <div>Загрузка рекомендаций...</div>
  
  return (
    <div className="card">
      <h3 className="text-2xl font-bold text-primary mb-4">
        Рекомендации для вас
      </h3>
      <div className="space-y-4">
        {recommendations.map(ngo => (
          <div key={ngo.id} className="p-4 bg-gradient-soft rounded-modern">
            <h4 className="font-bold text-primary">{ngo.name}</h4>
            <p className="text-sm text-gray-600">{ngo.short_description}</p>
            <div className="mt-2 text-xs text-accent">
              Подходит по вашим интересам
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 5. Оптимизация и кэширование

```javascript
// Кэширование рекомендаций
const recommendationsCache = new Map()

export function getCachedRecommendations(userId) {
  const cached = recommendationsCache.get(userId)
  if (cached && Date.now() - cached.timestamp < 3600000) { // 1 час
    return cached.data
  }
  return null
}

export function setCachedRecommendations(userId, data) {
  recommendationsCache.set(userId, {
    data,
    timestamp: Date.now()
  })
}
```

## Пошаговая реализация

### Шаг 1: Создать утилиту для рекомендаций

```bash
# Создать файл
touch src/utils/recommendations.js
```

### Шаг 2: Добавить сбор данных о пользователе

- Отслеживать клики по НКО
- Сохранять избранное
- Записывать участие в событиях
- Собирать отзывы и рейтинги

### Шаг 3: Реализовать простой алгоритм (MVP)

- Фильтрация по городу
- Подсчёт баллов на основе интересов
- Сортировка и возврат топ-5

### Шаг 4: Интегрировать в UI

- Добавить компонент на главную страницу
- Показывать рекомендации в личном кабинете
- Добавить кнопку "Обновить рекомендации"

### Шаг 5: Улучшить алгоритм (опционально)

- Добавить машинное обучение
- Интегрировать внешние AI-сервисы
- A/B тестирование разных алгоритмов

## Примеры использования

### В HomePage

```javascript
import AIRecommendations from '../components/AIRecommendations'

// В компоненте
<AIRecommendations />
```

### В ProfilePage

```javascript
<section>
  <h2>Персональные рекомендации</h2>
  <AIRecommendations />
</section>
```

## Метрики успеха

- CTR (Click-Through Rate) рекомендаций
- Конверсия в участие в событиях
- Удовлетворённость пользователей (опросы)
- Время на сайте

## Дальнейшее развитие

1. **Collaborative Filtering** - рекомендации на основе похожих пользователей
2. **Content-Based Filtering** - анализ описаний НКО
3. **Hybrid Approach** - комбинация методов
4. **Real-time Learning** - обновление модели в реальном времени
5. **Explainable AI** - объяснение причин рекомендаций

