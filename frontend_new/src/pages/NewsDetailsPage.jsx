import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import Button from '../components/Button'
import MarkdownContent from '../components/MarkdownContent'
import { api } from '../utils/api'
import Loader from '../components/Loader'

export default function NewsDetailsPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const [newsItem, setNewsItem] = useState(null)
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        const loadNews = async () => {
            setLoading(true)
            try {
                const data = await api.get(`/news/${id}/`)
                setNewsItem(data)
            } catch (error) {
                console.error('Failed to load news:', error)
                setNewsItem(null)
            } finally {
                setLoading(false)
            }
        }
        loadNews()
    }, [id])
    
    if (loading) {
        return (
            <div className="flex justify-center py-16">
                <Loader />
            </div>
        )
    }
    
    if (!newsItem) {
        return (
            <div className="container-max text-center py-12">
                <h1 className="text-2xl font-bold text-primary mb-4">Новость не найдена</h1>
                <Button variant="outline" onClick={() => navigate('/news')}>
                    Вернуться к новостям
                </Button>
            </div>
        )
    }
    
    const backPath = location.state?.from || '/news'
    const backLabel = location.state?.from === '/profile' ? 'Вернуться в профиль' : 'Вернуться к новостям'
    const FALLBACK_SVG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="400"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%238b8b8b" font-size="32">No image</text></svg>'

    const resolveImage = (img) => {
        if (!img) return null
        if (img.startsWith('http') || img.startsWith('data:')) return img
        const base = process.env.REACT_APP_API_URL || ''
        if (img.startsWith('/')) return `${base}${img}`
        return `${base}/${img}`
    }
    
    return (
        <div className="container-max max-w-4xl mx-auto">
            <div className="mb-6">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(backPath)}
                    icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    }
                    iconPosition="left"
                    ariaLabel={backLabel}
                >
                    {backLabel}
                </Button>
            </div>
            
            <article className="card">
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 text-xs font-semibold rounded-modern bg-accent/10 text-accent">
                            Новость
                        </span>
                        <span className="text-sm text-gray-500">
                            {new Date(newsItem.published_at || newsItem.created_at || newsItem.date).toLocaleDateString('ru-RU', { 
                                day: 'numeric', 
                                month: 'long', 
                                year: 'numeric' 
                            })}
                        </span>
                        {newsItem.city && (
                            <span className="text-sm text-gray-500">
                                • {newsItem.city === 'Все' ? 'Все города' : newsItem.city}
                            </span>
                        )}
                    </div>
                    
                    <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                        {newsItem.title}
                    </h1>
                    
                    {newsItem.snippet && (
                        <p className="text-lg text-gray-600 leading-relaxed mb-6">
                            {newsItem.snippet}
                        </p>
                    )}
                </div>
                
                {newsItem.content ? (
                    <div className="prose prose-lg max-w-none">
                        <MarkdownContent content={newsItem.content} />
                    </div>
                ) : (
                    <div className="text-gray-700 leading-relaxed">
                        {newsItem.snippet && (
                            <p className="text-base mb-4">{newsItem.snippet}</p>
                        )}
                        {newsItem.full_text && (
                            <div className="prose prose-lg max-w-none">
                                <MarkdownContent content={newsItem.full_text} />
                            </div>
                        )}
                    </div>
                )}
                
                {newsItem.image && (
                    <div className="mt-6 rounded-modern overflow-hidden">
                        {(() => {
                            const src = resolveImage(newsItem.image)
                            return (
                                <img
                                    src={src}
                                    alt={newsItem.title}
                                    className="w-full h-auto object-cover"
                                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_SVG }}
                                />
                            )
                        })()}
                    </div>
                )}
            </article>
        </div>
    )
}

