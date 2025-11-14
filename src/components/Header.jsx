import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from './Button'

export default function Header(){
    const { user, logout } = useAuth()
    const [open, setOpen] = useState(false)

    return (
        <header className="bg-white/95 backdrop-blur-md shadow-modern sticky top-0 z-50 border-b border-gray-100">
            <div className="container-max flex items-center justify-between h-16">
                <div className="flex items-center gap-4">
                    <Link to="/" className="flex items-center gap-3">
                        {/* Горизонтальный логотип Росатом */}
                        {/* ВАЖНО: Для продакшена необходимо заменить на официальный логотип Росатом из брендбука */}
                        {/* Рекомендуется использовать файл логотипа в формате SVG или PNG */}
                        <div className="flex items-center gap-2">
                            {/* Временная заглушка - текст "РОСАТОМ" */}
                            <svg width="120" height="32" viewBox="0 0 120 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <text x="0" y="22" fontFamily="Arial, sans-serif" fontSize="20" fontWeight="bold" fill="#15256D">РОСАТОМ</text>
                            </svg>
                            {/* Альтернативный вариант с использованием изображения:
                            <img src="/logo-rosatom.svg" alt="Росатом" className="h-8" />
                            */}
                        </div>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6 ml-8">
                        <Link to="/" className="text-sm font-bold text-[#333333] hover:text-accent transition-colors">Главная</Link>
                        <Link to="/ngos" className="text-sm font-bold text-[#333333] hover:text-accent transition-colors">НКО</Link>
                        <Link to="/knowledge" className="text-sm font-bold text-[#333333] hover:text-accent transition-colors">База знаний</Link>
                        <Link to="/calendar" className="text-sm font-bold text-[#333333] hover:text-accent transition-colors">Календарь</Link>
                        <Link to="/news" className="text-sm font-bold text-[#333333] hover:text-accent transition-colors">Новости</Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <Link to="/profile" className="hidden sm:inline text-sm text-[#333333] hover:text-accent transition-colors">{user.name || 'Профиль'}</Link>
                            {user.role === 'admin' && (
                                <Link to="/admin" className="hidden sm:inline text-sm text-accent hover:text-accent-hover font-semibold transition-colors">
                                    Админка
                                </Link>
                            )}
                            <Button 
                                variant="outline"
                                size="sm"
                                onClick={logout}
                                ariaLabel="Выйти из системы"
                            >
                                Выйти
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button 
                                variant="outline"
                                size="sm"
                                href="/login"
                                ariaLabel="Войти в систему"
                            >
                                Войти
                            </Button>
                            <Button 
                                variant="primary"
                                size="sm"
                                href="/register"
                                ariaLabel="Зарегистрироваться"
                            >
                                Регистрация
                            </Button>
                        </>
                    )}

                    {/* Mobile toggle */}
                    <button className="md:hidden p-2 ml-2" onClick={() => setOpen(o => !o)} aria-label="menu">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-[#333333]"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="md:hidden border-t bg-white">
                    <div className="p-4 space-y-2">
                        <Link to="/" className="block text-sm font-bold text-[#333333] hover:text-accent">Главная</Link>
                        <Link to="/ngos" className="block text-sm font-bold text-[#333333] hover:text-accent">НКО</Link>
                        <Link to="/knowledge" className="block text-sm font-bold text-[#333333] hover:text-accent">База знаний</Link>
                        <Link to="/calendar" className="block text-sm font-bold text-[#333333] hover:text-accent">Календарь</Link>
                        <Link to="/news" className="block text-sm font-bold text-[#333333] hover:text-accent">Новости</Link>
                    </div>
                </div>
            )}
        </header>
    )
}
