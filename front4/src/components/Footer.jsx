import React from 'react'
import { Link } from 'react-router-dom'
import RosatomLogo from './RosatomLogo'

export default function Footer(){
    return (
        <footer style={{ backgroundColor: '#1a2165' }} className="mt-20">
            <div className="container-max py-12">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    {/* Логотип и описание */}
                    <div className="md:col-span-1">
                        <RosatomLogo variant="white" height={40} className="mb-4" />
                        <p className="text-white/80 text-sm leading-relaxed">
                            Единый портал для жителей, волонтёров и НКО в городах присутствия Росатома
                        </p>
                    </div>
                    
                    {/* Навигация */}
                    <div>
                        <h3 className="text-white font-bold mb-4">Навигация</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-white/80 hover:text-white text-sm transition-colors">
                                    Главная
                                </Link>
                            </li>
                            <li>
                                <Link to="/ngos" className="text-white/80 hover:text-white text-sm transition-colors">
                                    Карта организаций
                                </Link>
                            </li>
                            <li>
                                <Link to="/knowledge" className="text-white/80 hover:text-white text-sm transition-colors">
                                    База знаний
                                </Link>
                            </li>
                            <li>
                                <Link to="/calendar" className="text-white/80 hover:text-white text-sm transition-colors">
                                    Календарь
                                </Link>
                            </li>
                            <li>
                                <Link to="/news" className="text-white/80 hover:text-white text-sm transition-colors">
                                    Новости
                                </Link>
                            </li>
                        </ul>
                    </div>
                    
                    {/* Информация */}
                    <div>
                        <h3 className="text-white font-bold mb-4">Информация</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-white/80 hover:text-white text-sm transition-colors">
                                    О проекте
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-white/80 hover:text-white text-sm transition-colors">
                                    Контакты
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-white/80 hover:text-white text-sm transition-colors">
                                    Помощь
                                </a>
                            </li>
                        </ul>
                    </div>
                    
                    {/* Социальные сети */}
                    <div>
                        <h3 className="text-white font-bold mb-4">Мы в соцсетях</h3>
                        <div className="flex gap-4">
                            <a 
                                href="https://t.me/rosatom" 
                                target="_blank" 
                                rel="noreferrer" 
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                                aria-label="Telegram"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.169 1.858-.896 6.728-.896 6.728-.896 6.728-1.268 7.936-1.268 7.936s-.169.338-.507.338c-.338 0-.676-.169-.676-.169l-2.365-1.352-1.183-.845-.845-.507s-.338-.169-.338-.507c0-.338.169-.507.169-.507l8.445-5.067c.338-.169.507-.169.507.169s.169.169 0 .338l-3.214 3.214-1.352.845-1.858 1.183s-.169.169-.338 0c-.169-.169-.169-.338-.169-.338l1.183-4.732 6.728-6.728s.169-.169.338-.169c.169 0 .338.169.169.338z"/>
                                </svg>
                            </a>
                            <a 
                                href="https://vk.com/rosatom" 
                                target="_blank" 
                                rel="noreferrer" 
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                                aria-label="ВКонтакте"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.785 16.241s.336-.039.508-.23c.158-.179.154-.515.154-.515s-.023-1.566.688-1.797c.701-.223 1.603.1 2.508.723.645.45 1.13.7 1.27.774.183.096.313.075.313.075l2.526-.037s1.322-.084.695-1.123c-.051-.083-.365-.75-1.88-2.123-1.59-1.41-1.376-1.18.538-3.616.369-.47.66-1.01.66-1.01s.149-.358-.14-.551c-.288-.19-.68-.2-.68-.2h-2.05s-.456.006-.745.22c-.288.214-.47.7-.47.7s-.844 2.02-1.966 3.33c-.238.27-.406.356-.56.356-.146 0-.27-.11-.27-.43V7.5s0-.5-.14-.68c-.14-.18-.4-.23-.4-.23h-2.78s-.42.013-.57.19c-.15.18-.11.55-.11.55s.44 2.6 1.03 4.35c.47 1.39.66 1.67.73 1.88.1.3.08.48-.09.48-.26 0-.74-.09-1.41-.26-.99-.33-1.74-.7-1.96-.74-.44-.09-.38-.4-.38-.61 0-.35.05-.51.23-.69.23-.23.5-.45.67-.75.23-.38.32-.61.32-.61s.05-.24-.15-.39c-.2-.15-.47-.16-.47-.16h-1.01s-.75.02-.99.34c-.24.32-.18.84-.18.84s.9 4.28 1.92 5.88c.93 1.45 1.39 1.36 1.39 1.36h.33s.25.02.42-.12c.16-.13.15-.38.15-.38s-.08-2.5.34-2.87c.35-.3.8-.07 1.8.55 1.25.75 2.19 1.22 2.45 1.61.19.29.13.44.13.44s-.05.3-.4.35c-.35.05-.84-.11-1.89-.37-1.5-.41-2.63-.85-2.96-1.12-.23-.19-.17-.23-.17-.46 0-.24.25-.5.5-.67.5-.35 1.35-.7 1.35-.7s.25-.15.15-.45c-.1-.3-.45-.35-.6-.38-.15-.02-1.16-.07-1.66-.07-.5 0-.65.03-.85.15-.2.12-.35.4-.35.4s-.03.08-.08.18c-.05.1-.17.15-.17.15h-.33s-.5-.02-.68-.23c-.05-.07-.08-.15-.08-.15s.05-.3.23-.45c.35-.3.99-.6 1.99-1.05 1.5-.56 3.35-1.29 4.75-2.06 2.1-1.17 1.88-1.5 1.88-1.5s-.13-.3.1-.45c.22-.15.5-.15.75-.15h2.05s.5-.02.68.15c.17.18.13.4.13.55-.02 1.5-.02 2.3.02 2.3s.05.25.18.38c.13.13.3.17.3.17h.5s.3.02.4.1c.1.08.07.25.07.25l-.02 1.5s-.05.7.15.83c.2.13.45.13.68.1.23-.03 1.15-.13 1.9-.85 1.2-1.15 2.1-2.9 2.1-2.9s.12-.25.3-.3c.18-.05.4 0 .4 0h2.4s1.2-.08.63.95c-.05.09-.4.75-1.88 1.77-1.43 1.01-1.67 1.51.41 2.45 1.29.74 1.85 1.21 2.1 1.85.2.52-.15.78-.15.78l-2.13.13z"/>
                                </svg>
                            </a>
                            <a 
                                href="https://ok.ru/rosatom" 
                                target="_blank" 
                                rel="noreferrer" 
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                                aria-label="Одноклассники"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16c-.169 1.858-.896 6.728-.896 6.728-.896 6.728-1.268 7.936-1.268 7.936s-.169.338-.507.338c-.338 0-.676-.169-.676-.169l-2.365-1.352-1.183-.845-.845-.507s-.338-.169-.338-.507c0-.338.169-.507.169-.507l8.445-5.067c.338-.169.507-.169.507.169s.169.169 0 .338l-3.214 3.214-1.352.845-1.858 1.183s-.169.169-.338 0c-.169-.169-.169-.338-.169-.338l1.183-4.732 6.728-6.728s.169-.169.338-.169c.169 0 .338.169.169.338z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
                
                {/* Копирайт */}
                <div className="border-t border-white/20 pt-6">
                    <p className="text-white/60 text-sm text-center">
                        © {new Date().getFullYear()} Госкорпорация «Росатом». Все права защищены.
                    </p>
                </div>
            </div>
        </footer>
    )
}
