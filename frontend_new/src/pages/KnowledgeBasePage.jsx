import React, { useState, useEffect } from 'react'
import MaterialItem from '../components/MaterialItem'
import { useCity } from '../context/CityContext'
import Button from '../components/Button'
import { api } from '../utils/api'
import Loader from '../components/Loader'

export default function KnowledgeBasePage(){
    const { city } = useCity()
    const [filter, setFilter] = useState('Все')
    const [materials, setMaterials] = useState([])
    const [types, setTypes] = useState(['Все'])
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        const loadMaterials = async () => {
            setLoading(true)
            try {
                const data = await api.get('/materials/all/')
                setMaterials(data.results || data)
                
                // Получаем уникальные типы материалов из тегов или других полей
                const uniqueTypes = ['Все', ...Array.from(new Set(
                    (data.results || data).map(m => m.course || m.type || 'Другое')
                ))]
                setTypes(uniqueTypes)
            } catch (error) {
                console.error('Failed to load materials:', error)
                setMaterials([])
            } finally {
                setLoading(false)
            }
        }
        loadMaterials()
    }, [])
    
    const list = materials.filter(m => {
        const typeMatch = filter === 'Все' || (m.course || m.type || 'Другое') === filter
        return typeMatch
    })

    return (
        <div>
            <div className="text-center mb-8 py-8">
                <h1 className="text-5xl font-extrabold text-primary mb-4">База знаний</h1>
                <p className="text-xl text-gray-600">Полезные материалы для волонтёров и организаторов</p>
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
            {loading ? (
                <div className="flex justify-center py-16">
                    <Loader />
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {list.length ? list.map(m => <MaterialItem key={m.id} material={m} />) : (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500 text-lg">Материалы не найдены</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
