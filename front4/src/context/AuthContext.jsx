import React, { createContext, useState, useContext, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Проверяем токен при загрузке
        const token = localStorage.getItem('token')
        if (token) {
            loadUser()
        } else {
            setLoading(false)
        }
    }, [])

    const loadUser = async () => {
        try {
            const userData = await authAPI.getCurrentUser()
            setUser(userData)
        } catch (error) {
            console.error('Failed to load user:', error)
            // Если токен невалидный, очищаем
            authAPI.logout()
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    const login = async (email, password) => {
        try {
            const response = await authAPI.login(email, password)
            // После логина получаем данные пользователя
            const userData = await authAPI.getCurrentUser()
            setUser(userData)
            return { success: true, user: userData }
        } catch (error) {
            console.error('Login error:', error)
            return { success: false, error: error.message }
        }
    }

    const register = async (userData) => {
        try {
            const response = await authAPI.register(userData)
            if (response.access) {
                localStorage.setItem('token', response.access)
                if (response.refresh) {
                    localStorage.setItem('refreshToken', response.refresh)
                }
            }
            const currentUser = await authAPI.getCurrentUser()
            setUser(currentUser)
            return { success: true, user: currentUser }
        } catch (error) {
            console.error('Register error:', error)
            return { success: false, error: error.message }
        }
    }

    const logout = () => {
        authAPI.logout()
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}
