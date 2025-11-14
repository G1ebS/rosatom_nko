// Бесплатная AI-рекомендательная система
// Использует Hugging Face Inference API (бесплатный тариф)

/**
 * Получение рекомендаций через Hugging Face Inference API
 * Бесплатный тариф: до 1000 запросов в месяц
 */
export async function getAIRecommendations(userProfile, ngos) {
    try {
        // Вариант 1: Использование Hugging Face Inference API (бесплатно)
        // Модель для текстовой классификации и рекомендаций
        const API_URL = 'https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2'
        const API_KEY = process.env.REACT_APP_HUGGINGFACE_API_KEY || '' // Получить на huggingface.co
        
        // Подготовка данных пользователя
        const userInterests = userProfile.interests?.join(', ') || ''
        const userDescription = `Пользователь интересуется: ${userInterests}. Город: ${userProfile.city}`
        
        // Если нет API ключа, используем простой алгоритм
        if (!API_KEY) {
            return getSimpleRecommendations(userProfile, ngos)
        }

        // Отправка запроса к модели
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: {
                    source_sentence: userDescription,
                    sentences: ngos.map(ngo => `${ngo.name}. ${ngo.category}. ${ngo.short_description}`)
                }
            })
        })

        if (!response.ok) {
            throw new Error('API request failed')
        }

        const data = await response.json()
        
        // Сортировка по схожести
        const scoredNgos = ngos.map((ngo, index) => ({
            ngo,
            score: data[index] || 0
        })).sort((a, b) => b.score - a.score)

        return scoredNgos.slice(0, 5).map(item => item.ngo)
    } catch (error) {
        console.error('AI recommendation error:', error)
        // Fallback на простой алгоритм
        return getSimpleRecommendations(userProfile, ngos)
    }
}

/**
 * Простой алгоритм рекомендаций (без AI)
 * Используется как fallback или для MVP
 */
export function getSimpleRecommendations(user, ngos) {
    const scores = []
    
    // Фильтрация по городу
    const cityFiltered = ngos.filter(ngo => ngo.city === user.city)
    
    // Подсчёт баллов
    cityFiltered.forEach(ngo => {
        let score = 0
        
        // Совпадение категорий
        if (user.interests?.includes(ngo.category)) {
            score += 10
        }
        
        // Популярность (симуляция)
        score += Math.random() * 5
        
        // Активность (симуляция)
        score += Math.random() * 5
        
        scores.push({ ngo, score })
    })
    
    // Сортировка по баллам
    scores.sort((a, b) => b.score - a.score)
    
    return scores.slice(0, 5).map(item => item.ngo)
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
                texts: ngos.map(ngo => `${ngo.name}. ${ngo.category}. ${ngo.short_description}`),
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
        if (user.interests?.includes(ngo.category)) matchScore += 5
        
        // История активности
        if (user.activityHistory) {
            const similarNgos = user.activityHistory.filter(
                act => act.ngoId && ngos.find(n => n.id === act.ngoId)?.category === ngo.category
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

