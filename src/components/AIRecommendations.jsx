import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { ngos } from '../data/ngos'
import { getAIRecommendations, getSimpleRecommendations } from '../utils/aiRecommendations'
import { Link } from 'react-router-dom'
import Loader from './Loader'

export default function AIRecommendations() {
    const { user } = useAuth()
    const [recommendations, setRecommendations] = useState([])
    const [loading, setLoading] = useState(true)
    
    const loadRecommendations = () => {
        if (!user) {
            setLoading(false)
            return
        }
        
        setLoading(true)
        const userProfile = {
            interests: user.interests || ['Экология', 'Социальная поддержка'],
            city: user.city || 'Ангарск',
            activityHistory: user.activityHistory || [],
            favorites: user.favorites || []
        }
        
        // Пробуем AI, если не работает - используем простой алгоритм
        getAIRecommendations(userProfile, ngos)
            .then(recs => {
                setRecommendations(recs)
                setLoading(false)
            })
            .catch(() => {
                // Fallback на простой алгоритм
                const simpleRecs = getSimpleRecommendations(userProfile, ngos)
                setRecommendations(simpleRecs)
                setLoading(false)
            })
    }
    
    useEffect(() => {
        loadRecommendations()
    }, [user])
    
    if (!user) {
        return (
            <div className="card text-center py-8">
                <p className="text-gray-500">Войдите, чтобы получить персональные рекомендации</p>
            </div>
        )
    }
    
    return (
        <div className="card">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-2xl font-bold text-primary mb-2">Рекомендации для вас</h3>
                    <p className="text-sm text-gray-600">На основе ваших интересов и активности</p>
                </div>
                <button 
                    onClick={loadRecommendations}
                    disabled={loading}
                    className="text-sm text-accent hover:text-accent-hover font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                >
                    {loading ? (
                        <>
                            <Loader size="sm" />
                            <span>Обновление...</span>
                        </>
                    ) : (
                        'Обновить'
                    )}
                </button>
            </div>
            
            {loading ? (
                <div className="text-center py-12">
                    <Loader size="md" className="mx-auto mb-4" />
                    <p className="text-gray-500">Загрузка рекомендаций...</p>
                </div>
            ) : recommendations.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">Рекомендации будут доступны после анализа ваших интересов</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {recommendations.map(ngo => (
                        <Link 
                            key={ngo.id}
                            to={`/ngos/${ngo.id}`}
                            className="block p-4 bg-gradient-soft rounded-modern hover:shadow-sm transition-all group"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <h4 className="font-bold text-primary mb-1 group-hover:text-accent transition-colors duration-200">
                                        {ngo.name}
                                    </h4>
                                    <p className="text-sm text-gray-600 mb-2">{ngo.short_description}</p>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-1 text-xs font-semibold rounded-modern bg-accent/10 text-accent">
                                            {ngo.category}
                                        </span>
                                        <span className="text-xs text-gray-500">{ngo.city}</span>
                                    </div>
                                </div>
                                <svg className="w-5 h-5 text-gray-400 group-hover:text-accent transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}

