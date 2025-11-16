import React, { useState, useMemo, useEffect } from 'react'
import NGOCard from '../components/NGOCard'
import { ngoAPI, categoryAPI } from '../services/api'
import { useCity } from '../context/CityContext'
import CitySelector from '../components/CitySelector'
import CustomDropdown from '../components/CustomDropdown'
import Pagination from '../components/Pagination'
import Button from '../components/Button'
import Loader from '../components/Loader'

export default function NGOListPage(){
    const { city } = useCity()
    const [category, setCategory] = useState('Все')
    const [activityType, setActivityType] = useState('Все')
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [viewMode, setViewMode] = useState('list')
    const [ngos, setNgos] = useState([])
    const [categories, setCategories] = useState(['Все'])
    const [loading, setLoading] = useState(true)
    const itemsPerPage = 9

    // Загрузка данных с API
    useEffect(() => {
        loadData()
    }, [city, category, searchQuery])

    const loadData = async () => {
        setLoading(true)
        try {
            // Загружаем категории
            const catsData = await categoryAPI.getAll()
            setCategories(['Все', ...catsData.map(c => c.name)])
            
            // Загружаем НКО
            const params = {}
            if (city && city !== 'Все') params.city = city
            if (category && category !== 'Все') {
                const cat = catsData.find(c => c.name === category)
                if (cat) params.category = cat.slug
            }
            if (searchQuery) params.search = searchQuery
            
            const response = await ngoAPI.getAll(params)
            // API возвращает объект с results или массив напрямую
            const ngosList = response.results || response
            setNgos(Array.isArray(ngosList) ? ngosList : [])
        } catch (error) {
            console.error('Failed to load NGOs:', error)
            // Fallback на статические данные при ошибке
            setNgos([])
        } finally {
            setLoading(false)
        }
    }

    const filteredList = useMemo(() => {
        return ngos.filter(n => {
            const cityMatch = !city || city === 'Все' || n.city === city
            const categoryMatch = category === 'Все' || n.category?.name === category || n.category === category
            const searchMatch = !searchQuery || 
                n.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                n.short_description?.toLowerCase().includes(searchQuery.toLowerCase())
            return cityMatch && categoryMatch && searchMatch
        })
    }, [ngos, city, category, searchQuery])

    const totalPages = Math.ceil(filteredList.length / itemsPerPage)
    const paginatedList = filteredList.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    // Сброс страницы при изменении фильтров
    React.useEffect(() => {
        setCurrentPage(1)
    }, [city, category, searchQuery])

    if (loading) {
        return <Loader />
    }

    return (
        <div className="space-y-8">
            {/* Заголовок */}
            <div className="text-center py-8">
                <h1 className="text-5xl font-extrabold mb-4" style={{ color: '#1a2165' }}>Организации</h1>
                <p className="text-xl" style={{ color: '#3a3a39' }}>Найдите инициативы в вашем городе и присоединяйтесь</p>
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
                            options={categories.map(c => ({ value: c, label: c }))}
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
                <div className="flex items-center justify-between mb-6">
                    <div className="text-gray-600">
                        Найдено: <span className="font-bold text-primary">{filteredList.length}</span> {filteredList.length === 1 ? 'организация' : filteredList.length < 5 ? 'организации' : 'организаций'}
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
                    {paginatedList.length ? paginatedList.map(n => <NGOCard key={n.id} ngo={n} />) : (
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
                {filteredList.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        itemsPerPage={itemsPerPage}
                        totalItems={filteredList.length}
                    />
                )}
            </div>
        </div>
    )
}
