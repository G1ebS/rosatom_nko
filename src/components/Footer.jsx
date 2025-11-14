import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer(){
    return (
        <footer className="gradient-primary mt-20">
            <div className="container-max py-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Логотип и дескриптор */}
                    {/* ВАЖНО: Для продакшена необходимо заменить на официальный логотип Росатом из брендбука (белый вариант) */}
                    <div className="md:col-span-2">
                        <div className="mb-4">
                            {/* Временная заглушка - текст "РОСАТОМ" */}
                            <div className="text-white text-xl font-bold mb-2">РОСАТОМ</div>
                            {/* Альтернативный вариант с использованием изображения:
                            <img src="/logo-rosatom-white.svg" alt="Росатом" className="h-8 mb-2" />
                            */}
                            <p className="text-white text-sm opacity-90">Добрые дела Росатома</p>
                        </div>
                        <p className="text-white text-sm opacity-80 max-w-md">
                            Портал объединяет НКО и волонтерские инициативы в городах присутствия.
                        </p>
                    </div>

                    {/* Навигация */}
                    <div>
                        <div className="text-white font-semibold mb-3">Навигация</div>
                        <ul className="space-y-2 text-white text-sm">
                            <li><Link to="/" className="opacity-80 hover:opacity-100 transition-opacity">Главная</Link></li>
                            <li><Link to="/ngos" className="opacity-80 hover:opacity-100 transition-opacity">НКО</Link></li>
                            <li><Link to="/knowledge" className="opacity-80 hover:opacity-100 transition-opacity">База знаний</Link></li>
                            <li><Link to="/calendar" className="opacity-80 hover:opacity-100 transition-opacity">Календарь</Link></li>
                            <li><Link to="/news" className="opacity-80 hover:opacity-100 transition-opacity">Новости</Link></li>
                        </ul>
                    </div>

                    {/* Контакты */}
                    <div>
                        <div className="text-white font-semibold mb-3">Контакты</div>
                        <div className="text-white text-sm space-y-2 opacity-80">
                            <div>119017, г. Москва, ул. Большая Ордынка, д. 24</div>
                            <div>Телефон: +7 (495) 123-45-67</div>
                            <div>Email: info@rosatom.ru</div>
                            <div>
                                <a href="https://rosatom.ru" target="_blank" rel="noreferrer" className="hover:opacity-100 transition-opacity">
                                    rosatom.ru
                                </a>
                            </div>
                        </div>
                        <div className="mt-6 text-xs text-white opacity-60">
                            © {new Date().getFullYear()} Росатом. Все права защищены.
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
