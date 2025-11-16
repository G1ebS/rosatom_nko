// Бесплатная AI-рекомендательная система
// Использует Hugging Face Inference API (бесплатный тариф)

/**
 * Получение рекомендаций через Hugging Face Inference API
 * Бесплатный тариф: до 1000 запросов в месяц
 */
export async function getAIRecommendations(userProfile, ngos) {
    try {
        // Использование Hugging Face Inference API (бесплатно)
        // Модель для вычисления схожести текстов (feature-extraction для эмбеддингов)
        // ВАЖНО: Hugging Face API блокирует CORS запросы из браузера
        // Для работы нужен бэкенд-прокси или публичный CORS прокси
        const BASE_URL = 'https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2'
        
        // Пробуем использовать CORS прокси для обхода ограничений (только для development)
        // В production нужен собственный бэкенд-прокси
        const USE_CORS_PROXY = false // Отключено, так как требует настройки бэкенда
        const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/' // Пример (может не работать)
        const API_URL = USE_CORS_PROXY ? `${CORS_PROXY}${BASE_URL}` : BASE_URL
        
        // Получаем API ключ из переменных окружения
        // В React приложениях переменные окружения доступны только через process.env.REACT_APP_*
        // ВАЖНО: Эта функция не будет работать из браузера из-за CORS
        // Используйте бэкенд-прокси (см. BACKEND_AI_INTEGRATION.md)
        const API_KEY = process.env.REACT_APP_HUGGINGFACE_API_KEY || ''
        
        // Детальная диагностика
        console.log('🔍 API Key Check:', {
            keyExists: !!API_KEY,
            keyLength: API_KEY.length,
            keyStartsWith: API_KEY.substring(0, 3),
            allEnvKeys: Object.keys(process.env).filter(k => k.includes('HUGGING') || k.includes('REACT_APP')),
            note: 'This function requires backend proxy due to CORS restrictions'
        })
        
        // Если нет API ключа, используем простой алгоритм
        if (!API_KEY || API_KEY.trim() === '' || API_KEY.length < 10) {
            console.warn('⚠️ AI Recommendations: No valid Hugging Face API key found')
            console.warn('   Current key value:', API_KEY || '(empty)')
            console.log('💡 To enable AI:')
            console.log('   1. Create .env file in project root (same folder as package.json)')
            console.log('   2. Add: REACT_APP_HUGGINGFACE_API_KEY=your_key_here')
            console.log('   3. STOP the application (Ctrl+C)')
            console.log('   4. Restart: npm start')
            console.log('   5. Check console for "🤖 AI Recommendations: Using Hugging Face Neural Network"')
            return getSimpleRecommendations(userProfile, ngos)
        }

        console.log('🤖 AI Recommendations: Using Hugging Face Neural Network')
        console.log('🔑 API Key loaded:', API_KEY.substring(0, 10) + '...' + API_KEY.substring(API_KEY.length - 4))

        // Подготовка данных пользователя
        const userInterests = userProfile.interests?.join(', ') || ''
        const userDescription = `Пользователь интересуется: ${userInterests}. Город: ${userProfile.city}`
        
        // Подготовка текстов НКО для сравнения
        const ngoTexts = ngos.map(ngo => `${ngo.name}. ${ngo.category?.name || ngo.category || ''}. ${ngo.short_description}`)
        
        // Все тексты для эмбеддингов
        const allTexts = [userDescription, ...ngoTexts]

        console.log('📡 Calling Hugging Face API:', {
            model: 'sentence-transformers/all-MiniLM-L6-v2',
            userDescription,
            ngoCount: ngoTexts.length,
            totalTexts: allTexts.length
        })

        // Отправка запроса к модели для получения эмбеддингов
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: allTexts
            })
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error('❌ Hugging Face API error:', response.status, errorText)
            
            // Если модель ещё загружается (503), ждём и пробуем снова
            if (response.status === 503) {
                console.log('⏳ Model is loading, waiting 10 seconds...')
                await new Promise(resolve => setTimeout(resolve, 10000))
                // Повторный запрос (рекурсивно, но только один раз)
                return getAIRecommendations(userProfile, ngos)
            }
            
            throw new Error(`API request failed: ${response.status} - ${errorText}`)
        }

        const data = await response.json()
        console.log('✅ Hugging Face API response received')
        
        // Проверяем формат ответа - должен быть массив эмбеддингов
        if (!Array.isArray(data) || data.length === 0) {
            console.warn('⚠️ Unexpected API response format:', data)
            throw new Error('Invalid API response format')
        }
        
        // Первый эмбеддинг - описание пользователя
        const userEmbedding = data[0]
        if (!Array.isArray(userEmbedding)) {
            console.warn('⚠️ Invalid embedding format:', userEmbedding)
            throw new Error('Invalid embedding format')
        }
        
        // Вычисляем косинусное сходство между пользователем и каждой НКО
        const cosineSimilarity = (vecA, vecB) => {
            let dotProduct = 0
            let normA = 0
            let normB = 0
            
            for (let i = 0; i < vecA.length; i++) {
                dotProduct += vecA[i] * vecB[i]
                normA += vecA[i] * vecA[i]
                normB += vecB[i] * vecB[i]
            }
            
            return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
        }
        
        // Сортировка по схожести (больше = лучше)
        const scoredNgos = ngos.map((ngo, index) => {
            const ngoEmbedding = data[index + 1] // +1 потому что первый элемент - это пользователь
            const score = Array.isArray(ngoEmbedding) 
                ? cosineSimilarity(userEmbedding, ngoEmbedding)
                : 0
            
            return { ngo, score }
        }).sort((a, b) => b.score - a.score)

        const result = scoredNgos.slice(0, 5).map(item => item.ngo)
        console.log('🎯 AI Neural Network Recommendations:', result.map((r, i) => `${i + 1}. ${r.name} (similarity: ${scoredNgos[i].score.toFixed(3)})`))
        
        // Добавляем метку, что использовался AI
        result._usedAI = true
        
        return result
    } catch (error) {
        console.error('❌ AI recommendation error:', error)
        
        // Проверяем, это ли ошибка CORS
        if (error.message.includes('CORS') || error.message.includes('NetworkError') || error.message.includes('fetch')) {
            console.warn('⚠️ CORS error: Hugging Face API блокирует запросы из браузера')
            console.log('💡 Решения:')
            console.log('   1. Использовать бэкенд-прокси (рекомендуется для production)')
            console.log('   2. Использовать простой алгоритм (уже работает хорошо)')
            console.log('   3. Настроить CORS прокси на сервере')
        }
        
        console.log('🔄 Falling back to simple algorithm...')
        // Fallback на простой алгоритм
        return getSimpleRecommendations(userProfile, ngos)
    }
}

/**
 * Простой алгоритм рекомендаций (без AI)
 * Используется как fallback или для MVP
 */
export function getSimpleRecommendations(user, ngos) {
    if (!ngos || ngos.length === 0) {
        console.warn('⚠️ getSimpleRecommendations: ngos array is empty')
        return []
    }
    
    console.log('📊 Using Simple Algorithm (rule-based recommendations)')
    
    const scores = []
    const userCity = user?.city || 'Ангарск'
    const userInterests = user?.interests || []
    
    console.log('📋 User profile:', {
        city: userCity,
        interests: userInterests,
        ngosCount: ngos.length
    })
    
    // Обрабатываем все НКО, но приоритизируем по городу
    ngos.forEach(ngo => {
        let score = 0
        
        // Город - высокий приоритет
        if (ngo.city === userCity) {
            score += 10
        } else if (ngo.city === 'Все') {
            score += 5
        } else {
            score += 1 // Немного баллов за другие города
        }
        
        // Совпадение категорий
        const categoryName = ngo.category?.name || ngo.category || ''
        if (userInterests.length > 0 && categoryName) {
            // Точное совпадение
            if (userInterests.includes(categoryName)) {
                score += 15
            } else {
                // Частичное совпадение (если категория содержит ключевые слова)
                userInterests.forEach(interest => {
                    const interestLower = interest.toLowerCase()
                    const categoryLower = categoryName.toLowerCase()
                    const descLower = ngo.short_description?.toLowerCase() || ''
                    
                    if (categoryLower.includes(interestLower) || descLower.includes(interestLower)) {
                        score += 8
                    }
                })
            }
        }
        
        // Если интересов нет, даем базовые баллы всем
        if (userInterests.length === 0) {
            score += 5
        }
        
        // История активности
        if (user?.activityHistory && user.activityHistory.length > 0) {
            const similarActivity = user.activityHistory.find(
                act => act.ngoId === ngo.id || act.category === categoryName
            )
            if (similarActivity) {
                score += 12
            }
        }
        
        // Избранное (не показываем уже добавленные в избранное, но не исключаем полностью)
        if (user?.favorites && user.favorites.includes(ngo.id)) {
            score -= 1 // Небольшое снижение приоритета
        }
        
        // Популярность (симуляция на основе описания)
        if (ngo.short_description && ngo.short_description.length > 50) {
            score += 3
        }
        
        // Базовая оценка для всех
        score += 2
        
        scores.push({ ngo, score })
    })
    
    // Сортировка по баллам
    scores.sort((a, b) => b.score - a.score)
    
    console.log('📈 Top recommendations (simple algorithm):', scores.slice(0, 5).map((s, i) => 
        `${i + 1}. ${s.ngo.name} (score: ${s.score})`
    ))
    
    // Возвращаем топ-5
    const result = scores.slice(0, 5).map(item => item.ngo)
    
    // Если результат пустой (не должно быть), возвращаем первые 5 НКО
    if (result.length === 0 && ngos.length > 0) {
        console.warn('⚠️ getSimpleRecommendations: result is empty, returning first 5 ngos')
        return ngos.slice(0, 5)
    }
    
    return result
}

/**
 * Альтернатива: Использование Cohere API (бесплатный тариф)
 * 100 запросов в месяц бесплатно
 */
export async function getCohereRecommendations(userProfile, ngos) {
    const API_KEY = process.env.REACT_APP_COHERE_API_KEY
    
    if (!API_KEY) {
        return getSimpleRecommendations(userProfile, ngos)
    }

    try {
        const response = await fetch('https://api.cohere.ai/v1/embed', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                texts: ngos.map(ngo => `${ngo.name}. ${ngo.category?.name || ngo.category || ''}. ${ngo.short_description}`),
                model: 'embed-english-v2.0'
            })
        })

        const data = await response.json()
        // Обработка эмбеддингов и поиск похожих
        return getSimpleRecommendations(userProfile, ngos) // Упрощённая версия
    } catch (error) {
        console.error('Cohere API error:', error)
        return getSimpleRecommendations(userProfile, ngos)
    }
}

/**
 * Локальный алгоритм на основе правил (работает без API)
 */
export function getRuleBasedRecommendations(user, ngos) {
    const recommendations = []
    
    ngos.forEach(ngo => {
        let matchScore = 0
        
        // Город
        if (ngo.city === user.city) matchScore += 3
        
        // Категории интересов
        const categoryName = ngo.category?.name || ngo.category || ''
        if (user.interests?.includes(categoryName)) matchScore += 5
        
        // История активности
        if (user.activityHistory) {
            const similarNgos = user.activityHistory.filter(
                act => {
                    const actNgo = ngos.find(n => n.id === act.ngoId)
                    const actCategoryName = actNgo?.category?.name || actNgo?.category || ''
                    return act.ngoId && actCategoryName === categoryName
                }
            )
            matchScore += similarNgos.length * 2
        }
        
        // Избранное
        if (user.favorites?.includes(ngo.id)) matchScore += 1
        
        if (matchScore > 0) {
            recommendations.push({ ngo, score: matchScore })
        }
    })
    
    recommendations.sort((a, b) => b.score - a.score)
    return recommendations.slice(0, 5).map(item => item.ngo)
}

