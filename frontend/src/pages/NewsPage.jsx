import React from 'react'
import NewsItem from '../components/NewsItem'
import { news } from '../data/news'
import { useCity } from '../context/CityContext'

export default function NewsPage(){
    const { city } = useCity()
    const list = news.filter(n => !n.city || n.city === city || n.city === 'Все')

    return (
        <div>
            <div className="text-center mb-12 py-8">
                <h1 className="text-5xl font-extrabold text-primary mb-4">Новости</h1>
                <p className="text-xl text-gray-600">Будьте в курсе последних инициатив и событий</p>
            </div>
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
