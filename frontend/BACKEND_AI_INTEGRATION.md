# Интеграция AI рекомендаций через бэкенд

## Проблема CORS

Hugging Face Inference API блокирует прямые запросы из браузера из-за политики CORS (Cross-Origin Resource Sharing). Это стандартная мера безопасности.

**Решение:** Использовать бэкенд-прокси, который будет делать запросы к Hugging Face API от имени фронтенда.

---

## Архитектура

```
Frontend (React) → Backend API → Hugging Face API → Backend API → Frontend
```

---

## Пример реализации на Node.js/Express

### 1. Установка зависимостей

```bash
npm install express cors dotenv
```

### 2. Создание эндпоинта для рекомендаций

**`server.js` или `routes/ai.js`:**

```javascript
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch'); // или используйте встроенный fetch в Node 18+

// Конфигурация
const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2';
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY; // Из .env на сервере

/**
 * POST /api/ai/recommendations
 * Получение AI рекомендаций через Hugging Face API
 * 
 * Body:
 * {
 *   "userProfile": {
 *     "interests": ["Экология", "Социальная поддержка"],
 *     "city": "Ангарск",
 *     "activityHistory": [],
 *     "favorites": []
 *   },
 *   "ngos": [
 *     {
 *       "id": 1,
 *       "name": "Название НКО",
 *       "category": "Категория",
 *       "short_description": "Описание..."
 *     }
 *   ]
 * }
 */
router.post('/recommendations', async (req, res) => {
  try {
    const { userProfile, ngos } = req.body;

    if (!userProfile || !ngos || !Array.isArray(ngos)) {
      return res.status(400).json({ 
        error: 'Invalid request. userProfile and ngos array required.' 
      });
    }

    if (!HUGGINGFACE_API_KEY) {
      return res.status(500).json({ 
        error: 'Hugging Face API key not configured' 
      });
    }

    // Подготовка данных пользователя
    const userInterests = userProfile.interests?.join(', ') || '';
    const userDescription = `Пользователь интересуется: ${userInterests}. Город: ${userProfile.city}`;
    
    // Подготовка текстов НКО для сравнения
    const ngoTexts = ngos.map(ngo => 
      `${ngo.name}. ${ngo.category}. ${ngo.short_description}`
    );
    
    // Все тексты для эмбеддингов (первый - пользователь, остальные - НКО)
    const allTexts = [userDescription, ...ngoTexts];

    console.log('📡 Calling Hugging Face API:', {
      model: 'sentence-transformers/all-MiniLM-L6-v2',
      userDescription,
      ngoCount: ngoTexts.length,
      totalTexts: allTexts.length
    });

    // Отправка запроса к Hugging Face API
    const response = await fetch(HUGGINGFACE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: allTexts
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Hugging Face API error:', response.status, errorText);
      
      // Если модель ещё загружается (503), ждём и пробуем снова
      if (response.status === 503) {
        console.log('⏳ Model is loading, waiting 10 seconds...');
        await new Promise(resolve => setTimeout(resolve, 10000));
        // Повторный запрос (можно вынести в отдельную функцию)
        return router.post('/recommendations', req, res);
      }
      
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Hugging Face API response received');
    
    // Проверяем формат ответа - должен быть массив эмбеддингов
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Invalid API response format');
    }
    
    // Первый эмбеддинг - описание пользователя
    const userEmbedding = data[0];
    if (!Array.isArray(userEmbedding)) {
      throw new Error('Invalid embedding format');
    }
    
    // Вычисляем косинусное сходство между пользователем и каждой НКО
    const cosineSimilarity = (vecA, vecB) => {
      let dotProduct = 0;
      let normA = 0;
      let normB = 0;
      
      for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
      }
      
      return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    };
    
    // Сортировка по схожести (больше = лучше)
    const scoredNgos = ngos.map((ngo, index) => {
      const ngoEmbedding = data[index + 1]; // +1 потому что первый элемент - это пользователь
      const score = Array.isArray(ngoEmbedding) 
        ? cosineSimilarity(userEmbedding, ngoEmbedding)
        : 0;
      
      return { ngo, score };
    }).sort((a, b) => b.score - a.score);

    const result = scoredNgos.slice(0, 5).map(item => item.ngo);
    
    console.log('🎯 AI Neural Network Recommendations:', 
      result.map((r, i) => `${i + 1}. ${r.name} (similarity: ${scoredNgos[i].score.toFixed(3)})`)
    );
    
    res.json({
      success: true,
      recommendations: result,
      usedAI: true
    });

  } catch (error) {
    console.error('❌ AI recommendation error:', error);
    
    // Fallback на простой алгоритм (можно вынести в отдельную функцию)
    const simpleRecommendations = getSimpleRecommendations(userProfile, ngos);
    
    res.json({
      success: true,
      recommendations: simpleRecommendations,
      usedAI: false,
      fallback: true,
      error: error.message
    });
  }
});

module.exports = router;
```

### 3. Простой алгоритм (fallback)

```javascript
function getSimpleRecommendations(user, ngos) {
  if (!ngos || ngos.length === 0) {
    return [];
  }
  
  const scores = [];
  const userCity = user?.city || 'Ангарск';
  const userInterests = user?.interests || [];
  
  ngos.forEach(ngo => {
    let score = 0;
    
    // Город - высокий приоритет
    if (ngo.city === userCity) {
      score += 10;
    } else if (ngo.city === 'Все') {
      score += 5;
    } else {
      score += 1;
    }
    
    // Совпадение категорий
    if (userInterests.length > 0 && ngo.category) {
      if (userInterests.includes(ngo.category)) {
        score += 15;
      } else {
        userInterests.forEach(interest => {
          const interestLower = interest.toLowerCase();
          const categoryLower = ngo.category?.toLowerCase() || '';
          const descLower = ngo.short_description?.toLowerCase() || '';
          
          if (categoryLower.includes(interestLower) || descLower.includes(interestLower)) {
            score += 8;
          }
        });
      }
    }
    
    // История активности
    if (user?.activityHistory && user.activityHistory.length > 0) {
      const similarActivity = user.activityHistory.find(
        act => act.ngoId === ngo.id || act.category === ngo.category
      );
      if (similarActivity) {
        score += 12;
      }
    }
    
    scores.push({ ngo, score });
  });
  
  scores.sort((a, b) => b.score - a.score);
  return scores.slice(0, 5).map(item => item.ngo);
}
```

### 4. Переменные окружения на сервере

**`.env` (на сервере, не коммитить в git):**



### 5. Интеграция в Express app

```javascript
const express = require('express');
const cors = require('cors');
const aiRoutes = require('./routes/ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); // Разрешить запросы с фронтенда
app.use(express.json());

app.use('/api/ai', aiRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## Использование на фронтенде

### Обновление `src/utils/aiRecommendations.js`

```javascript
export async function getAIRecommendations(userProfile, ngos) {
  try {
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    
    const response = await fetch(`${API_URL}/api/ai/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userProfile,
        ngos
      })
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    
    if (data.success && data.recommendations) {
      const result = data.recommendations;
      result._usedAI = data.usedAI; // Флаг для UI
      return result;
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('AI recommendation error:', error);
    return getSimpleRecommendations(userProfile, ngos);
  }
}
```

### Переменные окружения на фронтенде

**`.env` (фронтенд):**

```env
REACT_APP_API_URL=http://localhost:3001
```

---

## Пример запроса (cURL)

```bash
curl -X POST http://localhost:3001/api/ai/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "userProfile": {
      "interests": ["Экология", "Социальная поддержка"],
      "city": "Ангарск",
      "activityHistory": [],
      "favorites": []
    },
    "ngos": [
      {
        "id": 1,
        "name": "Эко-друзья",
        "category": "Экология",
        "short_description": "Защита окружающей среды"
      }
    ]
  }'
```

---

## Альтернативные решения

### 1. Использование другого API с поддержкой CORS

Некоторые сервисы предоставляют CORS-friendly endpoints:
- Cohere API (требует регистрации)
- OpenAI API (платный)
- Собственный сервер с эмбеддингами

### 2. Serverless функции

Использовать Vercel/Netlify Functions или AWS Lambda для проксирования запросов:

```javascript
// vercel/api/ai-recommendations.js
export default async function handler(req, res) {
  // Аналогичная логика как в Express роутере
}
```

### 3. Публичный CORS прокси (только для development)

⚠️ **Не рекомендуется для production!**

```javascript
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
const API_URL = `${CORS_PROXY}${HUGGINGFACE_API_URL}`;
```

---

## Безопасность

1. **Никогда не храните API ключи на фронтенде**
2. **Используйте переменные окружения на сервере**
3. **Добавьте rate limiting** для защиты от злоупотреблений
4. **Валидируйте входные данные** на сервере
5. **Используйте HTTPS** в production

---

## Тестирование

```javascript
// test/ai.test.js
const request = require('supertest');
const app = require('../server');

describe('AI Recommendations API', () => {
  it('should return recommendations', async () => {
    const response = await request(app)
      .post('/api/ai/recommendations')
      .send({
        userProfile: {
          interests: ['Экология'],
          city: 'Ангарск'
        },
        ngos: [/* ... */]
      });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.recommendations)).toBe(true);
  });
});
```

---

## Мониторинг и логирование

Рекомендуется добавить:
- Логирование всех запросов к Hugging Face API
- Мониторинг ошибок (Sentry, LogRocket)
- Метрики использования API (количество запросов, время ответа)
- Кэширование результатов для одинаковых запросов

---

## Дополнительные ресурсы

- [Hugging Face Inference API Documentation](https://huggingface.co/docs/api-inference/index)
- [Sentence Transformers Models](https://www.sbert.net/)
- [CORS Explained](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

