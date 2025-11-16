import React, { createContext, useState, useContext } from 'react'

const CityContext = createContext()
export const useCity = () => useContext(CityContext)

export const CityProvider = ({ children }) => {
    const [city, setCity] = useState('Ангарск') // дефолт из списка
    return (
        <CityContext.Provider value={{ city, setCity }}>
            {children}
        </CityContext.Provider>
    )
}
