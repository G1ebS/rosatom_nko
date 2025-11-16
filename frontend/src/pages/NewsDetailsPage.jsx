import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { newsAPI } from '../utils/api'
import { useToast } from '../context/ToastContext'
import Loader from '../components/Loader'

export default function NewsDetailsPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { showToast } = useToast()
    const [news, setNews] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadNews()
    }, [id])

    const loadNews = async () => {
        try {
            setLoading(true)
            const data = await newsAPI.getById(id)
            setNews(data)
        } catch (error) {
            console.error('Failed to load news:', error)
            showToast('Ошибка при загрузке новости', 'error')
            navigate('/news')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader />
            </div>
        )
    }

    if (!news) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Новость не найдена</p>
                <Link to="/news" className="text-accent hover:text-accent-hover mt-4 inline-block">
                    Вернуться к новостям
                </Link>
            </div>
        )
    }

    const imageUrl = news.image 
        ? (news.image.startsWith('http') ? news.image : `http://localhost:8000${news.image}`)
        : null

    return (
        <div className="max-w-4xl mx-auto">
            {/* Кнопка назад */}
            <Link 
                to="/news" 
                className="inline-flex items-center gap-2 text-gray-600 hover:text-accent mb-6 transition-colors"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Назад к новостям
            </Link>

            <div className="card">
                {/* Заголовок */}
                <div className="mb-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">{news.title}</h1>
                    
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                        {news.category && (
                            <span className="inline-block px-3 py-1 text-sm font-semibold rounded-modern bg-gradient-to-r from-accent-100 to-accent-200 text-accent-700">
                                {news.category}
                            </span>
                        )}
                        {news.city && (
                            <span className="text-sm text-gray-600">
                                📍 {news.city}
                            </span>
                        )}
                        {news.author_name && (
                            <span className="text-sm text-gray-600">
                                <span className="font-semibold">Автор:</span> {news.author_name}
                            </span>
                        )}
                        {news.views_count !== undefined && (
                            <span className="text-sm text-gray-600">
                                👁 {news.views_count} просмотров
                            </span>
                        )}
                    </div>

                    {/* Дата публикации */}
                    {(news.published_at || news.created_at) && (
                        <p className="text-sm text-gray-500">
                            {new Date(news.published_at || news.created_at).toLocaleDateString('ru-RU', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                    )}
                </div>

                {/* Изображение */}
                {imageUrl && (
                    <div className="mb-6">
                        <div className="w-full h-96 bg-gray-100 rounded-modern overflow-hidden">
                            <img 
                                src={imageUrl}
                                alt={news.title}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    </div>
                )}

                {/* Краткое описание (snippet) */}
                {news.snippet && (
                    <div className="mb-6 p-4 bg-accent/10 rounded-modern border-l-4 border-accent">
                        <p className="text-lg text-gray-700 font-medium leading-relaxed">
                            {news.snippet}
                        </p>
                    </div>
                )}

                {/* Основной текст новости */}
                <div className="mb-6">
                    <div className="prose max-w-none">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
                            {news.content}
                        </p>
                    </div>
                </div>

                {/* Метаинформация */}
                <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
                    {news.created_at && (
                        <p>Создано: {new Date(news.created_at).toLocaleDateString('ru-RU', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</p>
                    )}
                    {news.updated_at && news.updated_at !== news.created_at && (
                        <p className="mt-1">Обновлено: {new Date(news.updated_at).toLocaleDateString('ru-RU', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</p>
                    )}
                </div>
            </div>
        </div>
    )
}

