import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Button from '../components/Button'

export default function RegisterPage(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const { register } = useAuth()
    const { showToast } = useToast()
    const navigate = useNavigate()

    const submit = async (e) => {
        e.preventDefault()
        
        if (password !== passwordConfirm) {
            showToast('Пароли не совпадают', 'error')
            return
        }
        
        setLoading(true)
        
        try {
            const result = await register({
                email,
                password,
                passwordConfirm,
                name,
                username: email, // Используем email как username
            })
            
            if (result.success) {
                showToast('Аккаунт успешно создан!', 'success')
                navigate('/')
            } else {
                showToast(result.error || 'Ошибка при регистрации', 'error')
            }
        } catch (error) {
            showToast('Ошибка при регистрации. Попробуйте еще раз.', 'error')
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
                    <label htmlFor="register-password-confirm" className="block text-sm font-semibold text-gray-700 mb-2">Подтвердите пароль</label>
                    <input 
                        id="register-password-confirm"
                        type="password" 
                        placeholder="Подтвердите пароль" 
                        value={passwordConfirm} 
                        onChange={e=>setPasswordConfirm(e.target.value)}
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
