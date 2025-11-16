import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from './Button'
import RosatomLogo from './RosatomLogo'

export default function Header(){
    const { user, logout } = useAuth()
    const [open, setOpen] = useState(false)

    return (
        <header className="bg-white/95 backdrop-blur-md shadow-modern sticky top-0 z-50 border-b border-gray-100">
            <div className="container-max flex items-center justify-between h-16">
                <div className="flex items-center gap-4">
                    <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <RosatomLogo height={32} className="flex-shrink-0" />
                    </Link>

                    <nav className="hidden md:flex items-center gap-6 ml-8">
                        <Link to="/" className="text-sm font-bold hover:text-primaryLight transition-colors" style={{ color: '#3a3a39' }}>Главная</Link>
                        <Link to="/ngos" className="text-sm font-bold hover:text-primaryLight transition-colors" style={{ color: '#3a3a39' }}>Карта</Link>
                        <Link to="/knowledge" className="text-sm font-bold hover:text-primaryLight transition-colors" style={{ color: '#3a3a39' }}>База знаний</Link>
                        <Link to="/calendar" className="text-sm font-bold hover:text-primaryLight transition-colors" style={{ color: '#3a3a39' }}>Календарь</Link>
                        <Link to="/news" className="text-sm font-bold hover:text-primaryLight transition-colors" style={{ color: '#3a3a39' }}>Новости</Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    {/* Социальные сети */}
                    <div className="hidden md:flex items-center gap-3">
                        <a href="https://t.me/rosatom" target="_blank" rel="noreferrer" className="hover:opacity-70 transition-opacity" style={{ color: '#1a2165' }} aria-label="Telegram">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.169 1.858-.896 6.37-1.269 8.449-.156.938-.463 1.251-.76 1.283-.64.056-1.126-.422-1.746-.827-.969-.677-1.518-1.049-2.461-1.68-1.095-.71-.386-1.101.239-1.739.164-.165 3.001-2.758 3.055-2.993.007-.032.014-.15-.056-.212-.07-.062-.174-.041-.249-.024-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.14.118.095.151.223.167.312.016.089.036.293.02.451z"/>
                            </svg>
                        </a>
                        <a href="https://vk.com/rosatom" target="_blank" rel="noreferrer" className="hover:opacity-70 transition-opacity" style={{ color: '#1a2165' }} aria-label="ВКонтакте">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12.785 16.241s.371-.044.56-.267c.109-.18.078-.414.078-.414s-.05-1.35.595-1.549c.608-.19 1.386.95 2.207 1.37.607.312 1.068.243 1.068.243l2.207-.031s1.155-.072.606-.96c-.045-.077-.318-.66-1.64-1.866-1.386-1.27-1.2-1.064.47-3.26 1.01-1.33 1.414-2.14 1.288-2.485-.12-.328-.86-.241-.86-.241l-2.207.014s-.163-.022-.284.05c-.12.07-.196.23-.196.23s-.352.94-.82 1.741c-.988 1.64-1.384 1.727-1.546 1.63-.375-.22-.282-.882-.282-1.354 0-1.473.22-2.088-.43-2.245-.216-.052-.375-.086-.928-.091-.71-.007-1.312.002-1.65.168-.227.11-.4.356-.294.37.13.018.426.078.582.285.201.27.194.877.194.877s.116 1.715-.27 1.928c-.265.146-.628-.152-1.41-1.51-.398-.68-.698-1.43-.698-1.43s-.058-.145-.162-.224c-.125-.098-.3-.13-.3-.13l-2.103-.014s-.315.009-.431.135c-.103.112-.008.345-.008.345s1.68 3.97 3.576 5.97c1.74 1.82 3.722 1.699 3.722 1.699h.882s.264.157.06.48c-.053.083-.189.27-.4.488-.49.55-1.15 1.28-1.15 1.28s-.082.07-.187.16c-.15.13-.107.4.08.62.3.35.68.82 1.01 1.32.71 1.08 1.59 2.5 1.59 2.5s.09.19.01.3c-.07.09-.21.12-.21.12l-2.4.03s-.36.05-.49-.06c-.1-.09-.17-.3-.17-.3s-.31-1.01-.43-1.35c-.22-.68-.49-.96-.9-1.01-.22-.03-.19-.05-.19-.05s.14-.03.36-.02c.44.02 1.18.14 1.33.44.19.38.13 1.01.13 1.01s.08.5-.08.58c-.2.1-.48-.1-1.08-.6-.3-.25-.5-.42-.5-.42s-.04-.03-.02-.07c.02-.04.06-.05.06-.05s2.4-.03 2.65-.03c.26 0 .29.05.29.14-.01.2-.01.5-.01.5z"/>
                            </svg>
                        </a>
                        <a href="https://ok.ru/rosatom" target="_blank" rel="noreferrer" className="hover:opacity-70 transition-opacity" style={{ color: '#1a2165' }} aria-label="Одноклассники">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16c-.169 0-.3.061-.39.18-.09.12-.135.27-.135.45 0 .18.045.33.135.45.09.12.221.18.39.18.169 0 .3-.06.39-.18.09-.12.135-.27.135-.45 0-.18-.045-.33-.135-.45-.09-.119-.221-.18-.39-.18zm-3.16 4.74c-1.206 0-2.18-.978-2.18-2.185 0-1.206.974-2.18 2.18-2.18 1.207 0 2.18.974 2.18 2.18 0 1.207-.973 2.185-2.18 2.185zm-4.816 0c-1.206 0-2.18-.978-2.18-2.185 0-1.206.974-2.18 2.18-2.18 1.207 0 2.18.974 2.18 2.18 0 1.207-.973 2.185-2.18 2.185z"/>
                            </svg>
                        </a>
                    </div>
                    
                    {user ? (
                        <>
                            <Link to="/profile" className="hidden sm:flex items-center justify-center w-8 h-8 hover:opacity-70 transition-opacity" style={{ color: '#1a2165' }} aria-label="Профиль">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </Link>
                            {user.role === 'admin' && (
                                <Link to="/admin" className="hidden sm:inline text-sm text-accent hover:text-accent-hover font-semibold transition-colors">
                                    Админка
                                </Link>
                            )}
                            <Button 
                                variant="outline"
                                size="sm"
                                onClick={logout}
                                ariaLabel="Выйти из системы"
                            >
                                Выйти
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link to="/profile" className="hidden sm:flex items-center justify-center w-8 h-8 hover:opacity-70 transition-opacity" style={{ color: '#1a2165' }} aria-label="Профиль">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </Link>
                        </>
                    )}

                    {/* Mobile toggle */}
                    <button className="md:hidden p-2 ml-2" onClick={() => setOpen(o => !o)} aria-label="menu">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-[#333333]"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="md:hidden border-t bg-white">
                    <div className="p-4 space-y-2">
                        <Link to="/" className="block text-sm font-bold text-[#333333] hover:text-accent">Главная</Link>
                        <Link to="/ngos" className="block text-sm font-bold text-[#333333] hover:text-accent">Карта</Link>
                        <Link to="/knowledge" className="block text-sm font-bold text-[#333333] hover:text-accent">База знаний</Link>
                        <Link to="/calendar" className="block text-sm font-bold text-[#333333] hover:text-accent">Календарь</Link>
                        <Link to="/news" className="block text-sm font-bold text-[#333333] hover:text-accent">Новости</Link>
                    </div>
                </div>
            )}
        </header>
    )
}
