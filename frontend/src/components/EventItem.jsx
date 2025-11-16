import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { eventCategoryColors } from '../data/events'

export default function EventItem({ event }){
    const navigate = useNavigate()
    const location = useLocation()
    const fromProfile = location.pathname === '/profile'
    
    const colors = eventCategoryColors[event.category] || {
        bg: '#00D4AA',
        border: '#00b894',
        text: '#ffffff'
    }
    
    return (
        <div 
            className="card cursor-pointer hover:shadow-modern transition-all relative overflow-hidden"
            style={{ borderLeft: `4px solid ${colors.border}` }}
            onClick={() => navigate(`/events/${event.id}`, { state: { from: fromProfile ? '/profile' : '/calendar' } })}
        >
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span 
                            className="px-2 py-1 rounded text-xs font-semibold"
                            style={{ 
                                backgroundColor: colors.bg,
                                color: colors.text
                            }}
                        >
                            {event.category || 'Событие'}
                        </span>
                        {event.time && (
                            <span className="text-sm text-gray-500">🕐 {event.time}</span>
                        )}
                        {event.online !== undefined && (
                            event.online ? (
                                <span className="text-xs text-accent">🌐 Онлайн</span>
                            ) : (
                                <span className="text-xs text-gray-500">🏢 Офлайн</span>
                            )
                        )}
                    </div>
                    <h4 className="font-semibold text-primary mb-1">{event.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>📅 {new Date(event.date).toLocaleDateString('ru-RU', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                        })}</span>
                        <span>📍 {event.city}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
