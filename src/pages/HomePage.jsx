import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCity } from '../context/CityContext'
import AIRecommendations from '../components/AIRecommendations'
import Button from '../components/Button'

export default function HomePage(){
    const { city } = useCity()
    const [isVisible, setIsVisible] = useState(false)
    const heroRef = useRef(null)

    useEffect(() => {
        setIsVisible(true)
    }, [])

    return (
        <div className="space-y-20 smooth-scroll">
            {/* Hero Section с анимацией */}
            <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-gradient-to-br from-white via-primary-50/30 to-accent-50/20">
                <div className="container-max relative z-10 py-20">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Левая часть - текст */}
                        <div className={`space-y-8 ${isVisible ? 'fade-in-up' : 'opacity-0'}`}>
                            <div className="space-y-4">
                                <div className="inline-block px-4 py-2 rounded-modern bg-accent/10 text-accent text-sm font-semibold">
                                    Платформа для добрых дел
                                </div>
                                <h1 className="text-5xl md:text-7xl font-extrabold text-primary leading-tight">
                                    Добрые дела
                                    <span className="block text-accent">Росатома</span>
                                </h1>
                                <p className="text-xl text-gray-600 font-light leading-relaxed max-w-2xl">
                                    Объединяем городские НКО, волонтёров и социальные инициативы. 
                                    Создаём сообщество, которое меняет жизнь к лучшему.
                                </p>
                            </div>
                            
                            <div className="flex flex-wrap gap-4">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    href="/ngos"
                                    icon={
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    }
                                    iconPosition="right"
                                    ariaLabel="Найти НКО"
                                >
                                    Найти НКО
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    href="/calendar"
                                    ariaLabel="Открыть календарь событий"
                                >
                                    Календарь событий
                                </Button>
                            </div>

                            {/* Статистика */}
                            <div className="grid grid-cols-3 gap-6 pt-8">
                                <div>
                                    <div className="text-3xl font-bold text-primary">150+</div>
                                    <div className="text-sm text-gray-600">НКО</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-accent">5000+</div>
                                    <div className="text-sm text-gray-600">Волонтёров</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-primary">200+</div>
                                    <div className="text-sm text-gray-600">Событий</div>
                                </div>
                            </div>
                        </div>

                        {/* Правая часть - анимированный элемент */}
                        <div className="relative hidden md:block">
                            <div className="card-floating relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-modern-lg blur-3xl"></div>
                                <div className="relative z-10 p-8">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4 p-4 bg-white/80 rounded-modern shadow-modern">
                                            <div className="w-12 h-12 rounded-full bg-gradient-accent flex items-center justify-center">
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="font-bold text-primary">Сообщество</div>
                                                <div className="text-sm text-gray-600">Активные волонтёры</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 p-4 bg-white/80 rounded-modern shadow-modern">
                                            <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="font-bold text-primary">Достижения</div>
                                                <div className="text-sm text-gray-600">Ваш вклад</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Декоративные элементы */}
                <div className="absolute top-20 right-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
            </section>

            {/* Быстрые карточки-ссылки */}
            <section className="container-max">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-primary mb-4">Возможности платформы</h2>
                    <p className="text-lg text-gray-600">Всё необходимое для участия в добрых делах</p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { title: 'НКО вашего города', desc: 'Найдите организации рядом с вами', icon: '📍', link: '/ngos', color: 'primary' },
                        { title: 'Календарь событий', desc: 'Не пропустите важные мероприятия', icon: '📅', link: '/calendar', color: 'accent' },
                        { title: 'База знаний', desc: 'Обучайтесь и развивайтесь', icon: '📚', link: '/knowledge', color: 'primary' },
                        { title: 'Новости', desc: 'Следите за последними событиями', icon: '📰', link: '/news', color: 'accent' },
                    ].map((item, idx) => (
                        <Link 
                            key={idx}
                            to={item.link}
                            className="card group cursor-pointer"
                            style={{ animationDelay: `${idx * 0.1}s` }}
                        >
                            <div className={`w-16 h-16 rounded-modern bg-gradient-to-br ${
                                item.color === 'primary' ? 'from-primary to-primary-600' : 'from-accent to-accent-600'
                            } flex items-center justify-center mb-4 text-3xl group-hover:scale-110 transition-transform duration-300`}>
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-accent transition-colors">
                                {item.title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {item.desc}
                            </p>
                            <div className="mt-4 text-accent font-semibold flex items-center gap-2 group-hover:gap-4 transition-all">
                                Перейти
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* AI-рекомендации */}
            <section className="bg-gradient-soft py-20">
                <div className="container-max">
                    <div className="text-center mb-12">
                        <div className="inline-block px-4 py-2 rounded-modern bg-accent/10 text-accent text-sm font-semibold mb-4">
                            Умный подбор
                        </div>
                        <h2 className="text-4xl font-bold text-primary mb-4">
                            Персональные рекомендации
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Наша AI-система анализирует ваши интересы и подбирает НКО и события, 
                            которые точно вам подойдут. Используется бесплатная нейросеть Hugging Face.
                        </p>
                    </div>
                    <AIRecommendations />
                </div>
            </section>

            {/* Интерактивная карта (визуализация) */}
            <section className="container-max py-20">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-primary mb-4">НКО на карте России</h2>
                    <p className="text-lg text-gray-600">Найдите организации в вашем регионе</p>
                </div>
                <div className="card relative overflow-hidden" style={{ minHeight: '500px' }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center">
                        <div className="text-center">
                            <svg className="w-32 h-32 mx-auto text-primary/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            <p className="text-gray-600 text-lg">Интерактивная карта</p>
                            <p className="text-gray-500 text-sm mt-2">Нажмите на точки для просмотра НКО</p>
                        </div>
                    </div>
                    {/* Здесь будет встроена карта (Yandex Maps, Google Maps и т.д.) */}
                </div>
            </section>

            {/* Геймификация (визуализация) */}
            <section className="bg-gradient-soft py-20">
                <div className="container-max">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-primary mb-4">Ваш социальный след</h2>
                        <p className="text-lg text-gray-600">Отслеживайте свой вклад и получайте достижения</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { title: 'Часы помощи', value: '120', icon: '⏱️', color: 'primary' },
                            { title: 'Мероприятия', value: '15', icon: '🎯', color: 'accent' },
                            { title: 'Собранные средства', value: '50 000₽', icon: '💰', color: 'primary' },
                        ].map((stat, idx) => (
                            <div key={idx} className="card text-center">
                                <div className="text-5xl mb-4">{stat.icon}</div>
                                <div className={`text-4xl font-bold mb-2 ${
                                    stat.color === 'primary' ? 'text-primary' : 'text-accent'
                                }`}>
                                    {stat.value}
                                </div>
                                <div className="text-gray-600">{stat.title}</div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-12 card">
                        <h3 className="text-2xl font-bold text-primary mb-6 text-center">Достижения</h3>
                        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                            {Array.from({ length: 8 }).map((_, idx) => (
                                <div key={idx} className="text-center">
                                    <div className="w-16 h-16 mx-auto rounded-modern bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center mb-2">
                                        <span className="text-2xl">🏆</span>
                                    </div>
                                    <div className="text-xs text-gray-600">Бейдж {idx + 1}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
