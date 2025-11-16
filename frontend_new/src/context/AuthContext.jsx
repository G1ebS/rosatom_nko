import React, { createContext, useState, useContext, useEffect } from 'react'
import { api } from '../utils/api'

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Проверяем, есть ли сохраненный токен и загружаем данные пользователя
        const token = localStorage.getItem('jwt')
        if (token) {
            getCurrentUser()
        } else {
            setLoading(false)
        }
    }, [])

    const getCurrentUser = async () => {
        try {
            const userData = await api.get('/auth/me')
            setUser(userData)
            localStorage.setItem('user', JSON.stringify(userData))
        } catch (error) {
            console.error('Failed to get current user:', error)
            // Если токен невалидный, очищаем его
            localStorage.removeItem('jwt')
            localStorage.removeItem('user')
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    const login = (token, userData) => {
        localStorage.setItem('jwt', token)
        localStorage.setItem('user', JSON.stringify(userData))
        setUser(userData)
    }

    const logout = () => {
        localStorage.removeItem('jwt')
        localStorage.removeItem('user')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, getCurrentUser }}>
            {children}
        </AuthContext.Provider>
    )
}
