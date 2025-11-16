import React from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { news } from '../data/news'
import Button from '../components/Button'
import MarkdownContent from '../components/MarkdownContent'

export default function NewsDetailsPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    
    const newsItem = news.find(n => n.id === parseInt(id))
    
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
                            {new Date(newsItem.date).toLocaleDateString('ru-RU', { 
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
                        {newsItem.fullText && (
                            <div className="prose prose-lg max-w-none">
                                <MarkdownContent content={newsItem.fullText} />
                            </div>
                        )}
                    </div>
                )}
                
                {newsItem.image && (
                    <div className="mt-6 rounded-modern overflow-hidden">
                        <img 
                            src={newsItem.image} 
                            alt={newsItem.title}
                            className="w-full h-auto object-cover"
                        />
                    </div>
                )}
            </article>
        </div>
    )
}

