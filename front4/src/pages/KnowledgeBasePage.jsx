import React, { useState, useEffect } from 'react'
import { materialAPI } from '../services/api'
import MaterialItem from '../components/MaterialItem'
import { useCity } from '../context/CityContext'
import Button from '../components/Button'
import Loader from '../components/Loader'

export default function KnowledgeBasePage(){
    const { city } = useCity()
    const [filter, setFilter] = useState('Все')
    const [materials, setMaterials] = useState([])
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        loadMaterials()
    }, [city, filter])

    const loadMaterials = async () => {
        setLoading(true)
        try {
            const params = {}
            if (city && city !== 'Все') params.city = city
            if (filter && filter !== 'Все') params.type = filter
            
            const response = await materialAPI.getAll(params)
            const materialsList = response.results || response
            setMaterials(Array.isArray(materialsList) ? materialsList : [])
        } catch (error) {
            console.error('Failed to load materials:', error)
            setMaterials([])
        } finally {
            setLoading(false)
        }
    }

    const types = ['Все', ...Array.from(new Set(materials.map(m => m.type || m.category)))]

    if (loading) {
        return <Loader />
    }

    return (
        <div>
            <div className="text-center mb-8 py-8">
                <h1 className="text-5xl font-extrabold mb-4" style={{ color: '#1a2165' }}>База знаний</h1>
                <p className="text-xl" style={{ color: '#3a3a39' }}>Полезные материалы для волонтёров и организаторов</p>
            </div>
            
            {/* Фильтры */}
            <div className="card mb-8">
                <div className="flex flex-wrap gap-3 items-center">
                    <label className="text-sm font-semibold text-gray-700">Тип материала:</label>
                    {types.map(type => (
                        <Button
                            key={type}
                            variant={filter === type ? 'accent' : 'outline'}
                            size="sm"
                            onClick={() => setFilter(type)}
                            ariaLabel={`Фильтр: ${type}`}
                        >
                            {type}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Сетка материалов */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {materials.length ? materials.map(m => <MaterialItem key={m.id} material={m} />) : (
                    <div className="col-span-full text-center py-12">
                        <p className="text-gray-500 text-lg">Материалы не найдены</p>
                    </div>
                )}
            </div>
        </div>
    )
}
