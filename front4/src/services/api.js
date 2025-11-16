/**
 * API Service для подключения к Django Backend
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Утилита для выполнения запросов
async function apiRequest(endpoint, options = {}) {
    // Убираем слэш в начале, если есть
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${API_BASE_URL}${cleanEndpoint}`;
    const token = localStorage.getItem('token');
    
    const config = {
        method: options.method || 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers,
        },
    };

    // Добавляем body только если это не GET запрос
    if (options.body && config.method !== 'GET') {
        config.body = options.body;
    }

    try {
        const response = await fetch(url, config);
        
        // Обработка пустых ответов (например, 204 No Content)
        if (response.status === 204) {
            return null;
        }
        
        // Обработка ошибок
        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                errorData = { detail: `HTTP ${response.status}: ${response.statusText}` };
            }
            
            // Обработка ошибок валидации Django
            if (errorData.non_field_errors) {
                throw new Error(Array.isArray(errorData.non_field_errors) 
                    ? errorData.non_field_errors.join(', ') 
                    : errorData.non_field_errors);
            }
            
            // Обработка ошибок полей
            if (typeof errorData === 'object' && !errorData.detail && !errorData.message) {
                const fieldErrors = Object.entries(errorData)
                    .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
                    .join('; ');
                throw new Error(fieldErrors || 'Ошибка валидации');
            }
            
            throw new Error(errorData.detail || errorData.message || `HTTP ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`API Error [${cleanEndpoint}]:`, error);
        throw error;
    }
}

// Аутентификация
export const authAPI = {
    register: async (userData) => {
        return apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    },
    
    login: async (email, password) => {
        // JWT TokenObtainPairView по умолчанию использует username
        // Но мы можем использовать email как username, если они совпадают
        // Или если бэкенд настроен на использование email
        const response = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ 
                username: email, // Django использует username по умолчанию
                password: password 
            }),
        });
        
        if (response && response.access) {
            localStorage.setItem('token', response.access);
            if (response.refresh) {
                localStorage.setItem('refreshToken', response.refresh);
            }
        }
        
        return response;
    },
    
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    },
    
    getCurrentUser: async () => {
        return apiRequest('/auth/me');
    },
    
    refreshToken: async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');
        
        const response = await apiRequest('/auth/refresh', {
            method: 'POST',
            body: JSON.stringify({ refresh: refreshToken }),
        });
        
        if (response.access) {
            localStorage.setItem('token', response.access);
        }
        
        return response;
    },
};

// НКО
export const ngoAPI = {
    getAll: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `/ngos/?${queryString}` : '/ngos/';
        const response = await apiRequest(endpoint);
        // Обработка пагинации Django REST Framework
        if (response && response.results) {
            return response;
        }
        // Если нет пагинации, возвращаем как массив
        return Array.isArray(response) ? { results: response, count: response.length } : response;
    },
    
    getById: async (id) => {
        return apiRequest(`/ngos/${id}/`);
    },
    
    create: async (ngoData) => {
        return apiRequest('/ngos/', {
            method: 'POST',
            body: JSON.stringify(ngoData),
        });
    },
    
    update: async (id, ngoData) => {
        return apiRequest(`/ngos/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(ngoData),
        });
    },
    
    addToFavorites: async (id) => {
        return apiRequest(`/ngos/${id}/favorite/`, {
            method: 'POST',
        });
    },
    
    removeFromFavorites: async (id) => {
        return apiRequest(`/ngos/${id}/favorite/`, {
            method: 'DELETE',
        });
    },
};

// События
export const eventAPI = {
    getAll: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `/events/?${queryString}` : '/events/';
        const response = await apiRequest(endpoint);
        // Обработка пагинации Django REST Framework
        if (response && response.results) {
            return response;
        }
        // Если нет пагинации, возвращаем как массив
        return Array.isArray(response) ? { results: response, count: response.length } : response;
    },
    
    getById: async (id) => {
        return apiRequest(`/events/${id}/`);
    },
    
    create: async (eventData) => {
        return apiRequest('/events/', {
            method: 'POST',
            body: JSON.stringify(eventData),
        });
    },
    
    register: async (id) => {
        return apiRequest(`/events/${id}/register/`, {
            method: 'POST',
        });
    },
    
    unregister: async (id) => {
        return apiRequest(`/events/${id}/register/`, {
            method: 'DELETE',
        });
    },
};

// Материалы
export const materialAPI = {
    getAll: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `/materials/?${queryString}` : '/materials/';
        const response = await apiRequest(endpoint);
        // Обработка пагинации Django REST Framework
        if (response && response.results) {
            return response;
        }
        // Если нет пагинации, возвращаем как массив
        return Array.isArray(response) ? { results: response, count: response.length } : response;
    },
    
    getById: async (id) => {
        return apiRequest(`/materials/${id}/`);
    },
    
    addToLibrary: async (id) => {
        return apiRequest(`/library/`, {
            method: 'POST',
            body: JSON.stringify({ material: id }),
        });
    },
    
    removeFromLibrary: async (id) => {
        return apiRequest(`/library/${id}/`, {
            method: 'DELETE',
        });
    },
};

// Новости
export const newsAPI = {
    getAll: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `/news/?${queryString}` : '/news/';
        const response = await apiRequest(endpoint);
        // Обработка пагинации Django REST Framework
        if (response && response.results) {
            return response;
        }
        // Если нет пагинации, возвращаем как массив
        return Array.isArray(response) ? { results: response, count: response.length } : response;
    },
    
    getById: async (id) => {
        return apiRequest(`/news/${id}/`);
    },
};

// Категории
export const categoryAPI = {
    getAll: async () => {
        const response = await apiRequest('/categories/');
        // Обработка пагинации Django REST Framework
        if (response && response.results) {
            return response.results;
        }
        // Если нет пагинации, возвращаем как массив
        return Array.isArray(response) ? response : [];
    },
};

// Рекомендации
export const recommendationsAPI = {
    get: async (userProfile, ngos) => {
        return apiRequest('/recommendations', {
            method: 'POST',
            body: JSON.stringify({ userProfile, ngos }),
        });
    },
};

// Статистика
export const statisticsAPI = {
    get: async () => {
        return apiRequest('/statistics');
    },
    
    getByCity: async (city) => {
        return apiRequest(`/statistics/city/${city}`);
    },
};

// Поиск
export const searchAPI = {
    search: async (query, params = {}) => {
        return apiRequest('/search', {
            method: 'POST',
            body: JSON.stringify({ query, ...params }),
        });
    },
};

// Карта
export const mapAPI = {
    getNGOs: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/map/ngos${queryString ? `?${queryString}` : ''}`);
    },
};

// Контакты
export const contactAPI = {
    send: async (contactData) => {
        return apiRequest('/contact', {
            method: 'POST',
            body: JSON.stringify(contactData),
        });
    },
};

export default {
    auth: authAPI,
    ngo: ngoAPI,
    event: eventAPI,
    material: materialAPI,
    news: newsAPI,
    category: categoryAPI,
    recommendations: recommendationsAPI,
    statistics: statisticsAPI,
    search: searchAPI,
    map: mapAPI,
    contact: contactAPI,
};

