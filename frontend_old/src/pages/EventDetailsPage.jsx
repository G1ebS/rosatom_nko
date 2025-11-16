import React, { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { events, eventCategoryColors } from '../data/events'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Button from '../components/Button'

export default function EventDetailsPage(){
    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const { user } = useAuth()
    const { showToast } = useToast()
    const event = events.find(e => String(e.id) === id)
    
    // Загружаем plannedEvents из localStorage
    const [plannedEvents, setPlannedEvents] = useState(() => {
        try {
            const saved = localStorage.getItem('plannedEvents')
            if (saved) {
                const parsed = JSON.parse(saved)
                return new Set(parsed)
            }
        } catch (e) {
            console.error('Error loading planned events:', e)
        }
        return new Set()
    })
    
    const isPlanned = plannedEvents.has(Number(id))
    
    // Определяем, откуда пришли (из профиля или календаря)
    const fromPath = location.state?.from || '/calendar'
    const isFromProfile = fromPath === '/profile'
    const backPath = isFromProfile ? '/profile' : '/calendar'
    const backLabel = isFromProfile ? 'Вернуться в личный кабинет' : 'Вернуться к календарю'

    if (!event) return (
        <div className="max-w-4xl mx-auto text-center py-12">
            <p className="text-gray-500 text-lg">Событие не найдено</p>
            <Button variant="primary" onClick={() => navigate(backPath)} className="mt-4">
                {backLabel}
            </Button>
        </div>
    )

    const handleAddToPlans = () => {
        if (!user) {
            showToast('Войдите, чтобы добавить событие в планы', 'warning')
            return
        }
        const newPlannedEvents = new Set(plannedEvents)
        if (newPlannedEvents.has(Number(id))) {
            newPlannedEvents.delete(Number(id))
            showToast('Событие удалено из планов', 'success')
        } else {
            newPlannedEvents.add(Number(id))
            showToast('Событие добавлено в ваши планы', 'success')
        }
        setPlannedEvents(newPlannedEvents)
        
        // Сохраняем в localStorage
        try {
            localStorage.setItem('plannedEvents', JSON.stringify(Array.from(newPlannedEvents)))
        } catch (e) {
            console.error('Error saving planned events:', e)
        }
    }

    const colors = eventCategoryColors[event.category] || {
        bg: '#00D4AA',
        border: '#00b894',
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
                        {event.category || 'Событие'}
                    </span>
                    <span className="inline-block px-4 py-1.5 text-sm font-semibold rounded-full bg-accent/10 text-accent">
                        {event.online ? 'Онлайн' : 'Офлайн'}
                    </span>
                </div>
                <h1 className="text-4xl font-bold text-primary mb-4">{event.title}</h1>
                <p className="text-lg text-[#454545]">{event.city}</p>
            </div>

            {/* Основная информация */}
            <div className="card mb-8" style={{ borderLeft: `4px solid ${colors.border}` }}>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="text-center md:text-left">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Дата и время</h3>
                        <p className="text-lg font-bold text-primary">
                            {new Date(event.date).toLocaleDateString('ru-RU', { 
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
                        <p className="text-lg font-bold text-primary">{event.location || event.city}</p>
                        {event.online !== undefined && (
                            <p className="text-base text-gray-600 mt-1">
                                {event.online ? '🌐 Онлайн-мероприятие' : '🏢 Офлайн-мероприятие'}
                            </p>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Информация о категории */}
            {event.category && (
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
                            <h3 className="text-lg font-bold text-primary mb-2">Категория: {event.category}</h3>
                            <p className="text-sm text-gray-600">
                                {event.subcategory && `Подкатегория: ${event.subcategory}`}
                                {!event.subcategory && 'Это событие относится к категории ' + event.category}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Описание */}
            <div className="card mb-8">
                <h2 className="text-2xl font-bold text-primary mb-4 text-center">О событии</h2>
                <div className="prose max-w-none text-center">
                    <p className="text-[#454545] text-base leading-relaxed">
                        {event.description}
                    </p>
                </div>
            </div>

            {/* Организатор */}
            {event.ngo_name && (
                <div className="card mb-8">
                    <h3 className="text-xl font-bold text-primary mb-4 text-center">Организатор</h3>
                    <p className="text-center text-gray-600">{event.ngo_name}</p>
                </div>
            )}

            {/* Действия */}
            <div className="flex flex-wrap gap-3 justify-center">
                <Button
                    variant={isPlanned ? "outline" : "outline-accent"}
                    onClick={handleAddToPlans}
                    icon={
                        isPlanned ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        )
                    }
                    ariaLabel={isPlanned ? "Убрать из планов" : "Добавить в планы"}
                >
                    {isPlanned ? 'Убрать из планов' : 'Добавить в планы'}
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

