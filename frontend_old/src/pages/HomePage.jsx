import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { rosatomCities } from '../data/cities'

export default function HomePage(){
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setIsVisible(true)
    }, [])

    // Разделяем города на 4 колонки
    const citiesPerColumn = Math.ceil(rosatomCities.length / 4)
    const cityColumns = []
    for (let i = 0; i < 4; i++) {
        cityColumns.push(rosatomCities.slice(i * citiesPerColumn, (i + 1) * citiesPerColumn))
    }

    return (
        <div className="space-y-0 smooth-scroll">
            {/* Hero Section */}
            <section className="relative py-12 md:py-20 overflow-hidden bg-white">
                <div className="container-max relative z-10">
                    <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center max-w-7xl mx-auto">
                        {/* Левая часть - текст */}
                        <div className={`space-y-6 ${isVisible ? 'fade-in-up' : 'opacity-0'}`}>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight" style={{ color: '#1a2165' }}>
                                Добрые дела Росатома — все инициативы вашего города в одном месте
                            </h1>
                            
                            <p className="text-lg md:text-xl font-medium" style={{ color: '#3a3a39' }}>
                                Здесь вы сможете
                            </p>
                            
                            <ul className="space-y-3 text-base md:text-lg" style={{ color: '#3a3a39' }}>
                                <li className="flex items-start gap-3">
                                    <span style={{ color: '#1a2165' }} className="mt-1">•</span>
                                    <span>Узнать, какие НКО и волонтёрские проекты работают в вашем городе</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span style={{ color: '#1a2165' }} className="mt-1">•</span>
                                    <span>Посмотреть актуальные мероприятия и события</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span style={{ color: '#1a2165' }} className="mt-1">•</span>
                                    <span>Найти полезные ресурсы и обучающие материалы</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span style={{ color: '#1a2165' }} className="mt-1">•</span>
                                    <span>Получить контакты координаторов для участия или поддержки инициатив</span>
                                </li>
                            </ul>
                        </div>

                        {/* Правая часть - изображение с оверлеем */}
                        <div className="relative">
                            <div className="relative w-full h-[400px] md:h-[500px] bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg overflow-hidden">
                                {/* Placeholder для изображения */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <svg className="w-32 h-32 mx-auto text-primary/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-primary/50 text-sm">Изображение</p>
                                    </div>
                                </div>
                                
                                {/* Бейджи в правом верхнем углу */}
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center text-primary font-bold text-lg shadow-lg">
                                        29
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center text-primary font-bold text-lg shadow-lg">
                                        5
                                    </div>
                                </div>
                                
                                {/* Оверлей с текстом внизу */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gray-800/80 backdrop-blur-sm p-6">
                                    <p className="text-white text-sm md:text-base leading-relaxed">
                                        Единый портал для жителей, волонтёров и НКО, где собрана вся информация о социальных, экологических, культурных, образовательных и спортивных инициативах в городах присутствия Росатома.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Cards */}
            <section className="bg-white py-12 md:py-16">
                <div className="container-max">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { 
                                title: 'Карта', 
                                desc: 'Найдите организации по городу и направлению деятельности', 
                                link: '/ngos', 
                                iconColor: 'bg-yellow-400',
                                icon: (
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                )
                            },
                            { 
                                title: 'База знаний', 
                                desc: 'Просматривайте видео и материалы для скачивания', 
                                link: '/knowledge', 
                                iconColor: 'bg-orange-400',
                                icon: (
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                )
                            },
                            { 
                                title: 'Календарь', 
                                desc: 'Отметьте интересные события, чтобы ничего не пропустить', 
                                link: '/calendar', 
                                iconColor: 'bg-pink-400',
                                icon: (
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                )
                            },
                            { 
                                title: 'Новости', 
                                desc: 'Будьте в курсе последних инициатив и грантов', 
                                link: '/news', 
                                iconColor: 'bg-green-400',
                                icon: (
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                    </svg>
                                )
                            },
                        ].map((item, idx) => (
                            <Link 
                                key={idx}
                                to={item.link}
                                className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-full ${item.iconColor} flex items-center justify-center flex-shrink-0`}>
                                        {item.icon}
                                    </div>
                                    <svg className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold mb-2" style={{ color: '#1a2165' }}>
                                    {item.title}
                                </h3>
                                <p className="text-sm leading-relaxed" style={{ color: '#3a3a39' }}>
                                    {item.desc}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action Banner */}
            <section className="relative py-16 md:py-20 overflow-hidden" style={{
                background: 'linear-gradient(180deg, #4896d2 0%, #1a2165 100%)'
            }}>
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}></div>
                </div>
                <div className="container-max relative z-10">
                    <div className="text-center">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                            Станьте частью добрых дел в вашем городе!
                        </h2>
                    </div>
                </div>
            </section>

            {/* List of Cities */}
            <section className="bg-white py-16 md:py-20">
                <div className="container-max">
                    <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center" style={{ color: '#1a2165' }}>
                        Перечень городов присутствия ГК Росатом
                    </h2>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {cityColumns.map((column, colIdx) => (
                            <div key={colIdx} className="space-y-3">
                                {column.map((cityData, idx) => (
                                    <div key={idx} className="text-sm">
                                        <span className="font-bold" style={{ color: '#1a2165' }}>{cityData.city}</span>
                                        <span className="ml-2" style={{ color: '#6B7280' }}>{cityData.region}</span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
