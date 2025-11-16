import React from 'react'
import { Link } from 'react-router-dom'
import Loader from './Loader'

const Button = ({
    children,
    variant = 'primary', // primary, outline, accent, danger
    size = 'md', // sm, md, lg
    type = 'button',
    onClick,
    disabled = false,
    loading = false,
    fullWidth = false,
    icon,
    iconPosition = 'left', // left, right
    ariaLabel,
    className = '',
    href,
    target,
    rel,
    ...props
}) => {
    const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold rounded-modern transition-all duration-200 ease-out focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-accent/30'
    
    const sizeClasses = {
        sm: 'px-4 py-2 text-sm min-h-[36px]',
        md: 'px-6 py-3 text-base min-h-[44px]',
        lg: 'px-8 py-4 text-lg min-h-[52px]'
    }
    
    const variantClasses = {
        primary: 'bg-primary text-white shadow-modern hover:bg-primary-600 hover:shadow-lg active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none',
        outline: 'border-2 border-primary text-primary bg-white hover:bg-primary hover:text-white active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed',
        'outline-accent': 'border-2 border-accent text-accent bg-white hover:bg-accent hover:text-white active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed',
        accent: 'bg-accent text-white shadow-modern hover:bg-accent-hover hover:shadow-lg active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none',
        danger: 'bg-danger text-white shadow-sm hover:bg-danger-hover hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none'
    }
    
    const widthClass = fullWidth ? 'w-full' : ''
    
    const isDisabled = disabled || loading
    
    const buttonClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className}`
    
    // Если есть href, рендерим как ссылку
    if (href) {
        // Внутренние ссылки (начинаются с /) используем Link, внешние - обычный <a>
        const isInternalLink = href.startsWith('/')
        
        if (isInternalLink) {
            return (
                <Link
                    to={href}
                    className={buttonClasses}
                    aria-label={ariaLabel}
                    {...props}
                >
                    {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
                    <span>{children}</span>
                    {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
                </Link>
            )
        } else {
            return (
                <a
                    href={href}
                    target={target}
                    rel={rel}
                    className={buttonClasses}
                    aria-label={ariaLabel}
                    {...props}
                >
                    {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
                    <span>{children}</span>
                    {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
                </a>
            )
        }
    }
    
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            aria-label={ariaLabel}
            className={buttonClasses}
            {...props}
        >
            {loading ? (
                <>
                    <Loader size="sm" />
                    <span className="opacity-0">{children}</span>
                </>
            ) : (
                <>
                    {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
                    <span>{children}</span>
                    {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
                </>
            )}
        </button>
    )
}

export default Button

