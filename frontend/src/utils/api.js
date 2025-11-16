// API утилита для работы с бэкендом
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api'

/**
 * Базовая функция для выполнения API запросов
 */
async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('jwt')
    const isFormData = options.body instanceof FormData
    
    const config = {
        headers: {
            // Для FormData не устанавливаем Content-Type, браузер сам установит с boundary
            ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers,
        },
        ...options,
    }

    // Если есть body, преобразуем в JSON (но не для FormData)
    if (config.body && typeof config.body === 'object' && !isFormData) {
        config.body = JSON.stringify(config.body)
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
        
        // Парсим JSON только если есть контент
        let data = null
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
            data = await response.json()
        }

        if (!response.ok) {
            const error = data?.detail || data?.message || data?.error || `HTTP error! status: ${response.status}`
            throw new Error(error)
        }

        return data
    } catch (error) {
        console.error('API request failed:', error)
        throw error
    }
}

// ==================== Аутентификация ====================

export const authAPI = {
    /**
     * Регистрация нового пользователя
     */
    register: async (userData) => {
        return apiRequest('/auth/register', {
            method: 'POST',
            body: {
                username: userData.username || userData.email,
                email: userData.email,
                password: userData.password,
                password_confirm: userData.passwordConfirm || userData.password,
                first_name: userData.firstName || userData.name,
                last_name: userData.lastName || '',
                city: userData.city || '',
                phone: userData.phone || '',
            },
        })
    },

    /**
     * Вход в систему
     */
    login: async (emailOrUsername, password) => {
        // JWT использует username, но можно передать email, если он совпадает с username
        return apiRequest('/auth/login', {
            method: 'POST',
            body: {
                username: emailOrUsername, // Используем email как username
                password: password,
            },
        })
    },

    /**
     * Получение текущего пользователя
     */
    getCurrentUser: async () => {
        return apiRequest('/auth/me')
    },

    /**
     * Обновление токена
     */
    refreshToken: async (refreshToken) => {
        return apiRequest('/auth/refresh', {
            method: 'POST',
            body: { refresh: refreshToken },
        })
    },

    /**
     * Обновление профиля пользователя
     */
    updateProfile: async (userData) => {
        return apiRequest('/auth/me', {
            method: 'PATCH',
            body: userData,
        })
    },
}

// ==================== НКО ====================

export const ngoAPI = {
    /**
     * Получение списка НКО
     */
    getList: async (params = {}) => {
        const queryParams = new URLSearchParams()
        if (params.city) queryParams.append('city', params.city)
        if (params.category) queryParams.append('category', params.category)
        if (params.search) queryParams.append('search', params.search)
        if (params.ordering) queryParams.append('ordering', params.ordering)
        if (params.page) queryParams.append('page', params.page)
        
        const queryString = queryParams.toString()
        return apiRequest(`/ngos/${queryString ? `?${queryString}` : ''}`)
    },

    /**
     * Получение НКО по ID
     */
    getById: async (id) => {
        return apiRequest(`/ngos/${id}/`)
    },

    /**
     * Создание НКО
     */
    create: async (ngoData) => {
        return apiRequest('/ngos', {
            method: 'POST',
            body: ngoData,
        })
    },

    /**
     * Добавление/удаление из избранного
     */
    toggleFavorite: async (ngoId, isFavorite) => {
        return apiRequest(`/ngos/${ngoId}/favorite/`, {
            method: isFavorite ? 'DELETE' : 'POST',
        })
    },

    /**
     * Получение списка избранных НКО
     */
    getFavorites: async () => {
        return apiRequest('/ngos/favorites')
    },

    /**
     * Создание отзыва о НКО
     */
    createReview: async (ngoId, reviewData) => {
        return apiRequest(`/ngos/${ngoId}/review`, {
            method: 'POST',
            body: reviewData,
        })
    },
}

// ==================== События ====================

export const eventAPI = {
    /**
     * Получение списка событий
     */
    getList: async (params = {}) => {
        const queryParams = new URLSearchParams()
        if (params.ngo_id) queryParams.append('ngo_id', params.ngo_id)
        if (params.upcoming) queryParams.append('upcoming', params.upcoming)
        if (params.page) queryParams.append('page', params.page)
        
        const queryString = queryParams.toString()
        return apiRequest(`/events/${queryString ? `?${queryString}` : ''}`)
    },

    /**
     * Получение события по ID
     */
    getById: async (id) => {
        return apiRequest(`/events/${id}/`)
    },

    /**
     * Регистрация на событие
     */
    register: async (eventId, registrationData) => {
        return apiRequest(`/events/${eventId}/register`, {
            method: 'POST',
            body: registrationData,
        })
    },

    /**
     * Отмена регистрации на событие
     */
    unregister: async (eventId) => {
        return apiRequest(`/events/${eventId}/unregister`, {
            method: 'DELETE',
        })
    },
}

// ==================== Категории ====================

export const categoryAPI = {
    /**
     * Получение списка категорий
     */
    getList: async () => {
        return apiRequest('/categories/')
    },
}

// ==================== Поиск ====================

export const searchAPI = {
    /**
     * Универсальный поиск
     */
    search: async (query, params = {}) => {
        const queryParams = new URLSearchParams({ q: query })
        if (params.type) queryParams.append('type', params.type)
        if (params.city) queryParams.append('city', params.city)
        
        return apiRequest(`/search?${queryParams.toString()}`)
    },
}

// ==================== Рекомендации ====================

export const recommendationsAPI = {
    /**
     * Получение рекомендаций
     */
    getRecommendations: async (type = 'ngos') => {
        return apiRequest(`/recommendations?type=${type}`)
    },
}

// ==================== Статистика ====================

export const statisticsAPI = {
    /**
     * Получение статистики платформы
     */
    getStatistics: async () => {
        return apiRequest('/statistics')
    },
}

// ==================== Контакты ====================

export const contactAPI = {
    /**
     * Отправка сообщения через форму контакта
     */
    sendMessage: async (messageData) => {
        return apiRequest('/contact', {
            method: 'POST',
            body: messageData,
        })
    },
}

// ==================== Карта ====================

export const mapAPI = {
    /**
     * Получение НКО для карты
     */
    getNGOs: async (params = {}) => {
        const queryParams = new URLSearchParams()
        if (params.city) queryParams.append('city', params.city)
        if (params.bounds) queryParams.append('bounds', params.bounds)
        
        const queryString = queryParams.toString()
        return apiRequest(`/map/ngos${queryString ? `?${queryString}` : ''}`)
    },
}

// ==================== Материалы ====================

export const materialAPI = {
    /**
     * Получение списка материалов
     */
    getList: async (params = {}) => {
        const queryParams = new URLSearchParams()
        if (params.tags) queryParams.append('tags', params.tags)
        if (params.course) queryParams.append('course', params.course)
        if (params.author) queryParams.append('author', params.author)
        if (params.search) queryParams.append('search', params.search)
        if (params.ordering) queryParams.append('ordering', params.ordering)
        if (params.page) queryParams.append('page', params.page)
        
        const queryString = queryParams.toString()
        return apiRequest(`/materials/${queryString ? `?${queryString}` : ''}`)
    },

    /**
     * Получение материала по ID
     */
    getById: async (id) => {
        return apiRequest(`/materials/${id}/`)
    },

    /**
     * Добавление материала в библиотеку  
     */
    save: async (materialId, notes = '') => {
        return apiRequest(`/materials/${materialId}/save/`, {
            method: 'POST',
            body: { notes },
        })
    },

    /**
     * Удаление материала из библиотеки
     */
    unsave: async (materialId) => {
        return apiRequest(`/materials/${materialId}/unsave/`, {
            method: 'DELETE',
        })
    },

    /**
     * Увеличение счетчика просмотров
     */
    incrementView: async (materialId) => {
        return apiRequest(`/materials/${materialId}/view`, {
            method: 'POST',
        })
    },
}

// ==================== Теги ====================

export const tagAPI = {
    /**
     * Получение списка тегов
     */
    getList: async () => {
        return apiRequest('/tags/')
    },
}

// ==================== Библиотека ====================

export const libraryAPI = {
    /**
     * Получение библиотеки пользователя
     */
    getList: async () => {
        return apiRequest('/library/')
    },

    /**
     * Добавление материала в библиотеку
     */
    add: async (materialId, notes = '') => {
        return apiRequest('/library', {
            method: 'POST',
            body: {
                material_id: materialId,
                notes,
            },
        })
    },

    /**
     * Удаление материала из библиотеки
     */
    remove: async (libraryItemId) => {
        return apiRequest(`/library/${libraryItemId}/`, {
            method: 'DELETE',
        })
    },

    /**
     * Обновление заметок
     */
    update: async (libraryItemId, notes) => {
        return apiRequest(`/library/${libraryItemId}/`, {
            method: 'PATCH',
            body: { notes },
        })
    },
}

// ==================== Новости ====================

export const newsAPI = {
    /**
     * Получение списка новостей
     */
    getList: async (params = {}) => {
        const queryParams = new URLSearchParams()
        if (params.city) queryParams.append('city', params.city)
        if (params.category) queryParams.append('category', params.category)
        if (params.status) queryParams.append('status', params.status)
        if (params.search) queryParams.append('search', params.search)
        if (params.page) queryParams.append('page', params.page)
        
        const queryString = queryParams.toString()
        return apiRequest(`/news/${queryString ? `?${queryString}` : ''}`)
    },

    /**
     * Получение новости по ID
     */
    getById: async (id) => {
        return apiRequest(`/news/${id}/`)
    },

    /**
     * Создание новости
     * Поддерживает загрузку изображения через FormData
     */
    create: async (newsData) => {
        // Если есть файл изображения, используем FormData
        if (newsData.image && newsData.image instanceof File) {
            const formData = new FormData()
            formData.append('title', newsData.title)
            formData.append('content', newsData.content)
            if (newsData.snippet) formData.append('snippet', newsData.snippet)
            if (newsData.city) formData.append('city', newsData.city)
            if (newsData.category) formData.append('category', newsData.category)
            formData.append('image', newsData.image)
            
            return apiRequest('/news/', {
                method: 'POST',
                body: formData,
            })
        }
        
        // Обычный JSON запрос (без изображения)
        const jsonData = { ...newsData }
        delete jsonData.image // Удаляем image, если это не File
        return apiRequest('/news/', {
            method: 'POST',
            body: jsonData,
        })
    },

    /**
     * Обновление новости
     */
    update: async (id, newsData) => {
        return apiRequest(`/news/${id}/`, {
            method: 'PUT',
            body: newsData,
        })
    },

    /**
     * Удаление новости
     */
    delete: async (id) => {
        return apiRequest(`/news/${id}/`, {
            method: 'DELETE',
        })
    },
}

export default {
    auth: authAPI,
    ngo: ngoAPI,
    event: eventAPI,
    category: categoryAPI,
    search: searchAPI,
    recommendations: recommendationsAPI,
    statistics: statisticsAPI,
    contact: contactAPI,
    map: mapAPI,
    material: materialAPI,
    tag: tagAPI,
    library: libraryAPI,
    news: newsAPI,
}

