import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

export default function CustomDropdown({ options, value, onChange, placeholder = "Выберите...", className = "" }) {
    const [isOpen, setIsOpen] = useState(false)
    const [openUpward, setOpenUpward] = useState(false)
    const [menuStyle, setMenuStyle] = useState({})
    const dropdownRef = useRef(null)
    const buttonRef = useRef(null)
    const menuRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
                menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
            return () => document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const updatePosition = () => {
                if (!buttonRef.current) return
                
                const buttonRect = buttonRef.current.getBoundingClientRect()
                const spaceBelow = window.innerHeight - buttonRect.bottom
                const spaceAbove = buttonRect.top
                const estimatedMenuHeight = Math.min(240, options.length * 48)
                
                const shouldOpenUpward = spaceBelow < estimatedMenuHeight + 20 && spaceAbove > estimatedMenuHeight + 20
                setOpenUpward(shouldOpenUpward)
                
                setMenuStyle({
                    position: 'fixed',
                    width: `${buttonRect.width}px`,
                    left: `${buttonRect.left}px`,
                    top: shouldOpenUpward ? 'auto' : `${buttonRect.bottom + 8}px`,
                    bottom: shouldOpenUpward ? `${window.innerHeight - buttonRect.top + 8}px` : 'auto',
                    zIndex: 99999,
                    maxWidth: 'calc(100vw - 32px)'
                })
            }

            updatePosition()
            
            const handleScroll = () => updatePosition()
            const handleResize = () => updatePosition()

            window.addEventListener('scroll', handleScroll, true)
            window.addEventListener('resize', handleResize)
            
            return () => {
                window.removeEventListener('scroll', handleScroll, true)
                window.removeEventListener('resize', handleResize)
            }
        }
    }, [isOpen, options.length])

    const selectedOption = options.find(opt => opt.value === value) || options[0]

    const menuContent = isOpen ? (
        <div 
            ref={menuRef}
            className="bg-white rounded-modern shadow-floating border border-gray-100 overflow-hidden scale-in"
            style={menuStyle}
        >
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
    ) : null

    return (
        <div className={`relative w-full ${className}`} ref={dropdownRef}>
            <button
                ref={buttonRef}
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

            {typeof document !== 'undefined' && createPortal(menuContent, document.body)}
        </div>
    )
}

