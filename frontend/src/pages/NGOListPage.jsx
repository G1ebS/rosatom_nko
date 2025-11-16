import React, { useState, useEffect, useMemo } from 'react'
import NGOCard from '../components/NGOCard'
import { ngoAPI, categoryAPI } from '../utils/api'
import { useCity } from '../context/CityContext'
import CitySelector from '../components/CitySelector'
import CustomDropdown from '../components/CustomDropdown'
import Pagination from '../components/Pagination'
import Button from '../components/Button'
import Loader from '../components/Loader'
import { useToast } from '../context/ToastContext'

export default function NGOListPage(){
    const { city } = useCity()
    const { showToast } = useToast()
    const [category, setCategory] = useState('Все') // Может быть 'Все' или slug категории
    const [activityType, setActivityType] = useState('Все')
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [viewMode, setViewMode] = useState('list')
    const [ngos, setNgos] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [totalPages, setTotalPages] = useState(1)
    const itemsPerPage = 9

    // Загрузка категорий
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await categoryAPI.getList()
                setCategories(['Все', ...data.map(c => ({ value: c.slug, label: c.name }))])
            } catch (error) {
                console.error('Failed to load categories:', error)
            }
        }
        loadCategories()
    }, [])

    // Загрузка НКО
    useEffect(() => {
        const loadNGOs = async () => {
            setLoading(true)
            try {
                const params = {
                    city: city,
                    page: currentPage,
                }
                
                if (category && category !== 'Все') {
                    params.category = category
                }
                
                if (searchQuery) {
                    params.search = searchQuery
                }
                
                const data = await ngoAPI.getList(params)
                
                // Обработка пагинации
                if (data.results) {
                    setNgos(data.results)
                    setTotalPages(Math.ceil(data.count / itemsPerPage))
                } else {
                    // Если нет пагинации, обрабатываем как массив
                    setNgos(Array.isArray(data) ? data : [])
                    setTotalPages(1)
                }
            } catch (error) {
                console.error('Failed to load NGOs:', error)
                showToast('Ошибка при загрузке НКО', 'error')
                setNgos([])
            } finally {
                setLoading(false)
            }
        }
        
        loadNGOs()
    }, [city, category, searchQuery, currentPage])

    // Сброс страницы при изменении фильтров
    useEffect(() => {
        setCurrentPage(1)
    }, [city, category, searchQuery])

    return (
        <div className="space-y-8">
            {/* Заголовок */}
            <div className="text-center py-8">
                <h1 className="text-5xl font-extrabold text-primary mb-4">Некоммерческие организации</h1>
                <p className="text-xl text-gray-600">Найдите НКО в вашем городе и присоединяйтесь к добрым делам</p>
            </div>
            
            {/* Поиск и фильтры */}
            <div className="card">
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Поиск</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Поиск по названию или описанию..."
                            className="w-full border-2 border-gray-200 rounded-modern px-4 py-3 pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all hover:border-accent"
                        />
                        <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Город</label>
                        <CitySelector />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Категория</label>
                        <CustomDropdown
                            options={categories}
                            value={category}
                            onChange={setCategory}
                            placeholder="Все категории"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Тип деятельности</label>
                        <CustomDropdown
                            options={[
                                { value: 'Все', label: 'Все' },
                                { value: 'Активные', label: 'Активные' },
                                { value: 'Новые', label: 'Новые' }
                            ]}
                            value={activityType}
                            onChange={setActivityType}
                            placeholder="Все типы"
                        />
                    </div>
                </div>
            </div>

            {/* Результаты поиска */}
            <div>
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader />
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <div className="text-gray-600">
                                Найдено: <span className="font-bold text-primary">{ngos.length}</span> организаций
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant={viewMode === 'list' ? 'primary' : 'outline'}
                                    size="sm"
                                    onClick={() => setViewMode('list')}
                                    ariaLabel="Режим списка"
                                >
                                    Список
                                </Button>
                                <Button
                                    variant={viewMode === 'map' ? 'primary' : 'outline'}
                                    size="sm"
                                    onClick={() => {
                                        setViewMode('map')
                                        // В будущем здесь будет переключение на карту
                                    }}
                                    ariaLabel="Режим карты"
                                >
                                    Карта
                                </Button>
                            </div>
                        </div>

                        {/* Сетка карточек НКО */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {ngos.length ? ngos.map(n => <NGOCard key={n.id} ngo={n} />) : (
                                <div className="col-span-full card text-center py-16">
                                    <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-gray-500 text-xl font-semibold mb-2">Ничего не найдено</p>
                                    <p className="text-gray-400">Попробуйте изменить фильтры или поисковый запрос</p>
                                </div>
                            )}
                        </div>

                        {/* Пагинация */}
                        {ngos.length > 0 && totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                                itemsPerPage={itemsPerPage}
                                totalItems={ngos.length}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
