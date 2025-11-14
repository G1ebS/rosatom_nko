import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { CityProvider } from './context/CityContext'
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <CityProvider>
                <App />
            </CityProvider>
        </AuthProvider>
    </React.StrictMode>
)
