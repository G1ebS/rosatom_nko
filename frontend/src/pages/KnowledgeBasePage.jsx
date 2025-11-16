import React, { useState } from 'react'
import { materials } from '../data/materials'
import MaterialItem from '../components/MaterialItem'
import { useCity } from '../context/CityContext'
import Button from '../components/Button'

export default function KnowledgeBasePage(){
    const { city } = useCity()
    const [filter, setFilter] = useState('Все')
    
    const types = ['Все', ...Array.from(new Set(materials.map(m => m.type)))]
    const list = materials.filter(m => {
        const cityMatch = !m.city || m.city === city || m.city === 'Все'
        const typeMatch = filter === 'Все' || m.type === filter
        return cityMatch && typeMatch
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {list.length ? list.map(m => <MaterialItem key={m.id} material={m} />) : (
                    <div className="col-span-full text-center py-12">
                        <p className="text-gray-500 text-lg">Материалы не найдены</p>
                    </div>
                )}
            </div>
        </div>
    )
}
