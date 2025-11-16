import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { ngos } from '../data/ngos'
import { getAIRecommendations, getSimpleRecommendations } from '../utils/aiRecommendations'
import { Link } from 'react-router-dom'
import Loader from './Loader'

export default function AIRecommendations() {
    const { user } = useAuth()
    const [recommendations, setRecommendations] = useState([])
    const [loading, setLoading] = useState(true)
    const [usingAI, setUsingAI] = useState(false)
    
    const loadRecommendations = useCallback(() => {
        if (!user) {
            setLoading(false)
            setRecommendations([])
            return
        }
        
        setLoading(true)
        
        // Небольшая задержка для визуального эффекта обновления
        setTimeout(() => {
            const userProfile = {
                interests: user.interests || ['Экология', 'Социальная поддержка'],
                city: user.city || 'Ангарск',
                activityHistory: user.activityHistory || [],
                favorites: user.favorites || []
            }
            
            // Используем простой алгоритм как основной (AI требует бэкенд-прокси из-за CORS)
            // Для использования AI см. BACKEND_AI_INTEGRATION.md
            const simpleRecs = getSimpleRecommendations(userProfile, ngos)
            if (simpleRecs && simpleRecs.length > 0) {
                setUsingAI(false)
                setRecommendations(simpleRecs)
            } else {
                setRecommendations(ngos.slice(0, 5))
            }
            setLoading(false)
            
            // Раскомментировать для использования AI через бэкенд:
            /*
            getAIRecommendations(userProfile, ngos)
                .then(recs => {
                    if (recs && recs.length > 0) {
                        // Проверяем, использовался ли AI (функция добавляет _usedAI флаг)
                        // Также проверяем по логам в консоли: "🤖 AI Recommendations: Using Hugging Face Neural Network"
                        const usedAI = recs._usedAI || false
                        setUsingAI(usedAI)
                        // Удаляем служебный флаг перед сохранением
                        if (recs._usedAI) delete recs._usedAI
                        setRecommendations(recs)
                    } else {
                        // Если AI вернул пустой результат, используем простой алгоритм
                        setUsingAI(false)
                        const simpleRecs = getSimpleRecommendations(userProfile, ngos)
                        if (simpleRecs && simpleRecs.length > 0) {
                            setRecommendations(simpleRecs)
                        } else {
                            // Последний fallback - показываем первые 5 НКО
                            setRecommendations(ngos.slice(0, 5))
                        }
                    }
                    setLoading(false)
                })
                .catch((error) => {
                    console.error('Error loading AI recommendations:', error)
                    setUsingAI(false)
                    // При ошибке AI используем простой алгоритм
                    try {
                        const simpleRecs = getSimpleRecommendations(userProfile, ngos)
                        if (simpleRecs && simpleRecs.length > 0) {
                            setRecommendations(simpleRecs)
                        } else {
                            setRecommendations(ngos.slice(0, 5))
                        }
                    } catch (fallbackError) {
                        console.error('Error in fallback algorithm:', fallbackError)
                        setRecommendations(ngos.slice(0, 5))
                    }
                    setLoading(false)
                })
            */
        }, 300) // 300ms задержка для визуального эффекта
    }, [user])
    
    useEffect(() => {
        loadRecommendations()
    }, [loadRecommendations])
    
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
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-2xl font-bold text-primary">Рекомендации для вас</h3>
                        {usingAI && (
                            <span className="px-2 py-1 text-xs font-semibold rounded-modern bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                AI
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-600">
                        {usingAI 
                            ? 'Подобрано с помощью нейронной сети' 
                            : 'Подобрано на основе ваших интересов'}
                    </p>
                </div>
                <button 
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        loadRecommendations()
                    }}
                    disabled={loading}
                    className="text-sm text-accent hover:text-accent-hover font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors px-3 py-2 rounded-modern hover:bg-accent/10 active:scale-95"
                    type="button"
                    aria-label="Обновить рекомендации"
                >
                    {loading ? (
                        <>
                            <Loader size="sm" />
                            <span>Обновление...</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>Обновить</span>
                        </>
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

