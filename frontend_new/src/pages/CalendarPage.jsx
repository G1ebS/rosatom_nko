import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import ruLocale from '@fullcalendar/core/locales/ru'
import { useCity } from '../context/CityContext'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'
import CustomDropdown from '../components/CustomDropdown'
import Button from '../components/Button'
import { api } from '../utils/api'
import Loader from '../components/Loader'

const eventCategoryColors = {
    'Экология': { bg: '#00D4AA', border: '#00b894', text: '#ffffff' },
    'Социальная поддержка': { bg: '#FF6B6B', border: '#ee5a6f', text: '#ffffff' },
    'Образование': { bg: '#4ECDC4', border: '#45b7aa', text: '#ffffff' },
    'Культура': { bg: '#FFE66D', border: '#f4d03f', text: '#333333' },
    'Спорт': { bg: '#95E1D3', border: '#7dd3c1', text: '#ffffff' },
    'Другое': { bg: '#A8E6CF', border: '#8dd4b8', text: '#ffffff' }
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
    
    // Сохраняем plannedEvents в localStorage при изменении
    React.useEffect(() => {
        try {
            localStorage.setItem('plannedEvents', JSON.stringify(Array.from(plannedEvents)))
        } catch (e) {
            console.error('Error saving planned events:', e)
        }
    }, [plannedEvents])
    
    // Слушаем изменения localStorage для синхронизации между вкладками
    React.useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'plannedEvents') {
                try {
                    const parsed = JSON.parse(e.newValue || '[]')
                    setPlannedEvents(new Set(parsed))
                } catch (err) {
                    console.error('Error parsing planned events:', err)
                }
            }
        }
        
        window.addEventListener('storage', handleStorageChange)
        
        // Также проверяем при фокусе на окне (для синхронизации в той же вкладке)
        const handleFocus = () => {
            try {
                const saved = localStorage.getItem('plannedEvents')
                if (saved) {
                    const parsed = JSON.parse(saved)
                    setPlannedEvents(new Set(parsed))
                }
            } catch (e) {
                console.error('Error loading planned events:', e)
            }
        }
        
        window.addEventListener('focus', handleFocus)
        
        return () => {
            window.removeEventListener('storage', handleStorageChange)
            window.removeEventListener('focus', handleFocus)
        }
    }, [])
    
    const handleAddToPlans = (eventId) => {
        if (!user) {
            showToast('Войдите, чтобы добавить событие в планы', 'warning')
            return
        }
        const newPlannedEvents = new Set(plannedEvents)
        if (newPlannedEvents.has(eventId)) {
            newPlannedEvents.delete(eventId)
            showToast('Событие удалено из планов', 'success')
        } else {
            newPlannedEvents.add(eventId)
            showToast('Событие добавлено в ваши планы', 'success')
        }
        setPlannedEvents(newPlannedEvents)
    }
    
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [allCities, setAllCities] = useState(['Все'])
    const [allCategories, setAllCategories] = useState(['Все'])

    useEffect(() => {
        const loadEvents = async () => {
            setLoading(true)
            try {
                const params = {
                    upcoming: 'true',
                    ...(selectedCity !== 'Все' && selectedCity && { ngo__city: selectedCity })
                }
                const data = await api.get('/events/', params)
                const eventsList = data.results || data
                setEvents(eventsList)
                
                // Извлекаем уникальные города и категории
                const cities = ['Все', ...Array.from(new Set(eventsList.map(e => e.ngo?.city || e.city).filter(Boolean)))]
                const categories = ['Все', ...Array.from(new Set(eventsList.map(e => e.category || e.ngo?.category).filter(Boolean)))]
                setAllCities(cities)
                setAllCategories(categories)
            } catch (error) {
                console.error('Failed to load events:', error)
                setEvents([])
            } finally {
                setLoading(false)
            }
        }
        loadEvents()
    }, [selectedCity])
    
    const eventsForCity = useMemo(() => {
        return events.filter(e => {
            const eventCity = e.ngo?.city || e.city
            const cityMatch = selectedCity === 'Все' || eventCity === selectedCity || !eventCity
            const typeMatch = eventType === 'Все' || (eventType === 'Офлайн' && !e.online) || (eventType === 'Онлайн' && e.online)
            const categoryMatch = selectedCategory === 'Все' || (e.category || e.ngo?.category) === selectedCategory
            return cityMatch && typeMatch && categoryMatch
        }).map(e => {
            const isPlanned = plannedEvents.has(e.id)
            const eventCategory = e.category || e.ngo?.category || 'Другое'
            const colors = eventCategoryColors[eventCategory] || {
                bg: '#00D4AA',
                border: '#00b894',
                text: '#ffffff'
            }
            
            // Если событие в планах, добавляем визуальное выделение
            const plannedStyle = isPlanned ? {
                backgroundColor: colors.bg,
                borderColor: '#FFD700', // Золотая рамка для событий в планах
                borderWidth: '3px',
                boxShadow: '0 0 0 2px rgba(255, 215, 0, 0.3)'
            } : {}
            
            return {
                id: e.id,
                title: isPlanned ? `⭐ ${e.title}` : e.title,
                start: e.event_date || e.date,
                backgroundColor: colors.bg,
                borderColor: isPlanned ? '#FFD700' : colors.border,
                borderWidth: isPlanned ? 3 : 1,
                textColor: colors.text,
                classNames: ['event-card', isPlanned ? 'event-planned' : ''],
                extendedProps: {
                    category: e.category || e.ngo?.category,
                    subcategory: e.subcategory,
                    isPlanned: isPlanned
                }
            }
        })
    }, [selectedCity, eventType, selectedCategory, plannedEvents, events])

    const handleDateClick = (arg) => {
        const dateStr = arg.dateStr
        const dayEvents = events.filter(e => {
            const eventDate = (e.event_date || e.date).split('T')[0]
            const eventCity = e.ngo?.city || e.city
            const cityMatch = selectedCity === 'Все' || eventCity === selectedCity || !eventCity
            const typeMatch = eventType === 'Все' || (eventType === 'Офлайн' && !e.online) || (eventType === 'Онлайн' && e.online)
            const categoryMatch = selectedCategory === 'Все' || (e.category || e.ngo?.category) === selectedCategory
            return eventDate === dateStr && cityMatch && typeMatch && categoryMatch
        })
        if (dayEvents.length > 0) {
            setSelectedDate({ date: dateStr, events: dayEvents })
        } else {
            setSelectedDate(null)
        }
    }

    return (
        <div>
            <div className="text-center mb-8 py-8">
                <h1 className="text-5xl font-extrabold text-primary mb-4">Календарь</h1>
                <p className="text-xl text-gray-600">Не пропустите важные мероприятия</p>
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
                <h3 className="text-lg font-bold text-primary mb-4">Условные обозначения</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {Object.entries(eventCategoryColors).map(([category, colors]) => (
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
                    ))}
                </div>
            </div>
            
            {loading ? (
                <div className="flex justify-center py-16">
                    <Loader />
                </div>
            ) : (
                <div className="card mb-6 overflow-hidden">
                <style>{`
                    .fc {
                        font-family: 'Inter', sans-serif;
                    }
                    .fc-header-toolbar {
                        margin-bottom: 1.5rem;
                        padding: 1rem;
                        background: linear-gradient(135deg, rgba(0, 74, 173, 0.05) 0%, rgba(0, 212, 170, 0.05) 100%);
                        border-radius: 16px;
                    }
                    .fc-toolbar-title {
                        font-size: 1.5rem;
                        font-weight: 700;
                        color: #004AAD;
                    }
                    .fc-button {
                        background: linear-gradient(135deg, #004AAD 0%, #0066CC 100%);
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
                        background: rgba(0, 212, 170, 0.05);
                    }
                    .fc-day-today {
                        background: linear-gradient(135deg, rgba(0, 74, 173, 0.1) 0%, rgba(0, 212, 170, 0.1) 100%) !important;
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
                        box-shadow: 0 2px 8px rgba(0, 212, 170, 0.2);
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        cursor: pointer;
                    }
                    .event-card:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(0, 212, 170, 0.3);
                    }
                    .fc-col-header-cell {
                        padding: 0.75rem;
                        background: linear-gradient(135deg, rgba(0, 74, 173, 0.05) 0%, rgba(0, 212, 170, 0.05) 100%);
                        font-weight: 700;
                        color: #004AAD;
                        text-transform: capitalize;
                    }
                    .fc-daygrid-event {
                        margin: 0.125rem 0;
                    }
                    .event-planned {
                        box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.4) !important;
                        font-weight: 600 !important;
                    }
                    .event-planned:hover {
                        box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.6) !important;
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
            )}

            {/* Список событий на выбранный день */}
            {selectedDate && selectedDate.events.length > 0 && (
                <div className="card">
                    <h2 className="text-xl font-bold text-primary mb-4 text-center">
                        События на {new Date(selectedDate.date).toLocaleDateString('ru-RU', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                        })}
                    </h2>
                    <div className="space-y-4">
                        {selectedDate.events.map(event => {
                            const isPlanned = plannedEvents.has(event.id)
                            const eventCategory = event.category || event.ngo?.category || 'Другое'
                            const colors = eventCategoryColors[eventCategory] || {
                                bg: '#00D4AA',
                                border: '#00b894',
                                text: '#ffffff'
                            }
                            const eventCity = event.ngo?.city || event.city
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
                                                    {eventCategory}
                                                </span>
                                                {event.time && (
                                                    <span className="text-sm text-gray-500">🕐 {event.time}</span>
                                                )}
                                            </div>
                                            <h3 className="text-xl font-bold text-primary mb-2">{event.title}</h3>
                                            <p className="text-gray-600 mb-3">{event.description}</p>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span>📍 {eventCity}</span>
                                                {event.online ? (
                                                    <span className="text-accent">🌐 Онлайн</span>
                                                ) : (
                                                    <span>🏢 Офлайн</span>
                                                )}
                                            </div>
                                        </div>
                                        <Button 
                                            variant={isPlanned ? "outline" : "outline-accent"}
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleAddToPlans(event.id)
                                            }}
                                            ariaLabel={isPlanned ? "Убрать из планов" : "Добавить событие в планы"}
                                        >
                                            {isPlanned ? 'Убрать из планов' : 'Добавить в планы'}
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
                    <h2 className="text-xl font-bold text-primary mb-4 text-center">Все события</h2>
                    <div className="space-y-4">
                        {eventsForCity.map(event => {
                            const isPlanned = plannedEvents.has(event.id)
                            const eventCategory = event.category || event.ngo?.category || 'Другое'
                            const colors = eventCategoryColors[eventCategory] || {
                                bg: '#00D4AA',
                                border: '#00b894',
                                text: '#ffffff'
                            }
                            const eventCity = event.ngo?.city || event.city
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
                                                    {eventCategory}
                                                </span>
                                                {event.time && (
                                                    <span className="text-sm text-gray-500">🕐 {event.time}</span>
                                                )}
                                            </div>
                                            <h3 className="text-lg font-bold text-primary mb-1">{event.title}</h3>
                                            <p className="text-sm text-[#454545] mb-2">{event.description}</p>
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <span>
                                                    📅 {new Date(event.event_date || event.date).toLocaleDateString('ru-RU', { 
                                                        day: 'numeric', 
                                                        month: 'long', 
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                                <span>📍 {eventCity}</span>
                                                {event.online ? (
                                                    <span className="text-accent">🌐 Онлайн</span>
                                                ) : (
                                                    <span>🏢 Офлайн</span>
                                                )}
                                            </div>
                                        </div>
                                        <Button 
                                            variant={isPlanned ? "outline" : "outline-accent"}
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleAddToPlans(event.id)
                                            }}
                                            ariaLabel={isPlanned ? "Убрать из планов" : "Добавить событие в планы"}
                                        >
                                            {isPlanned ? 'Убрать из планов' : 'Добавить в планы'}
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
