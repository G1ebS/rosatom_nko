import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ngos } from '../data/ngos'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Button from '../components/Button'

export default function NGODetailsPage(){
    const { id } = useParams()
    const ngo = ngos.find(n => String(n.id) === id)
    const { user, login } = useAuth()
    const { showToast } = useToast()
    const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
    const [submitting, setSubmitting] = useState(false)

    if (!ngo) return (
        <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Организация не найдена</p>
        </div>
    )

    const toggleFavorite = () => {
        if (!user) {
            showToast('Войдите, чтобы добавить в избранное', 'warning')
            return
        }
        const isFavorite = user.favorites?.includes(ngo.id)
        const updatedFavorites = isFavorite
            ? (user.favorites || []).filter(id => id !== ngo.id)
            : Array.from(new Set([...(user.favorites||[]), ngo.id]))
        const updated = { ...user, favorites: updatedFavorites }
        login(localStorage.getItem('jwt') || 'fake', updated)
        showToast(
            isFavorite ? 'Удалено из избранного' : 'Добавлено в избранное',
            'success'
        )
    }

    const handleContactSubmit = async (e) => {
        e.preventDefault()
        if (!contactForm.name || !contactForm.email || !contactForm.message) {
            showToast('Заполните все поля', 'warning')
            return
        }
        setSubmitting(true)
        try {
            // В реальном приложении здесь будет API запрос
            await new Promise(resolve => setTimeout(resolve, 1000))
            showToast('Сообщение успешно отправлено!', 'success')
            setContactForm({ name: '', email: '', message: '' })
        } catch (error) {
            showToast('Ошибка отправки сообщения', 'error')
        } finally {
            setSubmitting(false)
        }
    }

    // Соцсети из данных НКО
    const socialLinks = {
        website: ngo.website || null,
        vk: ngo.vk || null,
        telegram: ngo.telegram || null
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Заголовок и категория */}
            <div className="mb-8">
                <div className="mb-4">
                    <span className="inline-block px-4 py-1.5 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800 mb-3">
                        {ngo.category}
                    </span>
                </div>
                <h1 className="text-4xl font-bold text-primary mb-4">{ngo.name}</h1>
                <p className="text-lg text-[#454545]">{ngo.city}</p>
            </div>

            {/* Логотип/изображение */}
            {ngo.logo && (
                <div className="mb-8">
                    <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                        <img src={ngo.logo} alt={ngo.name} className="object-cover w-full h-full" />
                    </div>
                </div>
            )}

            {/* Описание */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-primary mb-4">О организации</h2>
                <div className="prose max-w-none">
                    <p className="text-[#454545] text-base leading-relaxed mb-4 whitespace-pre-line">
                        {ngo.full_description}
                    </p>
                </div>
            </div>

            {/* Галерея фотографий */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-primary mb-4">Галерея</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="aspect-square bg-gradient-to-br from-primary-100 to-accent-100 rounded-modern overflow-hidden cursor-pointer group">
                            <div className="w-full h-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-12 h-12 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Проекты и цели */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="card">
                    <h3 className="text-xl font-bold text-primary mb-4">Проекты</h3>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                            <div>
                                <div className="font-semibold text-gray-800">Экологический субботник</div>
                                <div className="text-sm text-gray-600">Регулярные акции по очистке территории</div>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                            <div>
                                <div className="font-semibold text-gray-800">Образовательные программы</div>
                                <div className="text-sm text-gray-600">Мастер-классы для детей и взрослых</div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="card">
                    <h3 className="text-xl font-bold text-primary mb-4">Цели</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Наша миссия — создание устойчивого сообщества, которое заботится об окружающей среде 
                        и поддерживает социальные инициативы. Мы стремимся объединить людей для достижения 
                        общих целей и создания позитивных изменений.
                    </p>
                </div>
            </div>

            {/* Возможности участия */}
            <div className="card mb-8">
                <h3 className="text-xl font-bold text-primary mb-4">Как принять участие</h3>
                <div className="grid md:grid-cols-3 gap-4">
                    {['Волонтёрство', 'Пожертвования', 'Партнёрство'].map((type, idx) => (
                        <div key={idx} className="p-4 bg-gradient-soft rounded-modern">
                            <div className="text-2xl mb-2">💚</div>
                            <div className="font-semibold text-primary mb-1">{type}</div>
                            <div className="text-sm text-gray-600">Узнайте больше о возможностях участия</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Контактная информация и форма */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="card">
                    <h3 className="text-xl font-bold text-primary mb-4">Контактная информация</h3>
                    <div className="space-y-4">
                        {ngo.address && (
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-modern bg-accent/10 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-gray-700 mb-1">Адрес</div>
                                    <div className="text-gray-600">{ngo.address}</div>
                                </div>
                            </div>
                        )}
                        
                        {(socialLinks.vk || socialLinks.telegram || socialLinks.website) && (
                            <div>
                                <div className="text-sm font-semibold text-gray-700 mb-3">Социальные сети</div>
                                <div className="flex flex-wrap gap-3">
                                    {socialLinks.vk && (
                                        <a href={socialLinks.vk} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-modern text-primary hover:bg-primary hover:text-white transition-all">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12.785 16.241s.336-.039.508-.23c.158-.179.154-.515.154-.515s-.023-1.566.688-1.797c.701-.223 1.603.1 2.508.723.645.45 1.13.7 1.27.774.183.096.313.075.313.075l2.526-.037s1.322-.084.695-1.123c-.051-.083-.365-.75-1.88-2.123-1.59-1.41-1.376-1.18.538-3.616.369-.47.66-1.01.66-1.01s.149-.358-.14-.551c-.288-.19-.68-.2-.68-.2h-2.05s-.456.006-.745.22c-.288.214-.47.7-.47.7s-.844 2.02-1.966 3.33c-.238.27-.406.356-.56.356-.146 0-.27-.11-.27-.43V7.5s0-.5-.14-.68c-.14-.18-.4-.23-.4-.23h-2.78s-.42.013-.57.19c-.15.18-.11.55-.11.55s.44 2.6 1.03 4.35c.47 1.39.66 1.67.73 1.88.1.3.08.48-.09.48-.26 0-.74-.09-1.41-.26-.99-.33-1.74-.7-1.96-.74-.44-.09-.38-.4-.38-.61 0-.35.05-.51.23-.69.23-.23.5-.45.67-.75.23-.38.32-.61.32-.61s.05-.24-.15-.39c-.2-.15-.47-.16-.47-.16h-1.01s-.75.02-.99.34c-.24.32-.18.84-.18.84s.9 4.28 1.92 5.88c.93 1.45 1.39 1.36 1.39 1.36h.33s.25.02.42-.12c.16-.13.15-.38.15-.38s-.08-2.5.34-2.87c.35-.3.8-.07 1.8.55 1.25.75 2.19 1.22 2.45 1.61.19.29.13.44.13.44s-.05.3-.4.35c-.35.05-.84-.11-1.89-.37-1.5-.41-2.63-.85-2.96-1.12-.23-.19-.17-.23-.17-.46 0-.24.25-.5.5-.67.5-.35 1.35-.7 1.35-.7s.25-.15.15-.45c-.1-.3-.45-.35-.6-.38-.15-.02-1.16-.07-1.66-.07-.5 0-.65.03-.85.15-.2.12-.35.4-.35.4s-.03.08-.08.18c-.05.1-.17.15-.17.15h-.33s-.5-.02-.68-.23c-.05-.07-.08-.15-.08-.15s.05-.3.23-.45c.35-.3.99-.6 1.99-1.05 1.5-.56 3.35-1.29 4.75-2.06 2.1-1.17 1.88-1.5 1.88-1.5s-.13-.3.1-.45c.22-.15.5-.15.75-.15h2.05s.5-.02.68.15c.17.18.13.4.13.55-.02 1.5-.02 2.3.02 2.3s.05.25.18.38c.13.13.3.17.3.17h.5s.3.02.4.1c.1.08.07.25.07.25l-.02 1.5s-.05.7.15.83c.2.13.45.13.68.1.23-.03 1.15-.13 1.9-.85 1.2-1.15 2.1-2.9 2.1-2.9s.12-.25.3-.3c.18-.05.4 0 .4 0h2.4s1.2-.08.63.95c-.05.09-.4.75-1.88 1.77-1.43 1.01-1.67 1.51.41 2.45 1.29.74 1.85 1.21 2.1 1.85.2.52-.15.78-.15.78l-2.13.13z"/>
                                            </svg>
                                            <span className="text-sm font-semibold">ВКонтакте</span>
                                        </a>
                                    )}
                                    {socialLinks.telegram && (
                                        <a href={socialLinks.telegram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-modern text-primary hover:bg-primary hover:text-white transition-all">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.169 1.858-.896 6.728-.896 6.728-.896 6.728-1.268 7.936-1.268 7.936s-.169.338-.507.338c-.338 0-.676-.169-.676-.169l-2.365-1.352-1.183-.845-.845-.507s-.338-.169-.338-.507c0-.338.169-.507.169-.507l8.445-5.067c.338-.169.507-.169.507.169s.169.169 0 .338l-3.214 3.214-1.352.845-1.858 1.183s-.169.169-.338 0c-.169-.169-.169-.338-.169-.338l1.183-4.732 6.728-6.728s.169-.169.338-.169c.169 0 .338.169.169.338z"/>
                                            </svg>
                                            <span className="text-sm font-semibold">Telegram</span>
                                        </a>
                                    )}
                                    {socialLinks.website && (
                                        <a href={socialLinks.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-modern text-primary hover:bg-primary hover:text-white transition-all">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                            </svg>
                                            <span className="text-sm font-semibold">Сайт</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Форма быстрого контакта */}
                <div className="card">
                    <h3 className="text-xl font-bold text-primary mb-4">Связаться с нами</h3>
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="contact-name" className="block text-sm font-semibold text-gray-700 mb-2">Ваше имя</label>
                            <input 
                                id="contact-name"
                                type="text" 
                                value={contactForm.name}
                                onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                                className="w-full border-2 border-gray-200 rounded-modern px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                                placeholder="Иван Иванов"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="contact-email" className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                            <input 
                                id="contact-email"
                                type="email" 
                                value={contactForm.email}
                                onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                                className="w-full border-2 border-gray-200 rounded-modern px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                                placeholder="ivan@example.com"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="contact-message" className="block text-sm font-semibold text-gray-700 mb-2">Сообщение</label>
                            <textarea 
                                id="contact-message"
                                rows="4"
                                value={contactForm.message}
                                onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                                className="w-full border-2 border-gray-200 rounded-modern px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                                placeholder="Ваше сообщение..."
                                required
                            ></textarea>
                        </div>
                        <Button 
                            type="submit" 
                            variant="primary" 
                            fullWidth
                            loading={submitting}
                            disabled={submitting}
                            ariaLabel="Отправить сообщение"
                        >
                            Отправить сообщение
                        </Button>
                    </form>
                </div>
            </div>

            {/* Действия */}
            <div className="flex flex-wrap gap-3">
                <Button
                    variant={user && user.favorites?.includes(ngo.id) ? 'outline' : 'outline-accent'}
                    onClick={toggleFavorite}
                    icon={
                        user && user.favorites?.includes(ngo.id) ? (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        )
                    }
                    ariaLabel={user && user.favorites?.includes(ngo.id) ? 'Удалить из избранного' : 'Добавить в избранное'}
                >
                    {user && user.favorites?.includes(ngo.id) ? 'В избранном' : 'В избранное'}
                </Button>
                {ngo.website && (
                    <Button
                        variant="primary"
                        href={ngo.website}
                        target="_blank"
                        rel="noreferrer"
                        ariaLabel="Перейти на сайт НКО"
                    >
                        Перейти на сайт
                    </Button>
                )}
            </div>
        </div>
    )
}
