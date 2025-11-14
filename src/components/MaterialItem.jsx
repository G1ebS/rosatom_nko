import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Button from './Button'

export default function MaterialItem({ material }){
    const { user } = useAuth()
    const { showToast } = useToast()
    const [isSaved, setIsSaved] = useState(false)
    
    const handleSave = () => {
        if (!user) {
            showToast('Войдите, чтобы сохранить материал', 'warning')
            return
        }
        setIsSaved(!isSaved)
        showToast(
            isSaved ? 'Материал удален из библиотеки' : 'Материал сохранен в библиотеку',
            'success'
        )
    }
    const getTypeIcon = (type) => {
        switch(type) {
            case 'PDF':
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                )
            case 'Видео':
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                )
            case 'Ссылка':
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                )
            default:
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                )
        }
    }

    return (
        <div className="card group">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
                    {getTypeIcon(material.type)}
                </div>
                <div className="flex-1 min-w-0">
                    <h5 className="text-xl font-bold text-primary mb-3 group-hover:text-accent transition-colors">{material.title}</h5>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-modern bg-gradient-to-r from-accent-100 to-accent-200 text-accent-700">
                            {material.type}
                        </span>
                        <span className="text-xs text-gray-500">⭐ 4.8</span>
                        <span className="text-xs text-gray-500">{material.city || 'Общие'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        {material.type !== 'Видео' && (
                            <a 
                                href={material.link} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="text-accent hover:text-accent-hover text-sm font-semibold inline-flex items-center gap-2 group-hover:gap-4 transition-all"
                            >
                                Открыть
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </a>
                        )}
                        {material.type === 'Видео' && (
                            <span className="text-gray-400 text-sm">Видео материал</span>
                        )}
                        <button 
                            onClick={handleSave}
                            className={`min-w-[44px] min-h-[44px] p-2 transition-colors rounded-modern hover:bg-accent/10 ${
                                isSaved ? 'text-accent' : 'text-gray-400 hover:text-accent'
                            }`}
                            aria-label={isSaved ? "Удалить из библиотеки" : "Сохранить в библиотеку"}
                            title={isSaved ? "Удалить из библиотеки" : "Сохранить в библиотеку"}
                        >
                            <svg 
                                className="w-5 h-5" 
                                fill={isSaved ? "currentColor" : "none"} 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
