import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate, useLocation } from 'react-router-dom'

export default function ProtectedRoute({ children, requireAdmin = false }){
    const { user } = useAuth()
    const location = useLocation()
    
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }
    
    if (requireAdmin && !user.is_staff && !user.is_superuser) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="card text-center py-12">
                    <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-primary mb-2">Доступ запрещён</h2>
                    <p className="text-gray-600">У вас нет прав для доступа к этой странице</p>
                </div>
            </div>
        )
    }
    
    return children
}
