import React from 'react'
import { Link } from 'react-router-dom'

export default function NewsItem({ item }){
    return (
        <article className="card group">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Изображение слева */}
                <div className="w-full md:w-48 h-48 flex-shrink-0 bg-gradient-to-br from-primary-50 to-accent-50 rounded-modern overflow-hidden group-hover:scale-105 transition-transform duration-300">
                    {item.image ? (
                        <img src={item.image} alt={item.title} className="object-cover w-full h-full" />
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
                    {item.link && (
                        <Link 
                            to={item.link} 
                            className="text-accent hover:text-accent-hover text-sm font-medium inline-block"
                        >
                            Читать далее →
                        </Link>
                    )}
                </div>
            </div>
        </article>
    )
}
