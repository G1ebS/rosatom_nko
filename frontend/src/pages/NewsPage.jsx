import React, { useState, useEffect } from 'react'
import NewsItem from '../components/NewsItem'
import { newsAPI } from '../utils/api'
import { useCity } from '../context/CityContext'
import Loader from '../components/Loader'

export default function NewsPage(){
    const { city } = useCity()
    const [news, setNews] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadNews = async () => {
            setLoading(true)
            try {
                const params = {}
                // Передаем город только если он выбран и не "Все"
                // Бэкенд автоматически добавит глобальные новости (без города)
                if (city && city !== 'Все') {
                    params.city = city
                }
                
                const data = await newsAPI.getList(params)
                
                // Обработка пагинированного ответа или массива
                let newsList = []
                if (Array.isArray(data)) {
                    newsList = data
                } else if (data && data.results) {
                    newsList = data.results
                }
                
                setNews(newsList)
            } catch (error) {
                console.error('Не удалось загрузить новости:', error)
                setNews([])
            } finally {
                setLoading(false)
            }
        }
        
        loadNews()
    }, [city])

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader />
            </div>
        )
    }

    return (
        <div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8">Новости</h1>
            <div className="space-y-6">
                {news.length ? news.map(item => (
                    <NewsItem key={item.id} item={item} />
                )) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">Новости не найдены</p>
                    </div>
                )}
            </div>
        </div>
    )
}
