const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api'

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
            
            // Если ответ не JSON (например, 204 No Content), возвращаем пустой объект
            const contentType = response.headers.get('content-type')
            let data
            if (contentType && contentType.includes('application/json')) {
                data = await response.json()
            } else {
                data = {}
            }

            if (!response.ok) {
                throw new Error(data.message || data.detail || `Ошибка запроса: ${response.status}`)
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

    patch(endpoint, data) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: data,
        })
    }

    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' })
    }
}

export const api = new ApiClient()

