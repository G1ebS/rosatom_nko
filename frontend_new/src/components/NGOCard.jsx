import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function NGOCard({ ngo }){
    const [isHovered, setIsHovered] = useState(false)

    return (
        <div 
            className="card group cursor-pointer relative overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Изображение/логотип */}
            <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50 rounded-modern overflow-hidden mb-4 relative">
                {ngo.logo ? (
                    <img 
                        src={ngo.logo} 
                        alt={ngo.name} 
                        className={`object-cover w-full h-full transition-transform duration-500 ${
                            isHovered ? 'scale-110' : 'scale-100'
                        }`} 
                    />
                ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-accent flex items-center justify-center shadow-modern">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                )}
                {/* Ярлык города */}
                <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-modern text-xs font-semibold text-primary shadow-modern">
                    {ngo.city}
                </div>
            </div>

            {/* Название и категория */}
            <div className="mb-3">
                <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-accent transition-colors">
                    {ngo.name}
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-block px-3 py-1 text-xs font-semibold rounded-modern bg-gradient-to-r from-accent-100 to-accent-200 text-accent-700">
                        {ngo.category?.name || ngo.category}
                    </span>
                </div>
            </div>

            {/* Описание */}
            <p className="text-sm text-gray-600 font-light mb-4 line-clamp-3 leading-relaxed">
                {ngo.short_description}
            </p>

            {/* Расширенная информация при наведении */}
            {isHovered && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/95 to-accent/95 backdrop-blur-sm rounded-modern p-6 flex flex-col justify-center items-center text-white fade-in-up">
                    <h3 className="text-2xl font-bold mb-2">{ngo.name}</h3>
                    <p className="text-sm mb-4 text-center">{ngo.short_description}</p>
                    <Link 
                        to={`/ngos/${ngo.id}`} 
                        className="btn-accent mt-4"
                    >
                        Подробнее
                    </Link>
                </div>
            )}

            {/* Кнопка */}
            {!isHovered && (
                <Link 
                    to={`/ngos/${ngo.id}`} 
                    className="text-accent hover:text-accent-hover text-sm font-semibold inline-flex items-center gap-2 group-hover:gap-4 transition-all"
                >
                    Подробнее
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </Link>
            )}
        </div>
    )
}
