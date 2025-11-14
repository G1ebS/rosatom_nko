import React from 'react'
import NewsItem from '../components/NewsItem'
import { news } from '../data/news'
import { useCity } from '../context/CityContext'

export default function NewsPage(){
    const { city } = useCity()
    const list = news.filter(n => !n.city || n.city === city || n.city === 'Все')

    return (
        <div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8">Новости</h1>
            <div className="space-y-6">
                {list.length ? list.map(item => <NewsItem key={item.id} item={item} />) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">Новости не найдены</p>
                    </div>
                )}
            </div>
        </div>
    )
}
