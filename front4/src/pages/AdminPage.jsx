import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { ngos } from '../data/ngos'
import { events } from '../data/events'
import { news } from '../data/news'
import Pagination from '../components/Pagination'
import Button from '../components/Button'

export default function AdminPage(){
    const { user } = useAuth()
    const { showToast } = useToast()
    const [activeTab, setActiveTab] = useState('ngos')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    // Проверка прав администратора (в реальном приложении из API)
    if (!user || user.role !== 'admin') {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="card text-center py-12">
                    <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-primary mb-2">Доступ запрещён</h2>
                    <p className="text-gray-600">У вас нет прав для доступа к этой странице</p>
                </div>
            </div>
        )
    }

    const tabs = [
        { id: 'ngos', label: 'НКО', count: ngos.length },
        { id: 'events', label: 'События', count: events.length },
        { id: 'news', label: 'Новости', count: news.length },
        { id: 'moderation', label: 'Модерация', count: ngos.filter(n => n.status === 'pending').length },
        { id: 'users', label: 'Пользователи', count: 0 }
    ]

    const getCurrentItems = () => {
        const start = (currentPage - 1) * itemsPerPage
        const end = start + itemsPerPage
        
        switch(activeTab) {
            case 'ngos':
                return ngos.slice(start, end)
            case 'events':
                return events.slice(start, end)
            case 'news':
                return news.slice(start, end)
            default:
                return []
        }
    }

    const currentItems = getCurrentItems()
    const totalItems = activeTab === 'ngos' ? ngos.length : activeTab === 'events' ? events.length : news.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-extrabold text-primary mb-2">Панель администратора</h1>
                <p className="text-gray-600">Управление контентом и модерация</p>
            </div>

            {/* Вкладки */}
            <div className="card mb-6">
                <div className="flex flex-wrap gap-2 border-b border-gray-200">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id)
                                setCurrentPage(1)
                            }}
                            className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all ${
                                activeTab === tab.id
                                    ? 'border-accent text-accent'
                                    : 'border-transparent text-gray-600 hover:text-primary'
                            }`}
                        >
                            {tab.label}
                            {tab.count > 0 && (
                                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                                    activeTab === tab.id ? 'bg-accent/20 text-accent' : 'bg-gray-100 text-gray-600'
                                }`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Контент вкладок */}
            <div className="card">
                {activeTab === 'ngos' && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-primary">НКО</h2>
                            <Button 
                                variant="primary"
                                onClick={() => showToast('Форма добавления НКО будет доступна в следующем обновлении', 'info')}
                                ariaLabel="Добавить новое НКО"
                            >
                                Добавить НКО
                            </Button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">ID</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Название</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Город</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Категория</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Статус</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Действия</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map(ngo => (
                                        <tr key={ngo.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="py-3 px-4 text-sm text-gray-600">{ngo.id}</td>
                                            <td className="py-3 px-4 text-sm font-medium text-gray-900">{ngo.name}</td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{ngo.city}</td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{ngo.category}</td>
                                            <td className="py-3 px-4">
                                                {ngo.status === 'pending' && (
                                                    <span className="px-2 py-1 text-xs font-semibold rounded-modern bg-yellow-100 text-yellow-800">
                                                        На модерации
                                                    </span>
                                                )}
                                                {ngo.status === 'approved' && (
                                                    <span className="px-2 py-1 text-xs font-semibold rounded-modern bg-green-100 text-green-800">
                                                        Одобрено
                                                    </span>
                                                )}
                                                {ngo.status === 'rejected' && (
                                                    <span className="px-2 py-1 text-xs font-semibold rounded-modern bg-red-100 text-red-800">
                                                        Отклонено
                                                    </span>
                                                )}
                                                {!ngo.status && (
                                                    <span className="px-2 py-1 text-xs font-semibold rounded-modern bg-gray-100 text-gray-800">
                                                        Без статуса
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex gap-2 flex-wrap">
                                                    {ngo.status === 'pending' && (
                                                        <>
                                                            <Button 
                                                                variant="accent"
                                                                size="sm"
                                                                onClick={() => {
                                                                    if (window.confirm(`Одобрить НКО "${ngo.name}"?`)) {
                                                                        showToast(`НКО "${ngo.name}" одобрено (в реальном приложении здесь будет запрос к API)`, 'success')
                                                                    }
                                                                }}
                                                                ariaLabel={`Одобрить НКО ${ngo.name}`}
                                                            >
                                                                Одобрить
                                                            </Button>
                                                            <Button 
                                                                variant="danger"
                                                                size="sm"
                                                                onClick={() => {
                                                                    if (window.confirm(`Отклонить НКО "${ngo.name}"?`)) {
                                                                        showToast(`НКО "${ngo.name}" отклонено (в реальном приложении здесь будет запрос к API)`, 'success')
                                                                    }
                                                                }}
                                                                ariaLabel={`Отклонить НКО ${ngo.name}`}
                                                            >
                                                                Отклонить
                                                            </Button>
                                                        </>
                                                    )}
                                                    <Button 
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => showToast(`Редактирование НКО #${ngo.id} будет доступно в следующем обновлении`, 'info')}
                                                        ariaLabel={`Редактировать НКО ${ngo.name}`}
                                                    >
                                                        Редактировать
                                                    </Button>
                                                    <Button 
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => {
                                                            if (window.confirm(`Вы уверены, что хотите удалить НКО "${ngo.name}"?`)) {
                                                                showToast('НКО удалено (в реальном приложении здесь будет запрос к API)', 'success')
                                                            }
                                                        }}
                                                        ariaLabel={`Удалить НКО ${ngo.name}`}
                                                    >
                                                        Удалить
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                                itemsPerPage={itemsPerPage}
                                totalItems={totalItems}
                            />
                        )}
                    </div>
                )}

                {activeTab === 'events' && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-primary">События</h2>
                            <Button 
                                variant="primary"
                                onClick={() => showToast('Форма добавления события будет доступна в следующем обновлении', 'info')}
                                ariaLabel="Добавить новое событие"
                            >
                                Добавить событие
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {currentItems.map(event => (
                                <div key={event.id} className="card border-l-4 border-accent">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-primary mb-2">{event.title}</h3>
                                            <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                                            <div className="flex gap-4 text-xs text-gray-500">
                                                <span>📅 {new Date(event.date).toLocaleDateString('ru-RU')}</span>
                                                <span>📍 {event.city}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button 
                                                variant="outline"
                                                size="sm"
                                                onClick={() => showToast(`Редактирование события "${event.title}" будет доступно в следующем обновлении`, 'info')}
                                                ariaLabel={`Редактировать событие ${event.title}`}
                                            >
                                                Редактировать
                                            </Button>
                                            <Button 
                                                variant="danger"
                                                size="sm"
                                                onClick={() => {
                                                    if (window.confirm(`Вы уверены, что хотите удалить событие "${event.title}"?`)) {
                                                        showToast('Событие удалено (в реальном приложении здесь будет запрос к API)', 'success')
                                                    }
                                                }}
                                                ariaLabel={`Удалить событие ${event.title}`}
                                            >
                                                Удалить
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                                itemsPerPage={itemsPerPage}
                                totalItems={totalItems}
                            />
                        )}
                    </div>
                )}

                {activeTab === 'news' && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-primary">Новости</h2>
                            <Button 
                                variant="primary"
                                onClick={() => showToast('Форма добавления новости будет доступна в следующем обновлении', 'info')}
                                ariaLabel="Добавить новую новость"
                            >
                                Добавить новость
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {currentItems.map(item => (
                                <div key={item.id} className="card">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-primary mb-2">{item.title}</h3>
                                            <p className="text-sm text-gray-600 mb-2">{item.snippet}</p>
                                            <div className="text-xs text-gray-500">
                                                📅 {new Date(item.date).toLocaleDateString('ru-RU')} • {item.city || 'Общие'}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button 
                                                variant="outline"
                                                size="sm"
                                                onClick={() => showToast(`Редактирование новости "${item.title}" будет доступно в следующем обновлении`, 'info')}
                                                ariaLabel={`Редактировать новость ${item.title}`}
                                            >
                                                Редактировать
                                            </Button>
                                            <Button 
                                                variant="danger"
                                                size="sm"
                                                onClick={() => {
                                                    if (window.confirm(`Вы уверены, что хотите удалить новость "${item.title}"?`)) {
                                                        showToast('Новость удалена (в реальном приложении здесь будет запрос к API)', 'success')
                                                    }
                                                }}
                                                ariaLabel={`Удалить новость ${item.title}`}
                                            >
                                                Удалить
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                                itemsPerPage={itemsPerPage}
                                totalItems={totalItems}
                            />
                        )}
                    </div>
                )}

                {activeTab === 'moderation' && (
                    <div>
                        <h2 className="text-2xl font-bold text-primary mb-6">Модерация</h2>
                        <div className="space-y-4">
                            {ngos.filter(n => n.status === 'pending').length > 0 ? (
                                ngos.filter(n => n.status === 'pending').map(ngo => (
                                    <div key={ngo.id} className="card border-l-4 border-yellow-400">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-primary mb-2">{ngo.name}</h3>
                                                <p className="text-sm text-gray-600 mb-2">{ngo.category} • {ngo.city}</p>
                                                <p className="text-sm text-gray-700 mb-2">{ngo.short_description}</p>
                                                <div className="text-xs text-gray-500">Ожидает проверки</div>
                                            </div>
                                            <div className="flex gap-2 ml-4">
                                                <Button 
                                                    variant="accent"
                                                    size="sm"
                                                    onClick={() => {
                                                        if (window.confirm(`Одобрить НКО "${ngo.name}"?`)) {
                                                            showToast(`НКО "${ngo.name}" одобрено (в реальном приложении здесь будет запрос к API)`, 'success')
                                                        }
                                                    }}
                                                    ariaLabel={`Одобрить НКО ${ngo.name}`}
                                                >
                                                    Одобрить
                                                </Button>
                                                <Button 
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => {
                                                        if (window.confirm(`Отклонить НКО "${ngo.name}"?`)) {
                                                            showToast(`НКО "${ngo.name}" отклонено (в реальном приложении здесь будет запрос к API)`, 'success')
                                                        }
                                                    }}
                                                    ariaLabel={`Отклонить НКО ${ngo.name}`}
                                                >
                                                    Отклонить
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="card text-center py-12">
                                    <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-gray-500 text-lg">Нет заявок на модерацию</p>
                                    <p className="text-gray-400 text-sm mt-2">Все НКО проверены</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div>
                        <h2 className="text-2xl font-bold text-primary mb-6">Пользователи</h2>
                        <div className="card text-center py-12">
                            <p className="text-gray-500">Функция в разработке</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

