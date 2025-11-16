import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function NewsItem({ item }){
    const location = useLocation()
    // inline fallback SVG (light gray background with "No image" text)
    const FALLBACK_SVG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%238b8b8b" font-size="24">No image</text></svg>'

    const resolveImage = (img) => {
        if (!img) return null
        // already absolute URL or data URI
        if (img.startsWith('http') || img.startsWith('data:')) return img
        // prefix with API URL if provided in env (useful when backend serves /media/)
        const base = process.env.REACT_APP_API_URL || ''
        if (img.startsWith('/')) return `${base}${img}`
        return `${base}/${img}`
    }
    
    return (
        <Link 
            to={`/news/${item.id}`}
            state={{ from: location.pathname }}
            className="block"
        >
            <article className="card group cursor-pointer hover:shadow-modern transition-all">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Изображение слева */}
                    <div className="w-full md:w-48 h-48 flex-shrink-0 bg-gradient-to-br from-primary-50 to-accent-50 rounded-modern overflow-hidden group-hover:scale-105 transition-transform duration-300">
                        {item.image ? (
                            (() => {
                                const src = resolveImage(item.image)
                                return (
                                    <img
                                        src={src}
                                        alt={item.title}
                                        className="object-cover w-full h-full"
                                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_SVG }}
                                    />
                                )
                            })()
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                </svg>
                            </div>
                        )}
                    </div>

                    {/* Текст справа */}
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-accent transition-colors">{item.title}</h3>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-2 py-1 text-xs font-semibold rounded-modern bg-accent/10 text-accent">Новость</span>
                        </div>
                        <p className="text-xs text-gray-500 font-light mb-3">
                            {new Date(item.date).toLocaleDateString('ru-RU', { 
                                day: 'numeric', 
                                month: 'long', 
                                year: 'numeric' 
                            })} • {item.city || 'Общие'}
                        </p>
                        <p className="text-sm text-[#454545] font-light mb-4 leading-relaxed">
                            {item.snippet}
                        </p>
                        <span className="text-accent hover:text-accent-hover text-sm font-medium inline-block">
                            Читать далее →
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    )
}
