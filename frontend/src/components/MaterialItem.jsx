import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { materialAPI } from '../utils/api'
import Button from './Button'

export default function MaterialItem({ material, onRemove }){
    const { user } = useAuth()
    const { showToast } = useToast()
    const [isSaved, setIsSaved] = useState(false)
    const [loading, setLoading] = useState(false)
    
    // Проверяем, сохранен ли материал при загрузке
    useEffect(() => {
        if (user && material.id) {
            // Проверяем через API, сохранен ли материал
            // Это можно сделать через проверку библиотеки или добавить поле is_saved в material
            setIsSaved(material.is_saved);
        }
    }, [user, material])
    
    const handleSave = async () => {
        if (!user) {
            showToast('Войдите, чтобы сохранить материал', 'warning')
            return
        }
        
        if (!material.id) {
            showToast('Ошибка: материал не найден', 'error')
            return
        }
        
        setLoading(true)
        try {
            if (isSaved) {
                await materialAPI.unsave(material.id)
                setIsSaved(false)
                showToast('Материал удален из библиотеки', 'success')
                // Вызываем callback для обновления библиотеки в родительском компоненте
                if (onRemove) {
                    onRemove(material.id)
                }
            } else {
                await materialAPI.save(material.id)
                setIsSaved(true)
                showToast('Материал сохранен в библиотеку', 'success')
            }
        } catch (error) {
            console.error('Failed to toggle save:', error)
            showToast('Ошибка при сохранении материала', 'error')
        } finally {
            setLoading(false)
        }
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
                    {getTypeIcon(material.type || 'default')}
                </div>
                <div className="flex-1 min-w-0">
                    <Link to={`/materials/${material.id}`}>
                        <h5 className="text-xl font-bold text-primary mb-3 group-hover:text-accent transition-colors cursor-pointer">
                            {material.title}
                        </h5>
                    </Link>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-modern bg-gradient-to-r from-accent-100 to-accent-200 text-accent-700">
                            {material.course || 'Материал'}
                        </span>
                        {material.views_count !== undefined && (
                            <span className="text-xs text-gray-500">👁 {material.views_count}</span>
                        )}
                        {material.author && (
                            <span className="text-xs text-gray-500">👤 {material.author}</span>
                        )}
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link 
                                to={`/materials/${material.id}`}
                                className="text-accent hover:text-accent-hover text-sm font-semibold inline-flex items-center gap-2 group-hover:gap-4 transition-all"
                            >
                                Подробнее
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                            {material.url && (
                                <a 
                                    href={material.url} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-gray-600 hover:text-accent text-sm inline-flex items-center gap-1"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            )}
                        </div>
                        <button 
                            onClick={handleSave}
                            disabled={loading}
                            className={`min-w-[44px] min-h-[44px] p-2 transition-colors rounded-modern hover:bg-accent/10 disabled:opacity-50 disabled:cursor-not-allowed ${
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
