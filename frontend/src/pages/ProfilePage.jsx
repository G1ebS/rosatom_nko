import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { ngoAPI, libraryAPI, eventAPI, materialAPI, newsAPI } from '../utils/api'
import NGOCard from '../components/NGOCard'
import EventItem from '../components/EventItem'
import MaterialItem from '../components/MaterialItem'
import Button from '../components/Button'
import Loader from '../components/Loader'
import CustomDropdown from '../components/CustomDropdown'

export default function ProfilePage(){
    const { user, login } = useAuth()
    const { showToast } = useToast()
    const [activeSection, setActiveSection] = useState('favorites')
    const [addNGOForm, setAddNGOForm] = useState({ name: '', category: '', description: '' })
    const [addNewsForm, setAddNewsForm] = useState({ title: '', content: '', city: '', image: null })
    const [submitting, setSubmitting] = useState(false)
    const [favoriteNgos, setFavoriteNgos] = useState([])
    const [savedMaterials, setSavedMaterials] = useState([])
    const [myEvents, setMyEvents] = useState([])
    const [loading, setLoading] = useState(true)

    const loadData = async () => {
        if (!user) return
        
        setLoading(true)
        try {
            // Загружаем избранные НКО
            if (activeSection === 'favorites') {
                if ((user.favorites || []).length > 0) {
                    const favoritesData = await Promise.all(
                        (user.favorites || []).map(id => ngoAPI.getById(id).catch(() => null))
                    )
                    setFavoriteNgos(favoritesData.filter(n => n !== null))
                } else {
                    setFavoriteNgos([])
                }
            }
            
            // Загружаем библиотеку
            if (activeSection === 'library') {
                const libraryData = await libraryAPI.getList()
                // DRF возвращает пагинированный ответ с results или просто массив
                let items = []
                if (Array.isArray(libraryData)) {
                    items = libraryData
                } else if (libraryData && libraryData.results) {
                    items = libraryData.results
                } else if (libraryData && typeof libraryData === 'object') {
                    // Если это один объект, оборачиваем в массив
                    items = [libraryData]
                }
                setSavedMaterials(items.map(item => item.material || item))
            }
            
            // Загружаем события пользователя
            if (activeSection === 'events') {
                const eventsData = await eventAPI.getList({ page: 1 })
                // Фильтруем события, созданные пользователем
                setMyEvents(eventsData.results?.filter(e => e.created_by === user.id) || [])
            }
        } catch (error) {
            console.error('Failed to load profile data:', error)
            showToast('Ошибка загрузки данных', 'error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user) {
            loadData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, activeSection])

    const menuItems = [
        { id: 'favorites', label: 'Избранные НКО', icon: '⭐' },
        { id: 'library', label: 'Библиотека', icon: '📚' },
        { id: 'events', label: 'Мои события', icon: '📅' },
        { id: 'add-ngo', label: 'Добавить НКО', icon: '➕' },
        { id: 'moderation', label: 'Модерация', icon: '✓' },
        { id: 'add-news', label: 'Добавить новость', icon: '📰' }
    ]
    
    const removeFromFavorites = async (ngoId) => {
        if (!user) return
        try {
            await ngoAPI.toggleFavorite(ngoId, true) // true означает удаление
            const updatedFavorites = (user.favorites || []).filter(id => id !== ngoId)
            const updated = { ...user, favorites: updatedFavorites }
            login(localStorage.getItem('jwt') || 'fake', updated)
            setFavoriteNgos(prev => prev.filter(n => n.id !== ngoId))
            showToast('НКО удалено из избранного', 'success')
        } catch (error) {
            console.error('Failed to remove from favorites:', error)
            showToast('Ошибка при удалении из избранного', 'error')
        }
    }
    
    const removeFromLibrary = async (materialId) => {
        try {
            await materialAPI.unsave(materialId)
            setSavedMaterials(prev => prev.filter(m => m.id !== materialId))
            showToast('Материал удален из библиотеки', 'success')
        } catch (error) {
            console.error('Failed to remove from library:', error)
            showToast('Ошибка при удалении из библиотеки', 'error')
        }
    }
    
    const handleMaterialRemove = (materialId) => {
        removeFromLibrary(materialId)
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
        
        if (!user) {
            showToast('Войдите, чтобы добавить новость', 'warning')
            return
        }
        
        setSubmitting(true)
        try {
            const newsData = {
                title: addNewsForm.title,
                content: addNewsForm.content,
                snippet: addNewsForm.content.substring(0, 500), // Автоматически создаем snippet из первых 500 символов
                city: addNewsForm.city || '', // Если пустое, новость будет глобальной
                category: 'Общие',
                image: addNewsForm.image, // Файл изображения (может быть null)
            }
            
            await newsAPI.create(newsData)
            showToast('Новость отправлена на модерацию', 'success')
            setAddNewsForm({ title: '', content: '', city: '', image: null })
        } catch (error) {
            console.error('Failed to create news:', error)
            showToast('Ошибка отправки новости', 'error')
        } finally {
            setSubmitting(false)
        }
    }

    if (!user) {
        return (
            <div className="max-w-7xl mx-auto">
                <div className="card text-center py-12">
                    <p className="text-gray-500 text-lg">Войдите, чтобы просмотреть профиль</p>
                </div>
            </div>
        )
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
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <Loader />
                            </div>
                        ) : favoriteNgos.length ? (
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
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <Loader />
                            </div>
                        ) : savedMaterials.length ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {savedMaterials.map(m => (
                                    <MaterialItem 
                                        key={m.id} 
                                        material={m} 
                                        onRemove={handleMaterialRemove}
                                    />
                                ))}
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
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <Loader />
                            </div>
                        ) : myEvents.length ? (
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
                                <div>
                                    <label htmlFor="news-city" className="block text-sm font-semibold text-[#333333] mb-2">
                                        Город <span className="text-gray-400 font-normal">(оставьте пустым для глобальной новости)</span>
                                    </label>
                                    <CustomDropdown
                                        options={[
                                            { value: '', label: 'Глобальная новость (для всех городов)' },
                                            { value: 'Ангарск', label: 'Ангарск' },
                                            { value: 'Байкальск', label: 'Байкальск' },
                                            { value: 'Балаково', label: 'Балаково' },
                                            { value: 'Билибино', label: 'Билибино' },
                                            { value: 'Волгодонск', label: 'Волгодонск' },
                                            { value: 'Глазов', label: 'Глазов' },
                                            { value: 'Десногорск', label: 'Десногорск' },
                                            { value: 'Димитровград', label: 'Димитровград' },
                                            { value: 'Железногорск', label: 'Железногорск' },
                                            { value: 'ЗАТО Заречный', label: 'ЗАТО Заречный' },
                                            { value: 'Заречный', label: 'Заречный' },
                                            { value: 'Зеленогорск', label: 'Зеленогорск' },
                                            { value: 'Краснокаменск', label: 'Краснокаменск' },
                                            { value: 'Курчатов', label: 'Курчатов' },
                                            { value: 'Лесной', label: 'Лесной' },
                                            { value: 'Неман', label: 'Неман' },
                                            { value: 'Нововоронеж', label: 'Нововоронеж' },
                                            { value: 'Новоуральск', label: 'Новоуральск' },
                                            { value: 'Обнинск', label: 'Обнинск' },
                                            { value: 'Озерск', label: 'Озерск' },
                                            { value: 'Певек', label: 'Певек' },
                                            { value: 'Полярные Зори', label: 'Полярные Зори' },
                                            { value: 'Саров', label: 'Саров' },
                                            { value: 'Северск', label: 'Северск' },
                                            { value: 'Снежинск', label: 'Снежинск' },
                                            { value: 'Советск', label: 'Советск' },
                                            { value: 'Сосновый Бор', label: 'Сосновый Бор' },
                                            { value: 'Трехгорный', label: 'Трехгорный' },
                                            { value: 'Удомля', label: 'Удомля' },
                                            { value: 'Усолье-Сибирское', label: 'Усолье-Сибирское' },
                                            { value: 'Электросталь', label: 'Электросталь' },
                                            { value: 'Энергодар', label: 'Энергодар' }
                                        ]}
                                        value={addNewsForm.city}
                                        onChange={(value) => setAddNewsForm({...addNewsForm, city: value})}
                                        placeholder="Выберите город или оставьте глобальной"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="news-image" className="block text-sm font-semibold text-[#333333] mb-2">
                                        Изображение <span className="text-gray-400 font-normal">(необязательно)</span>
                                    </label>
                                    <input 
                                        id="news-image"
                                        type="file" 
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0]
                                            setAddNewsForm({...addNewsForm, image: file || null})
                                        }}
                                        className="w-full border-2 border-gray-200 rounded-modern px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                                    />
                                    {addNewsForm.image && (
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-600 mb-2">Выбранный файл: {addNewsForm.image.name}</p>
                                            <div className="w-32 h-32 border-2 border-gray-200 rounded-modern overflow-hidden">
                                                <img 
                                                    src={URL.createObjectURL(addNewsForm.image)} 
                                                    alt="Preview" 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setAddNewsForm({...addNewsForm, image: null})}
                                                className="mt-2 text-sm text-red-600 hover:text-red-700"
                                            >
                                                Удалить изображение
                                            </button>
                                        </div>
                                    )}
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
                                        onClick={() => setAddNewsForm({ title: '', content: '', city: '', image: null })}
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
