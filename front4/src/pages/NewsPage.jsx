import React, { useState, useEffect } from 'react'
import NewsItem from '../components/NewsItem'
import { newsAPI } from '../services/api'
import { useCity } from '../context/CityContext'
import Loader from '../components/Loader'

export default function NewsPage(){
    const { city } = useCity()
    const [news, setNews] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadNews()
    }, [city])

    const loadNews = async () => {
        setLoading(true)
        try {
            const params = {}
            if (city && city !== 'Все') params.city = city
            
            const response = await newsAPI.getAll(params)
            const newsList = response.results || response
            setNews(Array.isArray(newsList) ? newsList : [])
        } catch (error) {
            console.error('Failed to load news:', error)
            setNews([])
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <Loader />
    }

    return (
        <div>
            <div className="text-center mb-12 py-8">
                <h1 className="text-5xl font-extrabold mb-4" style={{ color: '#1a2165' }}>Новости</h1>
                <p className="text-xl" style={{ color: '#3a3a39' }}>Будьте в курсе последних инициатив и событий</p>
            </div>
            <div className="space-y-6">
                {news.length ? news.map(item => <NewsItem key={item.id} item={item} />) : (
                    <div className="text-center py-12">
                        <p className="text-lg" style={{ color: '#6B7280' }}>Новости не найдены</p>
                    </div>
                )}
            </div>
        </div>
    )
}
