import React, { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { materials } from '../data/materials'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Button from '../components/Button'
import MarkdownContent from '../components/MarkdownContent'

export default function MaterialDetailsPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const { user } = useAuth()
    const { showToast } = useToast()
    const [isSaved, setIsSaved] = useState(false)

    const material = materials.find(m => m.id === parseInt(id))

    if (!material) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="card text-center py-12">
                    <h2 className="text-2xl font-bold text-primary mb-4">Материал не найден</h2>
                    <Button onClick={() => navigate('/knowledge')} variant="accent">
                        Вернуться к базе знаний
                    </Button>
                </div>
            </div>
        )
    }

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
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                )
            case 'Видео':
                return (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                )
            case 'Ссылка':
                return (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                )
            default:
                return (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                )
        }
    }

    const backPath = location.state?.from || '/knowledge'
    const backLabel = location.state?.from ? 'Назад' : 'К базе знаний'

    return (
        <div className="max-w-4xl mx-auto">
            {/* Кнопка назад */}
            <div className="mb-6">
                <Button 
                    onClick={() => navigate(backPath)}
                    variant="outline"
                    icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    }
                >
                    {backLabel}
                </Button>
            </div>

            {/* Заголовок материала */}
            <div className="card mb-6">
                <div className="flex items-start gap-6">
                    <div className="w-16 h-16 rounded-lg bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
                        {getTypeIcon(material.type)}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-primary mb-4">{material.title}</h1>
                        <div className="flex items-center gap-4 flex-wrap">
                            <span className="inline-block px-4 py-2 text-sm font-semibold rounded-modern bg-gradient-to-r from-accent-100 to-accent-200 text-accent-700">
                                {material.type}
                            </span>
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                4.8
                            </span>
                            <span className="text-sm text-gray-500">{material.city || 'Общие'}</span>
                        </div>
                    </div>
                    <button 
                        onClick={handleSave}
                        className={`min-w-[44px] min-h-[44px] p-2 transition-colors rounded-modern hover:bg-accent/10 ${
                            isSaved ? 'text-accent' : 'text-gray-400 hover:text-accent'
                        }`}
                        aria-label={isSaved ? "Удалить из библиотеки" : "Сохранить в библиотеку"}
                        title={isSaved ? "Удалить из библиотеки" : "Сохранить в библиотеку"}
                    >
                        <svg 
                            className="w-6 h-6" 
                            fill={isSaved ? "currentColor" : "none"} 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Контент материала */}
            <div className="card">
                {material.type === 'Видео' ? (
                    <div className="space-y-6">
                        <div className="aspect-video bg-gray-100 rounded-modern overflow-hidden">
                            {material.link ? (
                                <iframe
                                    src={material.link.replace('watch?v=', 'embed/').split('&')[0]}
                                    title={material.title}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <div className="text-center">
                                        <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        <p>Видео материал</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        {material.content && (
                            <MarkdownContent content={material.content} />
                        )}
                    </div>
                ) : material.type === 'PDF' ? (
                    <div className="space-y-6">
                        <div className="bg-gray-50 rounded-modern p-8 text-center">
                            <svg className="w-20 h-20 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <p className="text-gray-600 mb-4">PDF документ</p>
                            {material.link && (
                                <Button
                                    href={material.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    variant="accent"
                                    icon={
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    }
                                >
                                    Скачать PDF
                                </Button>
                            )}
                        </div>
                        {material.content && (
                            <MarkdownContent content={material.content} />
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {material.content ? (
                            <div className="prose max-w-none">
                                <div className="text-gray-700 whitespace-pre-line">{material.content}</div>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                <p>Контент материала</p>
                            </div>
                        )}
                        {material.link && (
                            <div className="pt-6 border-t border-gray-200">
                                <Button
                                    href={material.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    variant="accent"
                                    icon={
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    }
                                >
                                    Открыть ссылку
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

