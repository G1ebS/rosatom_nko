import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import ruLocale from '@fullcalendar/core/locales/ru'
import { eventAPI, categoryAPI } from '../services/api'
import { useCity } from '../context/CityContext'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'
import CustomDropdown from '../components/CustomDropdown'
import Button from '../components/Button'
import Loader from '../components/Loader'

// Цвета категорий (можно получать с API)
const eventCategoryColors = {
    'Экология': { bg: '#00A651', border: '#008a43', text: '#ffffff' },
    'Социальная поддержка': { bg: '#4896d2', border: '#1a2165', text: '#ffffff' },
    'Образование': { bg: '#FF6B6B', border: '#EE5A52', text: '#ffffff' },
    'Культура': { bg: '#9B59B6', border: '#8E44AD', text: '#ffffff' },
    'Спорт': { bg: '#F39C12', border: '#E67E22', text: '#ffffff' },
}

export default function CalendarPage(){
    const { city } = useCity()
    const { showToast } = useToast()
    const { user } = useAuth()
    const navigate = useNavigate()
    const [selectedDate, setSelectedDate] = useState(null)
    const [eventType, setEventType] = useState('Все')
    const [selectedCategory, setSelectedCategory] = useState('Все')
    const [selectedCity, setSelectedCity] = useState(city)
    const [events, setEvents] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    
    const loadCategories = useCallback(async () => {
        try {
            const catsData = await categoryAPI.getAll()
            setCategories(catsData)
        } catch (error) {
            console.error('Failed to load categories:', error)
        }
    }, [])

    const loadEvents = useCallback(async () => {
        setLoading(true)
        try {
            const params = {}
            if (selectedCity && selectedCity !== 'Все') params.city = selectedCity
            if (selectedCategory && selectedCategory !== 'Все') {
                const cat = categories.find(c => c.name === selectedCategory)
                if (cat) params.category = cat.slug
            }
            
            const response = await eventAPI.getAll(params)
            const eventsList = response.results || response
            setEvents(Array.isArray(eventsList) ? eventsList : [])
        } catch (error) {
            console.error('Failed to load events:', error)
            setEvents([])
        } finally {
            setLoading(false)
        }
    }, [selectedCity, selectedCategory, categories])

    // Загружаем категории один раз при монтировании
    useEffect(() => {
        loadCategories()
    }, [loadCategories])

    // Загружаем события при изменении фильтров
    useEffect(() => {
        loadEvents()
    }, [loadEvents])
    
    const handleAddToPlans = async (eventId) => {
        if (!user) {
            showToast('Войдите, чтобы зарегистрироваться на событие', 'warning')
            return
        }
        try {
            const event = events.find(e => e.id === eventId)
            if (!event) return
            
            // Проверяем, зарегистрирован ли пользователь
            const isRegistered = user.event_registrations?.includes(eventId) || false
            
            if (isRegistered) {
                await eventAPI.unregister(eventId)
                showToast('Регистрация отменена', 'success')
            } else {
                await eventAPI.register(eventId)
                showToast('Вы успешно зарегистрированы на событие', 'success')
            }
            // Перезагружаем события для обновления статуса
            await loadEvents()
        } catch (error) {
            console.error('Failed to register:', error)
            showToast('Ошибка при регистрации', 'error')
        }
    }
    
    const allCities = ['Все', ...Array.from(new Set(events.map(e => e.city).filter(Boolean)))]
    const allCategories = ['Все', ...categories.map(c => c.name)]
    
    const eventsForCity = useMemo(() => {
        return events.filter(e => {
            const cityMatch = !selectedCity || selectedCity === 'Все' || e.city === selectedCity
            const typeMatch = eventType === 'Все' || (eventType === 'Офлайн' && !e.online) || (eventType === 'Онлайн' && e.online)
            const categoryMatch = selectedCategory === 'Все' || e.category?.name === selectedCategory || e.category === selectedCategory
            return cityMatch && typeMatch && categoryMatch
        }).map(e => {
            const isRegistered = user?.event_registrations?.includes(e.id) || false
            const categoryName = e.category?.name || e.category || 'Событие'
            const colors = eventCategoryColors[categoryName] || {
                bg: '#4896d2',
                border: '#1a2165',
                text: '#ffffff'
            }
            
            return {
                id: e.id,
                title: isRegistered ? `✓ ${e.title}` : e.title,
                start: e.date || e.start_date,
                backgroundColor: colors.bg,
                borderColor: isRegistered ? '#00A651' : colors.border,
                borderWidth: isRegistered ? 3 : 1,
                textColor: colors.text,
                classNames: ['event-card', isRegistered ? 'event-registered' : ''],
                extendedProps: {
                    category: categoryName,
                    subcategory: e.subcategory,
                    isRegistered: isRegistered
                }
            }
        })
    }, [events, selectedCity, eventType, selectedCategory, user])

    const handleDateClick = (arg) => {
        const dateStr = arg.dateStr
        const dayEvents = events.filter(e => {
            const eventDate = (e.date || e.start_date)?.split('T')[0]
            const cityMatch = !selectedCity || selectedCity === 'Все' || e.city === selectedCity
            const typeMatch = eventType === 'Все' || (eventType === 'Офлайн' && !e.online) || (eventType === 'Онлайн' && e.online)
            const categoryMatch = selectedCategory === 'Все' || e.category?.name === selectedCategory || e.category === selectedCategory
            return eventDate === dateStr && cityMatch && typeMatch && categoryMatch
        })
        if (dayEvents.length > 0) {
            setSelectedDate({ date: dateStr, events: dayEvents })
        } else {
            setSelectedDate(null)
        }
    }

    if (loading) {
        return <Loader />
    }

    return (
        <div>
            <div className="text-center mb-8 py-8">
                <h1 className="text-5xl font-extrabold mb-4" style={{ color: '#1a2165' }}>Календарь</h1>
                <p className="text-xl" style={{ color: '#3a3a39' }}>Не пропустите важные мероприятия</p>
            </div>

            {/* Фильтры */}
            <div className="card mb-6">
                <div className="grid md:grid-cols-5 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Категория</label>
                        <CustomDropdown
                            options={allCategories.map(c => ({ value: c, label: c }))}
                            value={selectedCategory}
                            onChange={setSelectedCategory}
                            placeholder="Категория"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Формат</label>
                        <CustomDropdown
                            options={[
                                { value: 'Все', label: 'Все форматы' },
                                { value: 'Офлайн', label: 'Офлайн' },
                                { value: 'Онлайн', label: 'Онлайн' }
                            ]}
                            value={eventType}
                            onChange={setEventType}
                            placeholder="Формат"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Город</label>
                        <CustomDropdown
                            options={allCities.map(c => ({ value: c, label: c }))}
                            value={selectedCity}
                            onChange={setSelectedCity}
                            placeholder="Город"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Дата</label>
                        <input 
                            type="date" 
                            className="w-full border-2 border-gray-200 rounded-modern px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all hover:border-accent" 
                        />
                    </div>
                    <div className="flex items-end">
                        <Button 
                            variant="primary"
                            fullWidth
                            onClick={() => {
                                setEventType('Все')
                                setSelectedCategory('Все')
                                setSelectedCity(city)
                            }}
                            ariaLabel="Сбросить фильтры"
                        >
                            Сбросить
                        </Button>
                    </div>
                </div>
            </div>

            {/* Легенда с условными обозначениями */}
            <div className="card mb-6">
                <h3 className="text-lg font-bold mb-4" style={{ color: '#1a2165' }}>Условные обозначения</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {allCategories.filter(c => c !== 'Все').map(category => {
                        const colors = eventCategoryColors[category] || { bg: '#4896d2', border: '#1a2165', text: '#ffffff' }
                        return (
                        <div key={category} className="flex items-center gap-2">
                            <div 
                                className="w-4 h-4 rounded flex-shrink-0"
                                style={{ 
                                    backgroundColor: colors.bg,
                                    border: `2px solid ${colors.border}`
                                }}
                            ></div>
                            <span className="text-sm text-gray-700">{category}</span>
                        </div>
                    )})}
                </div>
            </div>
            
            <div className="card mb-6 overflow-hidden">
                <style>{`
                    .fc {
                        font-family: 'Inter', sans-serif;
                    }
                    .fc-header-toolbar {
                        margin-bottom: 1.5rem;
                        padding: 1rem;
                        background: linear-gradient(135deg, rgba(26, 33, 101, 0.05) 0%, rgba(72, 150, 210, 0.05) 100%);
                        border-radius: 16px;
                    }
                    .fc-toolbar-title {
                        font-size: 1.5rem;
                        font-weight: 700;
                        color: #1a2165;
                    }
                    .fc-button {
                        background: linear-gradient(180deg, #4896d2 0%, #1a2165 100%);
                        border: none;
                        border-radius: 12px;
                        padding: 0.5rem 1rem;
                        font-weight: 600;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    }
                    .fc-button:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 8px 24px rgba(0, 74, 173, 0.3);
                    }
                    .fc-button-primary:not(:disabled):active {
                        background: linear-gradient(135deg, #003b8a 0%, #0052a3 100%);
                    }
                    .fc-daygrid-day {
                        border-radius: 8px;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    }
                    .fc-daygrid-day:hover {
                        background: rgba(72, 150, 210, 0.05);
                    }
                    .fc-day-today {
                        background: linear-gradient(135deg, rgba(26, 33, 101, 0.1) 0%, rgba(72, 150, 210, 0.1) 100%) !important;
                    }
                    .fc-daygrid-day-number {
                        padding: 0.5rem;
                        font-weight: 600;
                        color: #333;
                    }
                    .fc-daygrid-day-top {
                        flex-direction: row;
                    }
                    .event-card {
                        border-radius: 8px;
                        padding: 0.25rem 0.5rem;
                        font-weight: 600;
                        font-size: 0.875rem;
                        box-shadow: 0 2px 8px rgba(26, 33, 101, 0.2);
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        cursor: pointer;
                    }
                    .event-card:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(26, 33, 101, 0.3);
                    }
                    .fc-col-header-cell {
                        padding: 0.75rem;
                        background: linear-gradient(135deg, rgba(26, 33, 101, 0.05) 0%, rgba(72, 150, 210, 0.05) 100%);
                        font-weight: 700;
                        color: #1a2165;
                        text-transform: capitalize;
                    }
                    .fc-daygrid-event {
                        margin: 0.125rem 0;
                    }
                    .event-registered {
                        box-shadow: 0 0 0 2px rgba(0, 166, 81, 0.4) !important;
                        font-weight: 600 !important;
                    }
                    .event-registered:hover {
                        box-shadow: 0 0 0 3px rgba(0, 166, 81, 0.6) !important;
                        transform: translateY(-1px);
                    }
                `}</style>
                <FullCalendar 
                    plugins={[dayGridPlugin]} 
                    initialView="dayGridMonth" 
                    locale={ruLocale}
                    events={eventsForCity}
                    dateClick={handleDateClick}
                    eventClick={(info) => {
                        navigate(`/events/${info.event.id}`, { state: { from: '/calendar' } })
                    }}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: ''
                    }}
                    height="auto"
                    eventDisplay="block"
                    dayMaxEvents={3}
                    moreLinkClick="popover"
                    firstDay={1}
                />
            </div>

            {/* Список событий на выбранный день */}
            {selectedDate && selectedDate.events.length > 0 && (
                <div className="card">
                    <h2 className="text-xl font-bold mb-4 text-center" style={{ color: '#1a2165' }}>
                        События на {new Date(selectedDate.date).toLocaleDateString('ru-RU', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                        })}
                    </h2>
                    <div className="space-y-4">
                        {selectedDate.events.map(event => {
                            const isRegistered = user?.event_registrations?.includes(event.id) || false
                            const categoryName = event.category?.name || event.category || 'Событие'
                            const colors = eventCategoryColors[categoryName] || {
                                bg: '#4896d2',
                                border: '#1a2165',
                                text: '#ffffff'
                            }
                            return (
                                <div 
                                    key={event.id} 
                                    className="card cursor-pointer hover:shadow-modern transition-all relative overflow-hidden"
                                    style={{ borderLeft: `4px solid ${colors.border}` }}
                                    onClick={() => navigate(`/events/${event.id}`, { state: { from: '/calendar' } })}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span 
                                                    className="px-2 py-1 rounded text-xs font-semibold"
                                                    style={{ 
                                                        backgroundColor: colors.bg,
                                                        color: colors.text
                                                    }}
                                                >
                                                    {categoryName}
                                                </span>
                                                {event.time && (
                                                    <span className="text-sm text-gray-500">🕐 {event.time}</span>
                                                )}
                                            </div>
                                            <h3 className="text-xl font-bold mb-2" style={{ color: '#1a2165' }}>{event.title}</h3>
                                            <p className="mb-3" style={{ color: '#3a3a39' }}>{event.description}</p>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span>📍 {event.city}</span>
                                                {event.online ? (
                                                    <span className="text-accent">🌐 Онлайн</span>
                                                ) : (
                                                    <span>🏢 Офлайн</span>
                                                )}
                                            </div>
                                        </div>
                                        <Button 
                                            variant={isRegistered ? "outline" : "primary"}
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleAddToPlans(event.id)
                                            }}
                                            ariaLabel={isRegistered ? "Отменить регистрацию" : "Зарегистрироваться"}
                                        >
                                            {isRegistered ? 'Зарегистрирован' : 'Зарегистрироваться'}
                                        </Button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Общий список всех событий */}
            {!selectedDate && eventsForCity.length > 0 && (
                <div className="card">
                    <h2 className="text-xl font-bold mb-4 text-center" style={{ color: '#1a2165' }}>Все события</h2>
                    <div className="space-y-4">
                        {eventsForCity.map(eventData => {
                            const event = events.find(e => e.id === eventData.id)
                            if (!event) return null
                            const isRegistered = user?.event_registrations?.includes(event.id) || false
                            const categoryName = event.category?.name || event.category || 'Событие'
                            const colors = eventCategoryColors[categoryName] || {
                                bg: '#4896d2',
                                border: '#1a2165',
                                text: '#ffffff'
                            }
                            return (
                                <div 
                                    key={event.id} 
                                    className="card cursor-pointer hover:shadow-modern transition-all relative overflow-hidden"
                                    style={{ borderLeft: `4px solid ${colors.border}` }}
                                    onClick={() => navigate(`/events/${event.id}`, { state: { from: '/calendar' } })}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span 
                                                    className="px-2 py-1 rounded text-xs font-semibold"
                                                    style={{ 
                                                        backgroundColor: colors.bg,
                                                        color: colors.text
                                                    }}
                                                >
                                                    {categoryName}
                                                </span>
                                                {event.time && (
                                                    <span className="text-sm text-gray-500">🕐 {event.time}</span>
                                                )}
                                            </div>
                                            <h3 className="text-lg font-bold mb-1" style={{ color: '#1a2165' }}>{event.title}</h3>
                                            <p className="text-sm mb-2" style={{ color: '#3a3a39' }}>{event.description}</p>
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <span>
                                                    📅 {new Date(event.date || event.start_date).toLocaleDateString('ru-RU', { 
                                                        day: 'numeric', 
                                                        month: 'long', 
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                                <span>📍 {event.city}</span>
                                                {event.online ? (
                                                    <span className="text-accent">🌐 Онлайн</span>
                                                ) : (
                                                    <span>🏢 Офлайн</span>
                                                )}
                                            </div>
                                        </div>
                                        <Button 
                                            variant={isRegistered ? "outline" : "primary"}
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleAddToPlans(event.id)
                                            }}
                                            ariaLabel={isRegistered ? "Отменить регистрацию" : "Зарегистрироваться"}
                                        >
                                            {isRegistered ? 'Зарегистрирован' : 'Зарегистрироваться'}
                                        </Button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
