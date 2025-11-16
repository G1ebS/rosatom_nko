import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { eventAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Button from '../components/Button'
import Loader from '../components/Loader'

// Цвета категорий (можно вынести в отдельный файл или получать с API)
const eventCategoryColors = {
    'Экология': { bg: '#00A651', border: '#008a43', text: '#ffffff' },
    'Социальная поддержка': { bg: '#4896d2', border: '#1a2165', text: '#ffffff' },
    'Образование': { bg: '#FF6B6B', border: '#EE5A52', text: '#ffffff' },
    'Культура': { bg: '#9B59B6', border: '#8E44AD', text: '#ffffff' },
    'Спорт': { bg: '#F39C12', border: '#E67E22', text: '#ffffff' },
}

export default function EventDetailsPage(){
    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const { user } = useAuth()
    const { showToast } = useToast()
    const [event, setEvent] = useState(null)
    const [loading, setLoading] = useState(true)
    
    const [isRegistered, setIsRegistered] = useState(false)
    
    useEffect(() => {
        loadEvent()
    }, [id])

    useEffect(() => {
        if (user && event) {
            // Проверяем, зарегистрирован ли пользователь на событие
            // Это можно получить из API или из данных пользователя
            const registrations = user.event_registrations || []
            setIsRegistered(registrations.includes(event.id))
        }
    }, [user, event])

    const loadEvent = async () => {
        setLoading(true)
        try {
            const data = await eventAPI.getById(id)
            setEvent(data)
        } catch (error) {
            console.error('Failed to load event:', error)
            showToast('Ошибка загрузки события', 'error')
        } finally {
            setLoading(false)
        }
    }
    
    // Определяем, откуда пришли (из профиля или календаря)
    const fromPath = location.state?.from || '/calendar'
    const isFromProfile = fromPath === '/profile'
    const backPath = isFromProfile ? '/profile' : '/calendar'
    const backLabel = isFromProfile ? 'Вернуться в личный кабинет' : 'Вернуться к календарю'

    if (loading) {
        return <Loader />
    }

    if (!event) {
        return (
            <div className="max-w-4xl mx-auto text-center py-12">
                <p className="text-gray-500 text-lg">Событие не найдено</p>
                <Button variant="primary" onClick={() => navigate(backPath)} className="mt-4">
                    {backLabel}
                </Button>
            </div>
        )
    }

    const handleRegister = async () => {
        if (!user) {
            showToast('Войдите, чтобы зарегистрироваться на событие', 'warning')
            return
        }
        try {
            if (isRegistered) {
                await eventAPI.unregister(id)
                setIsRegistered(false)
                showToast('Регистрация отменена', 'success')
            } else {
                await eventAPI.register(id)
                setIsRegistered(true)
                showToast('Вы успешно зарегистрированы на событие', 'success')
            }
        } catch (error) {
            console.error('Failed to register:', error)
            showToast('Ошибка при регистрации', 'error')
        }
    }

    const categoryName = event.category?.name || event.category || 'Событие'
    const colors = eventCategoryColors[categoryName] || {
        bg: '#4896d2',
        border: '#1a2165',
        text: '#ffffff'
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Заголовок */}
            <div className="mb-8 text-center">
                <div className="mb-4 flex items-center justify-center gap-3 flex-wrap">
                    <span 
                        className="inline-block px-4 py-1.5 text-sm font-semibold rounded-full"
                        style={{ 
                            backgroundColor: colors.bg,
                            color: colors.text
                        }}
                    >
                        {categoryName}
                    </span>
                    <span className="inline-block px-4 py-1.5 text-sm font-semibold rounded-full bg-accent/10 text-accent">
                        {event.online ? 'Онлайн' : 'Офлайн'}
                    </span>
                </div>
                <h1 className="text-4xl font-bold mb-4" style={{ color: '#1a2165' }}>{event.title}</h1>
                <p className="text-lg" style={{ color: '#3a3a39' }}>{event.city}</p>
            </div>

            {/* Основная информация */}
            <div className="card mb-8" style={{ borderLeft: `4px solid ${colors.border}` }}>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="text-center md:text-left">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Дата и время</h3>
                        <p className="text-lg font-bold" style={{ color: '#1a2165' }}>
                            {new Date(event.date || event.start_date).toLocaleDateString('ru-RU', { 
                                day: 'numeric', 
                                month: 'long', 
                                year: 'numeric',
                                weekday: 'long'
                            })}
                        </p>
                        {event.time && (
                            <p className="text-base text-gray-600 mt-1">🕐 {event.time}</p>
                        )}
                    </div>
                    <div className="text-center md:text-left">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Место проведения</h3>
                        <p className="text-lg font-bold" style={{ color: '#1a2165' }}>{event.location || event.address || event.city}</p>
                        {event.online !== undefined && (
                            <p className="text-base text-gray-600 mt-1">
                                {event.online ? '🌐 Онлайн-мероприятие' : '🏢 Офлайн-мероприятие'}
                            </p>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Информация о категории */}
            {categoryName && (
                <div className="card mb-8" style={{ backgroundColor: `${colors.bg}15`, borderLeft: `4px solid ${colors.border}` }}>
                    <div className="flex items-start gap-4">
                        <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: colors.bg }}
                        >
                            <svg className="w-6 h-6" style={{ color: colors.text }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold mb-2" style={{ color: '#1a2165' }}>Категория: {categoryName}</h3>
                            <p className="text-sm text-gray-600">
                                {event.subcategory && `Подкатегория: ${event.subcategory}`}
                                {!event.subcategory && `Это событие относится к категории ${categoryName}`}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Описание */}
            <div className="card mb-8">
                <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: '#1a2165' }}>О событии</h2>
                <div className="prose max-w-none text-center">
                    <p className="text-base leading-relaxed" style={{ color: '#3a3a39' }}>
                        {event.description}
                    </p>
                </div>
            </div>

            {/* Организатор */}
            {event.ngo_name && (
                <div className="card mb-8">
                    <h3 className="text-xl font-bold mb-4 text-center" style={{ color: '#1a2165' }}>Организатор</h3>
                    <p className="text-center text-gray-600">{event.ngo_name}</p>
                </div>
            )}

            {/* Действия */}
            <div className="flex flex-wrap gap-3 justify-center">
                <Button
                    variant={isRegistered ? "outline" : "primary"}
                    onClick={handleRegister}
                    icon={
                        isRegistered ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        )
                    }
                    ariaLabel={isRegistered ? "Отменить регистрацию" : "Зарегистрироваться на событие"}
                >
                    {isRegistered ? 'Зарегистрирован' : 'Зарегистрироваться'}
                </Button>
                <Button
                    variant="outline"
                    onClick={() => navigate(backPath)}
                    ariaLabel={backLabel}
                >
                    {backLabel}
                </Button>
            </div>
        </div>
    )
}

