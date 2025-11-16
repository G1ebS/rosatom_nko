import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { events } from '../data/events'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Button from '../components/Button'

export default function EventDetailsPage(){
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const { showToast } = useToast()
    const event = events.find(e => String(e.id) === id)
    const [isPlanned, setIsPlanned] = useState(false)

    if (!event) return (
        <div className="max-w-4xl mx-auto text-center py-12">
            <p className="text-gray-500 text-lg">Событие не найдено</p>
            <Button variant="primary" onClick={() => navigate('/calendar')} className="mt-4">
                Вернуться к календарю
            </Button>
        </div>
    )

    const handleAddToPlans = () => {
        if (!user) {
            showToast('Войдите, чтобы добавить событие в планы', 'warning')
            return
        }
        setIsPlanned(!isPlanned)
        showToast(
            isPlanned ? 'Событие удалено из планов' : 'Событие добавлено в ваши планы',
            'success'
        )
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Заголовок */}
            <div className="mb-8 text-center">
                <div className="mb-4">
                    <span className="inline-block px-4 py-1.5 text-sm font-semibold rounded-full bg-accent/10 text-accent mb-3">
                        {event.online ? 'Онлайн' : 'Офлайн'}
                    </span>
                </div>
                <h1 className="text-4xl font-bold text-primary mb-4">{event.title}</h1>
                <p className="text-lg text-[#454545]">{event.city}</p>
            </div>

            {/* Основная информация */}
            <div className="card mb-8">
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
                    </div>
                    <div className="text-center md:text-left">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Место проведения</h3>
                        <p className="text-lg font-bold text-primary">{event.location || event.city}</p>
                    </div>
                </div>
            </div>

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
                    onClick={() => navigate('/calendar')}
                    ariaLabel="Вернуться к календарю"
                >
                    Вернуться к календарю
                </Button>
            </div>
        </div>
    )
}

