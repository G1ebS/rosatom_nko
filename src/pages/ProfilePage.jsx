import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { ngos } from '../data/ngos'
import NGOCard from '../components/NGOCard'
import { events } from '../data/events'
import { materials } from '../data/materials'
import EventItem from '../components/EventItem'
import MaterialItem from '../components/MaterialItem'
import Button from '../components/Button'

export default function ProfilePage(){
    const { user, login } = useAuth()
    const { showToast } = useToast()
    const [activeSection, setActiveSection] = useState('favorites')
    const [addNGOForm, setAddNGOForm] = useState({ name: '', category: '', description: '' })
    const [addNewsForm, setAddNewsForm] = useState({ title: '', content: '' })
    const [submitting, setSubmitting] = useState(false)
    
    if (!user) return null

    const favoriteNgos = ngos.filter(n => (user.favorites || []).includes(n.id))
    const myEvents = events.filter(e => e.created_by === user.id)

    const menuItems = [
        { id: 'favorites', label: 'Избранные НКО', icon: '⭐' },
        { id: 'library', label: 'Библиотека', icon: '📚' },
        { id: 'events', label: 'Мои события', icon: '📅' },
        { id: 'add-ngo', label: 'Добавить НКО', icon: '➕' },
        { id: 'moderation', label: 'Модерация', icon: '✓' },
        { id: 'add-news', label: 'Добавить новость', icon: '📰' }
    ]
    
    // В реальном приложении сохраненные материалы будут из API
    const savedMaterials = materials.filter(m => {
        // Здесь будет проверка через API или localStorage
        return false // Пока пусто, так как нет сохранения
    })
    
    const removeFromFavorites = (ngoId) => {
        if (!user) return
        const updatedFavorites = (user.favorites || []).filter(id => id !== ngoId)
        const updated = { ...user, favorites: updatedFavorites }
        login(localStorage.getItem('jwt') || 'fake', updated)
        showToast('НКО удалено из избранного', 'success')
    }
    
    const handleAddNGO = async (e) => {
        e.preventDefault()
        if (!addNGOForm.name || !addNGOForm.category || !addNGOForm.description) {
            showToast('Заполните все поля', 'warning')
            return
        }
        setSubmitting(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            showToast('НКО отправлено на модерацию', 'success')
            setAddNGOForm({ name: '', category: '', description: '' })
        } catch (error) {
            showToast('Ошибка отправки заявки', 'error')
        } finally {
            setSubmitting(false)
        }
    }
    
    const handleAddNews = async (e) => {
        e.preventDefault()
        if (!addNewsForm.title || !addNewsForm.content) {
            showToast('Заполните все поля', 'warning')
            return
        }
        setSubmitting(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            showToast('Новость отправлена на модерацию', 'success')
            setAddNewsForm({ title: '', content: '' })
        } catch (error) {
            showToast('Ошибка отправки новости', 'error')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Вертикальное меню слева */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="card">
                        <div className="p-4 border-b border-gray-200">
                            <h2 className="text-lg font-bold text-[#333333]">Личный кабинет</h2>
                            <p className="text-sm text-gray-500 mt-1">{user.name}</p>
                        </div>
                        <nav className="p-2">
                            <ul className="space-y-1">
                                {menuItems.map(item => (
                                    <li key={item.id}>
                                        <button
                                            onClick={() => setActiveSection(item.id)}
                                            className={`w-full text-left px-4 py-2 rounded-modern text-sm font-medium transition-all duration-300 ${
                                                activeSection === item.id
                                                    ? 'bg-gradient-accent text-white shadow-modern'
                                                    : 'text-[#333333] hover:bg-gray-50'
                                            }`}
                                        >
                                            {item.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </aside>

                {/* Контентная область */}
                <main className="flex-1">
                {activeSection === 'favorites' && (
                    <section>
                        <h1 className="text-2xl font-bold text-[#333333] mb-6">Избранные НКО</h1>
                        {favoriteNgos.length ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {favoriteNgos.map(n => (
                                    <div key={n.id} className="relative">
                                        <NGOCard ngo={n} />
                                        <button
                                            onClick={() => removeFromFavorites(n.id)}
                                            className="absolute top-4 right-4 min-w-[44px] min-h-[44px] bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-modern hover:bg-red-50 transition-all group"
                                            title="Удалить из избранного"
                                            aria-label="Удалить из избранного"
                                        >
                                            <svg className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="card text-center py-12">
                                <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <p className="text-gray-500 text-lg">Нет избранных НКО</p>
                                <p className="text-gray-400 text-sm mt-2">Добавьте НКО в избранное, чтобы они отображались здесь</p>
                            </div>
                        )}
                    </section>
                )}

                {activeSection === 'library' && (
                    <section>
                        <h1 className="text-2xl font-bold text-[#333333] mb-6">Библиотека</h1>
                        {savedMaterials.length ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {savedMaterials.map(m => <MaterialItem key={m.id} material={m} />)}
                            </div>
                        ) : (
                            <div className="card text-center py-12">
                                <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                                <p className="text-gray-500 text-lg">Библиотека пуста</p>
                                <p className="text-gray-400 text-sm mt-2">Сохраняйте материалы из базы знаний, чтобы они отображались здесь</p>
                            </div>
                        )}
                    </section>
                )}

                {activeSection === 'events' && (
                    <section>
                        <h1 className="text-2xl font-bold text-[#333333] mb-6">Мои события</h1>
                        {myEvents.length ? (
                            <div className="space-y-4">
                                {myEvents.map(ev => <EventItem key={ev.id} event={ev} />)}
                            </div>
                        ) : (
                            <div className="bg-white border border-[#D3D3D3] rounded-lg p-8 text-center">
                                <p className="text-gray-500">Нет созданных событий</p>
                            </div>
                        )}
                    </section>
                )}

                {activeSection === 'add-ngo' && (
                    <section>
                        <h1 className="text-2xl font-bold text-[#333333] mb-6">Добавить НКО</h1>
                        <div className="card">
                            <form onSubmit={handleAddNGO} className="space-y-4">
                                <div>
                                    <label htmlFor="ngo-name" className="block text-sm font-semibold text-[#333333] mb-2">Название НКО</label>
                                    <input 
                                        id="ngo-name"
                                        type="text" 
                                        value={addNGOForm.name}
                                        onChange={(e) => setAddNGOForm({...addNGOForm, name: e.target.value})}
                                        className="w-full border-2 border-gray-200 rounded-modern px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="ngo-category" className="block text-sm font-semibold text-[#333333] mb-2">Категория</label>
                                    <select 
                                        id="ngo-category"
                                        value={addNGOForm.category}
                                        onChange={(e) => setAddNGOForm({...addNGOForm, category: e.target.value})}
                                        className="w-full border-2 border-gray-200 rounded-modern px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                                        required
                                    >
                                        <option value="">Выберите категорию</option>
                                        <option value="Соцподдержка">Соцподдержка</option>
                                        <option value="Экология">Экология</option>
                                        <option value="Культура">Культура</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="ngo-description" className="block text-sm font-semibold text-[#333333] mb-2">Описание</label>
                                    <textarea 
                                        id="ngo-description"
                                        rows="4" 
                                        value={addNGOForm.description}
                                        onChange={(e) => setAddNGOForm({...addNGOForm, description: e.target.value})}
                                        className="w-full border-2 border-gray-200 rounded-modern px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                                        required
                                    ></textarea>
                                </div>
                                <div className="flex gap-3">
                                    <Button 
                                        type="submit" 
                                        variant="primary"
                                        loading={submitting}
                                        disabled={submitting}
                                        ariaLabel="Сохранить НКО"
                                    >
                                        Сохранить
                                    </Button>
                                    <Button 
                                        type="button" 
                                        variant="outline"
                                        onClick={() => setAddNGOForm({ name: '', category: '', description: '' })}
                                        ariaLabel="Отменить"
                                    >
                                        Отмена
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </section>
                )}

                {activeSection === 'moderation' && (
                    <section>
                        <h1 className="text-2xl font-bold text-[#333333] mb-6">Модерация</h1>
                        <div className="bg-white border border-[#D3D3D3] rounded-lg p-6">
                            <p className="text-gray-500">Здесь будет список заявок на модерацию</p>
                        </div>
                    </section>
                )}

                {activeSection === 'add-news' && (
                    <section>
                        <h1 className="text-2xl font-bold text-[#333333] mb-6">Добавить новость</h1>
                        <div className="card">
                            <form onSubmit={handleAddNews} className="space-y-4">
                                <div>
                                    <label htmlFor="news-title" className="block text-sm font-semibold text-[#333333] mb-2">Заголовок</label>
                                    <input 
                                        id="news-title"
                                        type="text" 
                                        value={addNewsForm.title}
                                        onChange={(e) => setAddNewsForm({...addNewsForm, title: e.target.value})}
                                        className="w-full border-2 border-gray-200 rounded-modern px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="news-content" className="block text-sm font-semibold text-[#333333] mb-2">Текст новости</label>
                                    <textarea 
                                        id="news-content"
                                        rows="6" 
                                        value={addNewsForm.content}
                                        onChange={(e) => setAddNewsForm({...addNewsForm, content: e.target.value})}
                                        className="w-full border-2 border-gray-200 rounded-modern px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                                        required
                                    ></textarea>
                                </div>
                                <div className="flex gap-3">
                                    <Button 
                                        type="submit" 
                                        variant="primary"
                                        loading={submitting}
                                        disabled={submitting}
                                        ariaLabel="Опубликовать новость"
                                    >
                                        Опубликовать
                                    </Button>
                                    <Button 
                                        type="button" 
                                        variant="outline"
                                        onClick={() => setAddNewsForm({ title: '', content: '' })}
                                        ariaLabel="Отменить"
                                    >
                                        Отмена
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </section>
                )}
            </main>
            </div>
        </div>
    )
}
