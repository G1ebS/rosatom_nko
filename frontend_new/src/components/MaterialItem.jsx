import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useLocation } from 'react-router-dom'

export default function MaterialItem({ material }){
    const { user } = useAuth()
    const { showToast } = useToast()
    const location = useLocation()
    const [isSaved, setIsSaved] = useState(false)
    
    const handleSave = (e) => {
        e.preventDefault()
        e.stopPropagation()
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
        <Link 
            to={`/materials/${material.id}`}
            state={{ from: location.pathname }}
            className="card group block hover:shadow-lg transition-all"
        >
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                    {getTypeIcon(material.type)}
                </div>
                <div className="flex-1 min-w-0">
                    <h5 className="text-xl font-bold text-primary mb-3 group-hover:text-accent transition-colors">{material.title}</h5>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-modern bg-gradient-to-r from-accent-100 to-accent-200 text-accent-700">
                            {material.type}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            4.8
                        </span>
                        <span className="text-xs text-gray-500">{material.city || 'Общие'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-accent hover:text-accent-hover text-sm font-semibold inline-flex items-center gap-2 group-hover:gap-4 transition-all">
                            Открыть
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </span>
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
        </Link>
    )
}
