import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { materialAPI } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Button from '../components/Button'
import Loader from '../components/Loader'

export default function MaterialDetailsPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const { showToast } = useToast()
    const [material, setMaterial] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isSaved, setIsSaved] = useState(false)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        loadMaterial()
    }, [id])

    const loadMaterial = async () => {
        try {
            setLoading(true)
            const data = await materialAPI.getById(id)
            setMaterial(data)
            setIsSaved(data.is_saved || false)
            
            // Увеличиваем счетчик просмотров
            if (data.id) {
                try {
                    await materialAPI.incrementView(data.id)
                } catch (error) {
                    console.error('Failed to increment view:', error)
                }
            }
        } catch (error) {
            console.error('Failed to load material:', error)
            showToast('Ошибка при загрузке материала', 'error')
            navigate('/knowledge')
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        if (!user) {
            showToast('Войдите, чтобы сохранить материал', 'warning')
            return
        }

        setSaving(true)
        try {
            if (isSaved) {
                await materialAPI.unsave(material.id)
                setIsSaved(false)
                showToast('Материал удален из библиотеки', 'success')
            } else {
                await materialAPI.save(material.id)
                setIsSaved(true)
                showToast('Материал сохранен в библиотеку', 'success')
            }
        } catch (error) {
            console.error('Failed to toggle save:', error)
            showToast('Ошибка при сохранении материала', 'error')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader />
            </div>
        )
    }

    if (!material) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Материал не найден</p>
                <Link to="/knowledge" className="text-accent hover:text-accent-hover mt-4 inline-block">
                    Вернуться к базе знаний
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Кнопка назад */}
            <Link 
                to="/knowledge" 
                className="inline-flex items-center gap-2 text-gray-600 hover:text-accent mb-6 transition-colors"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Назад к базе знаний
            </Link>

            <div className="card">
                {/* Заголовок */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-primary mb-4">{material.title}</h1>
                    
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                        {material.course && (
                            <span className="inline-block px-3 py-1 text-sm font-semibold rounded-modern bg-gradient-to-r from-accent-100 to-accent-200 text-accent-700">
                                {material.course}
                            </span>
                        )}
                        {material.author && (
                            <span className="text-sm text-gray-600">
                                <span className="font-semibold">Автор:</span> {material.author}
                            </span>
                        )}
                        {material.views_count !== undefined && (
                            <span className="text-sm text-gray-600">
                                👁 {material.views_count} просмотров
                            </span>
                        )}
                    </div>

                    {/* Теги */}
                    {material.tags && material.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {material.tags.map(tag => (
                                <span 
                                    key={tag.id || tag.name}
                                    className="px-2 py-1 text-xs font-medium rounded-modern bg-gray-100 text-gray-700"
                                >
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Описание */}
                {material.description && (
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-primary mb-3">Описание</h2>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {material.description}
                        </p>
                    </div>
                )}

                {/* Ссылка на материал */}
                {material.url && (
                    <div className="mb-6 p-4 bg-accent/10 rounded-modern">
                        <a 
                            href={material.url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-accent hover:text-accent-hover font-semibold inline-flex items-center gap-2"
                        >
                            Открыть материал
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </div>
                )}

                {/* Действия */}
                <div className="flex gap-3 pt-6 border-t border-gray-200">
                    {user && (
                        <Button
                            variant={isSaved ? 'accent' : 'outline'}
                            onClick={handleSave}
                            disabled={saving}
                            icon={
                                <svg className="w-5 h-5" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                            }
                            ariaLabel={isSaved ? "Удалить из библиотеки" : "Сохранить в библиотеку"}
                        >
                            {isSaved ? 'В библиотеке' : 'Сохранить в библиотеку'}
                        </Button>
                    )}
                </div>

                {/* Метаинформация */}
                <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-500">
                    {material.created_at && (
                        <p>Добавлено: {new Date(material.created_at).toLocaleDateString('ru-RU', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</p>
                    )}
                </div>
            </div>
        </div>
    )
}


