# Примеры интеграции API в React компоненты

## Настройка API клиента

### `src/utils/api.js`
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api'

class ApiClient {
    constructor() {
        this.baseURL = API_BASE_URL
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`
        const token = localStorage.getItem('jwt')
        
        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers,
            },
        }

        if (options.body && typeof options.body === 'object') {
            config.body = JSON.stringify(options.body)
        }

        try {
            const response = await fetch(url, config)
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Ошибка запроса')
            }

            return data
        } catch (error) {
            console.error('API Error:', error)
            throw error
        }
    }

    get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString()
        const url = queryString ? `${endpoint}?${queryString}` : endpoint
        return this.request(url, { method: 'GET' })
    }

    post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: data,
        })
    }

    put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: data,
        })
    }

    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' })
    }
}

export const api = new ApiClient()
```

---

## Примеры использования в компонентах

### 1. Получение списка НКО с фильтрацией

```javascript
// src/pages/NGOListPage.jsx
import React, { useState, useEffect } from 'react'
import { api } from '../utils/api'
import NGOCard from '../components/NGOCard'
import Pagination from '../components/Pagination'

export default function NGOListPage() {
    const { city } = useCity()
    const [category, setCategory] = useState('Все')
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [ngos, setNgos] = useState([])
    const [loading, setLoading] = useState(true)
    const [pagination, setPagination] = useState(null)

    useEffect(() => {
        loadNgos()
    }, [city, category, searchQuery, currentPage])

    const loadNgos = async () => {
        setLoading(true)
        try {
            const params = {
                city: city,
                page: currentPage,
                limit: 9,
            }
            
            if (category !== 'Все') {
                params.category = category
            }
            
            if (searchQuery) {
                params.search = searchQuery
            }

            const response = await api.get('/ngos', params)
            setNgos(response.data)
            setPagination(response.pagination)
        } catch (error) {
            console.error('Ошибка загрузки НКО:', error)
            // Показываем сообщение об ошибке пользователю
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <Loader />
    }

    return (
        <div>
            {/* Фильтры */}
            {/* ... */}
            
            {/* Список НКО */}
            <div className="grid md:grid-cols-3 gap-6">
                {ngos.map(ngo => (
                    <NGOCard key={ngo.id} ngo={ngo} />
                ))}
            </div>

            {/* Пагинация */}
            {pagination && pagination.total_pages > 1 && (
                <Pagination
                    currentPage={pagination.current_page}
                    totalPages={pagination.total_pages}
                    onPageChange={setCurrentPage}
                    itemsPerPage={pagination.items_per_page}
                    totalItems={pagination.total_items}
                />
            )}
        </div>
    )
}
```

### 2. Добавление/удаление из избранного

```javascript
// src/pages/NGODetailsPage.jsx
import { api } from '../utils/api'

const toggleFavorite = async () => {
    if (!user) {
        alert('Войдите, чтобы добавить в избранное')
        return
    }

    try {
        const isFavorite = user.favorites?.includes(ngo.id)
        
        if (isFavorite) {
            await api.delete(`/ngos/${ngo.id}/favorite`)
        } else {
            await api.post(`/ngos/${ngo.id}/favorite`)
        }

        // Обновляем пользователя
        const updatedUser = await api.get('/auth/me')
        login(localStorage.getItem('jwt'), updatedUser)
    } catch (error) {
        console.error('Ошибка обновления избранного:', error)
        alert('Не удалось обновить избранное')
    }
}
```

### 3. Регистрация на событие

```javascript
// src/pages/CalendarPage.jsx
const handleEventRegistration = async (eventId) => {
    if (!user) {
        alert('Войдите, чтобы зарегистрироваться')
        return
    }

    try {
        const response = await api.post(`/events/${eventId}/register`, {
            name: user.name,
            email: user.email,
        })

        alert(response.message)
        // Обновляем список событий
    } catch (error) {
        console.error('Ошибка регистрации:', error)
        alert('Не удалось зарегистрироваться на событие')
    }
}
```

### 4. Создание НКО (форма)

```javascript
// src/pages/ProfilePage.jsx (секция add-ngo)
const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    address: '',
    website: '',
})

const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
        const response = await api.post('/ngos', formData)
        alert(response.message)
        // Очищаем форму или перенаправляем
        setFormData({ name: '', category: '', description: '', address: '', website: '' })
    } catch (error) {
        console.error('Ошибка создания НКО:', error)
        alert('Не удалось создать НКО')
    }
}
```

### 5. AI-рекомендации через API

```javascript
// src/components/AIRecommendations.jsx
const loadRecommendations = async () => {
    if (!user) {
        setLoading(false)
        return
    }

    setLoading(true)
    try {
        const response = await api.get('/recommendations', {
            type: 'ngos'
        })
        setRecommendations(response.ngos)
    } catch (error) {
        console.error('Ошибка загрузки рекомендаций:', error)
        // Fallback на локальный алгоритм
        const simpleRecs = getSimpleRecommendations(userProfile, ngos)
        setRecommendations(simpleRecs)
    } finally {
        setLoading(false)
    }
}
```

### 6. Универсальный поиск

```javascript
// src/components/SearchBar.jsx
const [searchResults, setSearchResults] = useState(null)
const [searchLoading, setSearchLoading] = useState(false)

const handleSearch = async (query) => {
    if (!query.trim()) {
        setSearchResults(null)
        return
    }

    setSearchLoading(true)
    try {
        const response = await api.get('/search', {
            q: query,
            type: 'all',
            city: city
        })
        setSearchResults(response.results)
    } catch (error) {
        console.error('Ошибка поиска:', error)
    } finally {
        setSearchLoading(false)
    }
}
```

### 7. Модерация (админка)

```javascript
// src/pages/AdminPage.jsx
const handleApprove = async (moderationId) => {
    try {
        const response = await api.post(`/moderation/${moderationId}/approve`, {
            comment: 'Одобрено'
        })
        alert(response.message)
        // Обновляем список заявок
        loadPendingModerations()
    } catch (error) {
        console.error('Ошибка одобрения:', error)
        alert('Не удалось одобрить заявку')
    }
}

const handleReject = async (moderationId, reason) => {
    try {
        const response = await api.post(`/moderation/${moderationId}/reject`, {
            reason: reason
        })
        alert(response.message)
        loadPendingModerations()
    } catch (error) {
        console.error('Ошибка отклонения:', error)
        alert('Не удалось отклонить заявку')
    }
}
```

### 8. Отправка формы контакта

```javascript
// src/pages/NGODetailsPage.jsx
const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
})

const handleContactSubmit = async (e) => {
    e.preventDefault()
    
    try {
        const response = await api.post('/contact', {
            ngo_id: ngo.id,
            ...contactForm
        })
        alert('Сообщение успешно отправлено!')
        setContactForm({ name: '', email: '', message: '' })
    } catch (error) {
        console.error('Ошибка отправки:', error)
        alert('Не удалось отправить сообщение')
    }
}
```

### 9. Получение статистики

```javascript
// src/pages/HomePage.jsx
const [statistics, setStatistics] = useState(null)

useEffect(() => {
    loadStatistics()
}, [])

const loadStatistics = async () => {
    try {
        const stats = await api.get('/statistics')
        setStatistics(stats)
    } catch (error) {
        console.error('Ошибка загрузки статистики:', error)
    }
}
```

### 10. Получение данных для карты

```javascript
// src/components/MapComponent.jsx
const loadMapNgos = async (bounds) => {
    try {
        const params = bounds ? { bounds } : { city }
        const response = await api.get('/map/ngos', params)
        setMapMarkers(response.data)
    } catch (error) {
        console.error('Ошибка загрузки данных карты:', error)
    }
}
```

---

## Обработка ошибок

### Создание хука для обработки ошибок

```javascript
// src/hooks/useApi.js
import { useState } from 'react'
import { api } from '../utils/api'

export function useApi() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const execute = async (apiCall) => {
        setLoading(true)
        setError(null)
        
        try {
            const result = await apiCall()
            return result
        } catch (err) {
            setError(err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }

    return { execute, loading, error }
}
```

### Использование хука

```javascript
const { execute, loading, error } = useApi()

const loadNgos = async () => {
    try {
        const response = await execute(() => api.get('/ngos', params))
        setNgos(response.data)
    } catch (err) {
        // Ошибка уже обработана в хуке
    }
}
```

---

## Кэширование и оптимизация

### React Query для кэширования

```javascript
// Установка: npm install @tanstack/react-query

// src/App.js
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 минут
            cacheTime: 10 * 60 * 1000, // 10 минут
        },
    },
})

// Использование в компоненте
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

function NGOListPage() {
    const { city, category } = useFilters()
    
    const { data, isLoading, error } = useQuery({
        queryKey: ['ngos', city, category],
        queryFn: () => api.get('/ngos', { city, category }),
    })

    const queryClient = useQueryClient()
    
    const favoriteMutation = useMutation({
        mutationFn: (ngoId) => api.post(`/ngos/${ngoId}/favorite`),
        onSuccess: () => {
            // Инвалидируем кэш после успешного обновления
            queryClient.invalidateQueries(['ngos'])
            queryClient.invalidateQueries(['user', 'favorites'])
        },
    })

    if (isLoading) return <Loader />
    if (error) return <ErrorMessage error={error} />

    return (
        <div>
            {data?.data.map(ngo => (
                <NGOCard 
                    key={ngo.id} 
                    ngo={ngo}
                    onFavorite={() => favoriteMutation.mutate(ngo.id)}
                />
            ))}
        </div>
    )
}
```

---

## Переменные окружения

### `.env`
```
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_HUGGINGFACE_API_KEY=your_key_here
```

### Использование
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api'
```

