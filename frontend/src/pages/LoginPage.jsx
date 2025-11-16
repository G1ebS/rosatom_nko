import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Button from '../components/Button'

export default function LoginPage(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const { showToast } = useToast()
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || '/'

    const submit = async (e) => {
        e.preventDefault()
        setLoading(true)
        
        try {
            const result = await login(email, password)
            if (result.success) {
                showToast('Добро пожаловать!', 'success')
                navigate(from, { replace: true })
            } else {
                showToast(result.error || 'Неверные email или пароль', 'error')
            }
        } catch (error) {
            showToast('Ошибка при входе. Попробуйте еще раз.', 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-md mx-auto card">
            <h3 className="text-2xl font-bold text-primary mb-6">Вход</h3>
            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label htmlFor="login-email" className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input 
                        id="login-email"
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={e=>setEmail(e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-modern px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                        required 
                    />
                </div>
                <div>
                    <label htmlFor="login-password" className="block text-sm font-semibold text-gray-700 mb-2">Пароль</label>
                    <input 
                        id="login-password"
                        type="password" 
                        placeholder="Пароль" 
                        value={password} 
                        onChange={e=>setPassword(e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-modern px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                        required 
                    />
                </div>
                <Button 
                    type="submit" 
                    variant="primary" 
                    fullWidth
                    loading={loading}
                    disabled={loading}
                    ariaLabel="Войти в систему"
                >
                    Войти
                </Button>
            </form>
            <p className="text-sm mt-4 text-center">
                Нет аккаунта? <Link to="/register" className="text-accent hover:text-accent-hover font-semibold transition-colors">Регистрация</Link>
            </p>
        </div>
    )
}
