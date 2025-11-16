import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import ruLocale from '@fullcalendar/core/locales/ru'
import { eventAPI } from '../utils/api'
import { useCity } from '../context/CityContext'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'
import CustomDropdown from '../components/CustomDropdown'
import Button from '../components/Button'
import Loader from '../components/Loader'

export default function CalendarPage(){
    const { city } = useCity()
    const { showToast } = useToast()
    const { user } = useAuth()
    const navigate = useNavigate()
    const [selectedDate, setSelectedDate] = useState(null)
    const [eventType, setEventType] = useState('Все')
    const [selectedCity, setSelectedCity] = useState(city)
    const [plannedEvents, setPlannedEvents] = useState(new Set())
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    
    // Загрузка событий
    useEffect(() => {
        const loadEvents = async () => {
            setLoading(true)
            try {
                const params = { upcoming: 'true' }
                if (selectedCity !== 'Все') {
                    // Фильтрация по городу будет на бэкенде через НКО
                }
                const data = await eventAPI.getList(params)
                setEvents(Array.isArray(data) ? data : (data.results || []))
            } catch (error) {
                console.error('Failed to load events:', error)
                showToast('Ошибка при загрузке событий', 'error')
                setEvents([])
            } finally {
                setLoading(false)
            }
        }
        
        loadEvents()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCity])
    
    const handleAddToPlans = async (eventId) => {
        if (!user) {
            showToast('Войдите, чтобы зарегистрироваться на событие', 'warning')
            return
        }
        
        try {
            const event = events.find(e => e.id === eventId)
            if (!event) return
            
            if (event.is_registered) {
                await eventAPI.unregister(eventId)
                showToast('Регистрация отменена', 'success')
            } else {
                await eventAPI.register(eventId, {
                    name: user.first_name || user.username,
                    email: user.email,
                    phone: user.phone || '',
                })
                showToast('Вы успешно зарегистрированы на событие', 'success')
            }
            
            // Обновляем локальное состояние
            setEvents(events.map(e => 
                e.id === eventId 
                    ? { ...e, is_registered: !e.is_registered }
                    : e
            ))
        } catch (error) {
            console.error('Failed to register for event:', error)
            showToast('Ошибка при регистрации на событие', 'error')
        }
    }
    
    const allCities = ['Все', ...Array.from(new Set(events.map(e => e.ngo?.city || city)))]
    
    const eventsForCity = events
        .filter(e => {
            const eventCity = e.ngo?.city || city
            const cityMatch = selectedCity === 'Все' || eventCity === selectedCity
            return cityMatch
        })
        .map(e => ({
            id: e.id,
            title: e.title,
            start: e.event_date,
            backgroundColor: '#00D4AA',
            borderColor: '#00b894',
            textColor: '#ffffff',
            classNames: ['event-card']
        }))

    const handleDateClick = (arg) => {
        const dateStr = arg.dateStr
        const dayEvents = events.filter(e => {
            const eventDate = e.event_date ? e.event_date.split('T')[0] : null
            const eventCity = e.ngo?.city || city
            const cityMatch = selectedCity === 'Все' || eventCity === selectedCity
            return eventDate === dateStr && cityMatch
        })
        if (dayEvents.length > 0) {
            setSelectedDate({ date: dateStr, events: dayEvents })
        } else {
            setSelectedDate(null)
        }
    }

    return (
        <div>
            <div className="text-center mb-8">
                <h1 className="text-5xl font-extrabold text-primary mb-4">Календарь событий</h1>
                <p className="text-xl text-gray-600">Не пропустите важные мероприятия в вашем городе</p>
            </div>

            {/* Фильтры */}
            <div className="card mb-6">
                <div className="grid md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Тип события</label>
                        <CustomDropdown
                            options={[
                                { value: 'Все', label: 'Все типы' },
                                { value: 'Офлайн', label: 'Офлайн' },
                                { value: 'Онлайн', label: 'Онлайн' }
                            ]}
                            value={eventType}
                            onChange={setEventType}
                            placeholder="Тип события"
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
                                setSelectedCity(city)
                            }}
                            ariaLabel="Сбросить фильтры"
                        >
                            Сбросить
                        </Button>
                    </div>
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
                `}</style>
                <FullCalendar 
                    plugins={[dayGridPlugin]} 
                    initialView="dayGridMonth" 
                    locale={ruLocale}
                    events={eventsForCity}
                    dateClick={handleDateClick}
                    eventClick={(info) => {
                        navigate(`/events/${info.event.id}`)
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

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader />
                </div>
            ) : (
                <>
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
                                    const isRegistered = event.is_registered
                                    return (
                                        <div 
                                            key={event.id} 
                                            className="card border-l-4 border-accent cursor-pointer hover:shadow-modern transition-all"
                                            onClick={() => navigate(`/events/${event.id}`)}
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 text-center">
                                                    <h3 className="text-xl font-bold text-primary mb-2">{event.title}</h3>
                                                    <p className="text-gray-600 mb-3">{event.description}</p>
                                                    <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                                                        <span>📍 {event.ngo?.city || city}</span>
                                                        <span>👥 Организатор: {event.ngo?.name || 'НКО'}</span>
                                                    </div>
                                                </div>
                                                <Button 
                                                    variant={isRegistered ? "outline" : "outline-accent"}
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleAddToPlans(event.id)
                                                    }}
                                                    ariaLabel={isRegistered ? "Отменить регистрацию" : "Зарегистрироваться"}
                                                >
                                                    {isRegistered ? 'Отменить регистрацию' : 'Зарегистрироваться'}
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
                                {eventsForCity.map(eventData => {
                                    const event = events.find(e => e.id === eventData.id)
                                    if (!event) return null
                                    const isRegistered = event.is_registered
                                    return (
                                        <div 
                                            key={event.id} 
                                            className="card border-l-4 border-accent cursor-pointer hover:shadow-modern transition-all"
                                            onClick={() => navigate(`/events/${event.id}`)}
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 text-center">
                                                    <h3 className="text-lg font-bold text-primary mb-1">{event.title}</h3>
                                                    <p className="text-sm text-[#454545] mb-2">{event.description}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(event.event_date).toLocaleDateString('ru-RU', { 
                                                            day: 'numeric', 
                                                            month: 'long', 
                                                            year: 'numeric'
                                                        })} • {event.ngo?.city || city}
                                                    </p>
                                                </div>
                                                <Button 
                                                    variant={isRegistered ? "outline" : "outline-accent"}
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleAddToPlans(event.id)
                                                    }}
                                                    ariaLabel={isRegistered ? "Отменить регистрацию" : "Зарегистрироваться"}
                                                >
                                                    {isRegistered ? 'Отменить регистрацию' : 'Зарегистрироваться'}
                                                </Button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
