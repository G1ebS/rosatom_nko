# 🛠️ Готовые компоненты для улучшения UI

## 1. Универсальный компонент Button

### `src/components/Button.jsx`

```javascript
import React from 'react'
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
    ...props
}) => {
    const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold rounded-modern transition-all duration-200 ease-out focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-accent/30'
    
    const sizeClasses = {
        sm: 'px-4 py-2 text-sm min-h-[36px]',
        md: 'px-6 py-3 text-base min-h-[44px]',
        lg: 'px-8 py-4 text-lg min-h-[52px]'
    }
    
    const variantClasses = {
        primary: 'bg-gradient-to-r from-primary to-primary-600 text-white shadow-modern hover:shadow-lg hover:from-primary-600 hover:to-primary-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none',
        outline: 'border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white hover:border-primary-600 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed',
        accent: 'bg-gradient-to-r from-accent to-accent-600 text-white shadow-modern hover:shadow-lg hover:from-accent-600 hover:to-accent-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed',
        danger: 'bg-danger text-white shadow-sm hover:bg-danger-hover hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed'
    }
    
    const widthClass = fullWidth ? 'w-full' : ''
    
    const isDisabled = disabled || loading
    
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            aria-label={ariaLabel}
            className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className}`}
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
```

### Использование:

```javascript
<Button variant="primary" size="lg" onClick={handleClick}>
    Найти НКО
</Button>

<Button variant="outline" loading={isSubmitting} disabled={!isValid}>
    Отправить
</Button>

<Button 
    variant="accent" 
    icon={<HeartIcon />} 
    iconPosition="right"
    ariaLabel="Добавить в избранное"
>
    В избранное
</Button>
```

---

## 2. Toast-система для уведомлений

### `src/context/ToastContext.jsx`

```javascript
import React, { createContext, useContext, useState, useCallback } from 'react'
import Toast from '../components/Toast'

const ToastContext = createContext()

export const useToast = () => {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within ToastProvider')
    }
    return context
}

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([])

    const showToast = useCallback((message, type = 'success', duration = 3000) => {
        const id = Date.now()
        const toast = { id, message, type }
        
        setToasts(prev => [...prev, toast])
        
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id))
        }, duration)
    }, [])

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    return (
        <ToastContext.Provider value={{ showToast, removeToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-[10000] space-y-2">
                {toasts.map(toast => (
                    <Toast 
                        key={toast.id} 
                        {...toast} 
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    )
}
```

### `src/components/Toast.jsx`

```javascript
import React, { useEffect } from 'react'

const Toast = ({ id, message, type = 'success', onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose()
        }, duration)
        return () => clearTimeout(timer)
    }, [duration, onClose])

    const typeStyles = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        warning: 'bg-yellow-500 text-white',
        info: 'bg-blue-500 text-white'
    }

    const icons = {
        success: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
        ),
        error: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        ),
        warning: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
        info: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    }

    return (
        <div 
            className={`${typeStyles[type]} rounded-modern shadow-floating p-4 flex items-center gap-3 min-w-[300px] max-w-[400px] slide-in-right animate-fade-in-up`}
            role="alert"
            aria-live="polite"
        >
            <div className="flex-shrink-0">
                {icons[type]}
            </div>
            <div className="flex-1 text-sm font-medium">
                {message}
            </div>
            <button
                onClick={onClose}
                className="flex-shrink-0 hover:opacity-80 transition-opacity"
                aria-label="Закрыть уведомление"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    )
}

export default Toast
```

### Использование:

```javascript
// В App.js обернуть приложение
<ToastProvider>
    <App />
</ToastProvider>

// В компонентах
const { showToast } = useToast()

const handleSubmit = async () => {
    try {
        await api.post('/contact', data)
        showToast('Сообщение успешно отправлено!', 'success')
    } catch (error) {
        showToast('Ошибка отправки сообщения', 'error')
    }
}
```

---

## 3. Хук для работы с формами

### `src/hooks/useForm.js`

```javascript
import { useState, useCallback } from 'react'

export const useForm = (initialValues = {}, onSubmit) => {
    const [values, setValues] = useState(initialValues)
    const [errors, setErrors] = useState({})
    const [touched, setTouched] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target
        setValues(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
        
        // Очистка ошибки при изменении
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }))
        }
    }, [errors])

    const handleBlur = useCallback((e) => {
        const { name } = e.target
        setTouched(prev => ({
            ...prev,
            [name]: true
        }))
    }, [])

    const validate = useCallback((validationRules) => {
        const newErrors = {}
        
        Object.keys(validationRules).forEach(field => {
            const rules = validationRules[field]
            const value = values[field]
            
            if (rules.required && !value) {
                newErrors[field] = rules.required
            } else if (rules.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                newErrors[field] = rules.email
            } else if (rules.minLength && value && value.length < rules.minLength) {
                newErrors[field] = rules.minLength
            } else if (rules.validate && typeof rules.validate === 'function') {
                const error = rules.validate(value)
                if (error) newErrors[field] = error
            }
        })
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }, [values])

    const handleSubmit = useCallback(async (e) => {
        e?.preventDefault()
        
        if (onSubmit) {
            setIsSubmitting(true)
            try {
                await onSubmit(values)
            } catch (error) {
                console.error('Form submission error:', error)
            } finally {
                setIsSubmitting(false)
            }
        }
    }, [values, onSubmit])

    const reset = useCallback(() => {
        setValues(initialValues)
        setErrors({})
        setTouched({})
        setIsSubmitting(false)
    }, [initialValues])

    return {
        values,
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        validate,
        reset,
        setValues,
        setErrors
    }
}
```

### Использование:

```javascript
const { 
    values, 
    errors, 
    touched, 
    isSubmitting, 
    handleChange, 
    handleBlur, 
    handleSubmit 
} = useForm(
    { name: '', email: '', message: '' },
    async (formValues) => {
        await api.post('/contact', formValues)
        showToast('Сообщение отправлено!', 'success')
    }
)

return (
    <form onSubmit={handleSubmit}>
        <input
            name="name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={touched.name && errors.name ? 'border-red-500' : ''}
        />
        {touched.name && errors.name && (
            <span className="text-red-500 text-sm">{errors.name}</span>
        )}
        <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
            Отправить
        </Button>
    </form>
)
```

---

## 4. Компонент LoadingButton

### `src/components/LoadingButton.jsx`

```javascript
import React from 'react'
import Button from './Button'
import Loader from './Loader'

const LoadingButton = ({ 
    children, 
    loading, 
    loadingText = 'Загрузка...',
    ...props 
}) => {
    return (
        <Button 
            {...props} 
            disabled={loading || props.disabled}
            loading={loading}
        >
            {loading ? (
                <>
                    <Loader size="sm" />
                    {loadingText}
                </>
            ) : (
                children
            )}
        </Button>
    )
}

export default LoadingButton
```

---

## 5. Улучшенный компонент Input

### `src/components/Input.jsx`

```javascript
import React from 'react'

const Input = ({
    label,
    name,
    type = 'text',
    value,
    onChange,
    onBlur,
    error,
    touched,
    placeholder,
    required = false,
    disabled = false,
    icon,
    className = '',
    ...props
}) => {
    const hasError = touched && error
    
    return (
        <div className="w-full">
            {label && (
                <label 
                    htmlFor={name}
                    className="block text-sm font-semibold text-gray-700 mb-2"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                        {icon}
                    </div>
                )}
                <input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    className={`
                        w-full border-2 rounded-modern px-4 py-3
                        ${icon ? 'pl-12' : 'pl-4'}
                        text-sm
                        focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent
                        transition-all duration-200
                        ${hasError 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' 
                            : 'border-gray-200 hover:border-accent'
                        }
                        ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
                        ${className}
                    `}
                    aria-invalid={hasError}
                    aria-describedby={hasError ? `${name}-error` : undefined}
                    {...props}
                />
            </div>
            {hasError && (
                <p 
                    id={`${name}-error`}
                    className="mt-1 text-sm text-red-500"
                    role="alert"
                >
                    {error}
                </p>
            )}
        </div>
    )
}

export default Input
```

---

## 6. Обновленные стили для кнопок

### Добавить в `src/index.css`

```css
/* Улучшенные кнопки с ripple эффектом */
.btn-primary,
.btn-outline,
.btn-accent,
.btn-danger {
    position: relative;
    overflow: hidden;
    min-height: 44px; /* Минимум для touch */
    min-width: 44px;
}

/* Ripple эффект */
.btn-primary::after,
.btn-outline::after,
.btn-accent::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
}

.btn-primary:active::after,
.btn-outline:active::after,
.btn-accent:active::after {
    width: 300px;
    height: 300px;
}

/* Улучшенный focus */
.btn-primary:focus-visible,
.btn-outline:focus-visible,
.btn-accent:focus-visible {
    outline: 2px solid #00D4AA;
    outline-offset: 3px;
    box-shadow: 0 0 0 4px rgba(0, 212, 170, 0.1);
}

/* Disabled состояние */
.btn-primary:disabled,
.btn-outline:disabled,
.btn-accent:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
}

/* Loading состояние */
.btn-primary.loading,
.btn-outline.loading,
.btn-accent.loading {
    color: transparent;
    pointer-events: none;
}

.btn-primary.loading::before,
.btn-outline.loading::before,
.btn-accent.loading::before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

/* Адаптивность для мобильных */
@media (max-width: 640px) {
    .btn-primary,
    .btn-outline,
    .btn-accent {
        width: 100%;
        min-height: 48px;
        font-size: 16px; /* Предотвращает zoom на iOS */
    }
}
```

---

## 7. Пример использования всех компонентов вместе

### `src/pages/NGODetailsPage.jsx` (улучшенная версия)

```javascript
import React from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useForm } from '../hooks/useForm'
import Button from '../components/Button'
import Input from '../components/Input'
import { api } from '../utils/api'

export default function NGODetailsPage() {
    const { id } = useParams()
    const { user, login } = useAuth()
    const { showToast } = useToast()
    const ngo = ngos.find(n => String(n.id) === id)

    const { 
        values, 
        errors, 
        touched, 
        isSubmitting, 
        handleChange, 
        handleBlur, 
        handleSubmit,
        reset
    } = useForm(
        { name: '', email: '', message: '' },
        async (formValues) => {
            try {
                await api.post('/contact', { ngo_id: ngo.id, ...formValues })
                showToast('Сообщение успешно отправлено!', 'success')
                reset()
            } catch (error) {
                showToast('Ошибка отправки сообщения', 'error')
            }
        }
    )

    const toggleFavorite = async () => {
        if (!user) {
            showToast('Войдите, чтобы добавить в избранное', 'warning')
            return
        }

        try {
            const isFavorite = user.favorites?.includes(ngo.id)
            if (isFavorite) {
                await api.delete(`/ngos/${ngo.id}/favorite`)
            } else {
                await api.post(`/ngos/${ngo.id}/favorite`)
            }
            
            const updatedUser = await api.get('/auth/me')
            login(localStorage.getItem('jwt'), updatedUser)
            showToast(
                isFavorite ? 'Удалено из избранного' : 'Добавлено в избранное',
                'success'
            )
        } catch (error) {
            showToast('Ошибка обновления избранного', 'error')
        }
    }

    const isFavorite = user?.favorites?.includes(ngo.id)

    return (
        <div className="max-w-4xl">
            {/* ... остальной контент ... */}

            {/* Улучшенная форма контакта */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Ваше имя"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.name}
                    touched={touched.name}
                    placeholder="Иван Иванов"
                    required
                />
                <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.email}
                    touched={touched.email}
                    placeholder="ivan@example.com"
                    required
                />
                <Input
                    label="Сообщение"
                    name="message"
                    type="textarea"
                    value={values.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.message}
                    touched={touched.message}
                    placeholder="Ваше сообщение..."
                    required
                />
                <Button 
                    type="submit" 
                    variant="primary" 
                    fullWidth
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    ariaLabel="Отправить сообщение"
                >
                    Отправить сообщение
                </Button>
            </form>

            {/* Улучшенные кнопки действий */}
            <div className="flex flex-wrap gap-3 mt-6">
                <Button
                    variant={isFavorite ? 'accent' : 'outline'}
                    onClick={toggleFavorite}
                    icon={isFavorite ? <HeartFilledIcon /> : <HeartIcon />}
                    ariaLabel={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
                >
                    {isFavorite ? 'В избранном' : 'В избранное'}
                </Button>
                {ngo.website && (
                    <Button
                        variant="primary"
                        href={ngo.website}
                        target="_blank"
                        rel="noreferrer"
                        ariaLabel="Перейти на сайт НКО"
                    >
                        Перейти на сайт
                    </Button>
                )}
            </div>
        </div>
    )
}
```

---

## 8. Чеклист внедрения

- [ ] Создать компонент `Button.jsx`
- [ ] Создать `ToastContext.jsx` и `Toast.jsx`
- [ ] Обернуть App в `ToastProvider`
- [ ] Создать хук `useForm.js`
- [ ] Создать компонент `Input.jsx`
- [ ] Обновить стили в `index.css`
- [ ] Заменить все кнопки на новый компонент Button
- [ ] Добавить обработчики для всех форм
- [ ] Добавить aria-labels для всех кнопок
- [ ] Протестировать на мобильных устройствах
- [ ] Проверить accessibility через Lighthouse

