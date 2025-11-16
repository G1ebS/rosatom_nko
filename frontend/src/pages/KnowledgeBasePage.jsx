import React, { useState, useEffect, useMemo } from 'react'
import { materialAPI } from '../utils/api'
import MaterialItem from '../components/MaterialItem'
import { useCity } from '../context/CityContext'
import Button from '../components/Button'

export default function KnowledgeBasePage() {
    const { city } = useCity()

    const [materials, setMaterials] = useState([])
    const [loading, setLoading] = useState(true)
    const [filterType, setFilterType] = useState('Все')
    const [filterTag, setFilterTag] = useState('Все')

    useEffect(() => {
        async function load() {
            try {
                const response = await materialAPI.getList({})
                setMaterials(response.results)
            } catch (err) {
                console.error('Не удалось загрузить материалы:', err)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    // Типы материалов
    const types = useMemo(() => ['Все', ...Array.from(new Set(materials.map(m => m.type).filter(Boolean)))], [materials])

    // Теги материалов (убираем пустые строки)
    const tags = useMemo(() => {
        const allTags = materials.flatMap(m => m.tags.map(t => t.name).filter(name => name && name.trim() !== ''))
        return ['Все', ...Array.from(new Set(allTags))]
    }, [materials])

    // Сброс фильтров при смене города
    useEffect(() => {
        setFilterType('Все')
        setFilterTag('Все')
    }, [city])

    const filteredMaterials = materials.filter(m => {
        const cityMatch = !m.city || m.city === city || m.city === 'Все'
        const typeMatch = filterType === 'Все' || m.type === filterType
        const tagMatch = filterTag === 'Все' || m.tags.some(t => t.name === filterTag)
        return cityMatch && typeMatch && tagMatch
    })

    if (loading) {
        return <p className="text-center text-gray-500">Загрузка...</p>
    }

    return (
        <div>
            <div className="text-center mb-8">
                <h1 className="text-5xl font-extrabold text-primary mb-4">База знаний</h1>
                <p className="text-xl text-gray-600">Обучайтесь, развивайтесь и становитесь лучше</p>
            </div>

            {/* Фильтры по типу */}
            <div className="card mb-4">
                <div className="flex flex-wrap gap-3 items-center">
                    <label className="text-sm font-semibold text-gray-700">Тип материала:</label>
                    {types.map(type => (
                        <Button
                            key={type}
                            variant={filterType === type ? 'accent' : 'outline'}
                            size="sm"
                            onClick={() => setFilterType(type)}
                            ariaLabel={`Фильтр: ${type}`}
                        >
                            {type}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Фильтры по тегам */}
            <div className="card mb-8">
                <div className="flex flex-wrap gap-3 items-center">
                    <label className="text-sm font-semibold text-gray-700">Теги:</label>
                    {tags.map(tag => (
                        <Button
                            key={tag}
                            variant={filterTag === tag ? 'accent' : 'outline'}
                            size="sm"
                            onClick={() => setFilterTag(tag)}
                            ariaLabel={`Фильтр: ${tag}`}
                        >
                            {tag}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Материалы */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMaterials.length ? filteredMaterials.map(m => (
                    <MaterialItem key={m.id} material={m} />
                )) : (
                    <div className="col-span-full text-center py-12">
                        <p className="text-gray-500 text-lg">Материалы не найдены</p>
                    </div>
                )}
            </div>
        </div>
    )
}
