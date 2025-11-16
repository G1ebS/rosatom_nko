import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import Button from '../components/Button'
import { api } from '../utils/api'

export default function RegisterPage(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [city, setCity] = useState('')
    const [loading, setLoading] = useState(false)
    const { showToast } = useToast()
    const navigate = useNavigate()

    const submit = async (e) => {
        e.preventDefault()
        setLoading(true)
        
        try {
            await api.post('/auth/register', {
                email,
                password,
                name,
                city: city || undefined,
                interests: []
            })
            
            showToast('Аккаунт успешно создан! Теперь вы можете войти.', 'success')
            navigate('/login')
        } catch (error) {
            console.error('Registration error:', error)
            showToast(error.message || 'Ошибка при регистрации', 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-md mx-auto card">
            <h3 className="text-2xl font-bold text-primary mb-6">Регистрация</h3>
            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label htmlFor="register-name" className="block text-sm font-semibold text-gray-700 mb-2">Имя</label>
                    <input 
                        id="register-name"
                        type="text" 
                        placeholder="Ваше имя" 
                        value={name} 
                        onChange={e=>setName(e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-modern px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                        required 
                    />
                </div>
                <div>
                    <label htmlFor="register-email" className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input 
                        id="register-email"
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={e=>setEmail(e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-modern px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                        required 
                    />
                </div>
                <div>
                    <label htmlFor="register-password" className="block text-sm font-semibold text-gray-700 mb-2">Пароль</label>
                    <input 
                        id="register-password"
                        type="password" 
                        placeholder="Пароль" 
                        value={password} 
                        onChange={e=>setPassword(e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-modern px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                        required 
                    />
                </div>
                <div>
                    <label htmlFor="register-city" className="block text-sm font-semibold text-gray-700 mb-2">Город (необязательно)</label>
                    <input 
                        id="register-city"
                        type="text" 
                        placeholder="Ваш город" 
                        value={city} 
                        onChange={e=>setCity(e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-modern px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                    />
                </div>
                <Button 
                    type="submit" 
                    variant="primary" 
                    fullWidth
                    loading={loading}
                    disabled={loading}
                    ariaLabel="Зарегистрироваться"
                >
                    Зарегистрироваться
                </Button>
            </form>
            <p className="text-sm mt-4 text-center">
                Уже есть аккаунт? <Link to="/login" className="text-accent hover:text-accent-hover font-semibold transition-colors">Войти</Link>
            </p>
        </div>
    )
}
