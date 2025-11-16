import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import HomePage from './pages/HomePage'
import NGOListPage from './pages/NGOListPage'
import NGODetailsPage from './pages/NGODetailsPage'
import CalendarPage from './pages/CalendarPage'
import EventDetailsPage from './pages/EventDetailsPage'
import NewsPage from './pages/NewsPage'
import NewsDetailsPage from './pages/NewsDetailsPage'
import KnowledgeBasePage from './pages/KnowledgeBasePage'
import MaterialDetailsPage from './pages/MaterialDetailsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import AdminPage from './pages/AdminPage'
import { useAuth } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import ProtectedRoute from './components/ProtectedRoute'

export default function App(){
    const { user } = useAuth()
    return (
        <ToastProvider>
            <BrowserRouter>
                <ScrollToTop />
                <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-1 container mx-auto p-4">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/ngos" element={<NGOListPage />} />
                            <Route path="/ngos/:id" element={<NGODetailsPage />} />
                            <Route path="/calendar" element={<CalendarPage />} />
                            <Route path="/events/:id" element={<EventDetailsPage />} />
                            <Route path="/news" element={<NewsPage />} />
                            <Route path="/news/:id" element={<NewsDetailsPage />} />
                            <Route path="/knowledge" element={<KnowledgeBasePage />} />
                            <Route path="/materials/:id" element={<MaterialDetailsPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/profile" element={
                                <ProtectedRoute>
                                    <ProfilePage />
                                </ProtectedRoute>
                            } />
                            <Route path="/admin" element={
                                <ProtectedRoute>
                                    <AdminPage />
                                </ProtectedRoute>
                            } />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </BrowserRouter>
        </ToastProvider>
    )
}
