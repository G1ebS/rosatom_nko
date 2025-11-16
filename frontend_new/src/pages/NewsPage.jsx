import React, { useState, useEffect } from 'react'
import NewsItem from '../components/NewsItem'
import { useCity } from '../context/CityContext'
import { api } from '../utils/api'
import Loader from '../components/Loader'

export default function NewsPage(){
    const { city } = useCity()
    const [news, setNews] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadNews = async () => {
            setLoading(true)
            try {
                const params = city ? { city } : {}
                const data = await api.get('/news/', params)
                setNews(data.results || data)
            } catch (error) {
                console.error('Failed to load news:', error)
                setNews([])
            } finally {
                setLoading(false)
            }
        }
        loadNews()
    }, [city])

    return (
        <div>
            <div className="text-center mb-12 py-8">
                <h1 className="text-5xl font-extrabold text-primary mb-4">Новости</h1>
                <p className="text-xl text-gray-600">Будьте в курсе последних инициатив и событий</p>
            </div>
            {loading ? (
                <div className="flex justify-center py-16">
                    <Loader />
                </div>
            ) : (
                <div className="space-y-6">
                    {news.length ? news.map(item => <NewsItem key={item.id} item={item} />) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">Новости не найдены</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
