import React, { createContext, useState, useContext, useEffect } from 'react'
import { authAPI } from '../utils/api'

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Загрузка пользователя при инициализации
    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('jwt')
            const storedUser = localStorage.getItem('user')
            
            if (token && storedUser) {
                try {
                    // Пытаемся получить актуальные данные пользователя
                    const userData = await authAPI.getCurrentUser()
                    setUser(userData)
                    localStorage.setItem('user', JSON.stringify(userData))
                } catch (error) {
                    // Если токен невалидный, очищаем хранилище
                    console.error('Failed to load user:', error)
                    localStorage.removeItem('jwt')
                    localStorage.removeItem('user')
                    setUser(null)
                }
            }
            setLoading(false)
        }
        
        loadUser()
    }, [])

    const login = async (email, password) => {
        try {
            const response = await authAPI.login(email, password)
            
            // Сохраняем токены
            localStorage.setItem('jwt', response.access)
            localStorage.setItem('refresh', response.refresh)
            
            // Получаем данные пользователя
            const userData = await authAPI.getCurrentUser()
            localStorage.setItem('user', JSON.stringify(userData))
            setUser(userData)
            
            return { success: true, user: userData }
        } catch (error) {
            console.error('Login failed:', error)
            return { success: false, error: error.message }
        }
    }

    const register = async (userData) => {
        try {
            const response = await authAPI.register(userData)
            
            // Сохраняем токены
            localStorage.setItem('jwt', response.access)
            localStorage.setItem('refresh', response.refresh)
            
            // Сохраняем данные пользователя
            const user = response.user
            localStorage.setItem('user', JSON.stringify(user))
            setUser(user)
            
            return { success: true, user }
        } catch (error) {
            console.error('Registration failed:', error)
            return { success: false, error: error.message }
        }
    }

    const logout = () => {
        localStorage.removeItem('jwt')
        localStorage.removeItem('refresh')
        localStorage.removeItem('user')
        setUser(null)
    }

    const updateUser = (userData) => {
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    )
}
