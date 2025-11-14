import React, { useState, useRef, useEffect } from 'react'

export default function CustomDropdown({ options, value, onChange, placeholder = "Выберите...", className = "" }) {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const selectedOption = options.find(opt => opt.value === value) || options[0]

    return (
        <div className={`relative w-full ${className}`} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-white border-2 border-gray-200 rounded-modern text-left text-sm font-medium text-gray-700 hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-300 cursor-pointer"
            >
                <span className="truncate flex-1 text-left min-w-0">{selectedOption?.label || placeholder}</span>
                <svg 
                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute z-[99999] w-full mt-2 bg-white rounded-modern shadow-floating border border-gray-100 overflow-hidden scale-in">
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value)
                                    setIsOpen(false)
                                }}
                                className={`w-full flex items-center justify-between px-4 py-3 text-left text-sm transition-all duration-200 ${
                                    value === option.value
                                        ? 'bg-gradient-to-r from-accent-50 to-primary-50 text-primary font-semibold'
                                        : 'text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <span className="truncate flex-1 text-left min-w-0">{option.label}</span>
                                {value === option.value && (
                                    <svg className="w-5 h-5 ml-auto text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

