import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function EventItem({ event }){
    const navigate = useNavigate()
    
    return (
        <div 
            className="card border-l-4 border-accent cursor-pointer hover:shadow-modern transition-all"
            onClick={() => navigate(`/events/${event.id}`)}
        >
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <h4 className="font-semibold text-primary mb-1">{event.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>📅 {new Date(event.date).toLocaleDateString('ru-RU')}</span>
                        <span>📍 {event.city}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
