import React from 'react'

/**
 * Компонент логотипа Росатома
 * @param {string} variant - 'default' (цветной), 'white' (белый для футера), 'symbol' (только символ)
 * @param {string} className - Дополнительные CSS классы
 * @param {number} height - Высота логотипа в пикселях
 * @param {boolean} useOfficial - Использовать официальные SVG файлы из public/logos (по умолчанию false - встроенный SVG)
 */
export default function RosatomLogo({ 
    variant = 'default', 
    className = '', 
    height = 32,
    useOfficial = true  // По умолчанию используем официальные логотипы
}) {
    // Если используется официальный файл, возвращаем img с соответствующим файлом
    if (useOfficial) {
        // Пробуем разные форматы файлов
        const getLogoPath = (baseName) => {
            // Сначала пробуем SVG, потом PNG
            const formats = ['svg', 'png']
            for (const format of formats) {
                const path = `/logos/${baseName}.${format}`
                // В продакшене можно проверить существование файла
                return path
            }
            return `/logos/${baseName}.svg` // fallback
        }
        
        let logoPath = '/logos/rosatom-logo-full.svg'
        
        if (variant === 'white') {
            logoPath = '/logos/rosatom-logo-white.svg'
        } else if (variant === 'symbol') {
            logoPath = '/logos/rosatom-logo-symbol.svg'
        } else if (variant === 'symbol-white') {
            logoPath = '/logos/rosatom-logo-symbol-white.svg'
        }
        
        // Для горизонтальных логотипов сохраняем пропорции
        const isHorizontal = variant === 'default' || variant === 'white'
        // Пропорции из viewBox официального логотипа: width=1407.42629, height=283.46457
        const aspectRatio = isHorizontal ? 1407.42629 / 283.46457 : 1
        const calculatedWidth = isHorizontal ? height * aspectRatio : height
        
        return (
            <img 
                src={logoPath} 
                alt="Росатом" 
                className={className}
                style={{ 
                    height: `${height}px`, 
                    width: `${calculatedWidth}px`,
                    minWidth: `${calculatedWidth}px`,
                    maxWidth: 'none',
                    objectFit: 'contain',
                    objectPosition: 'left center',
                    display: 'block',
                    flexShrink: 0,
                    verticalAlign: 'middle'
                }}
                onError={(e) => {
                    // Если SVG не найден, пробуем PNG
                    if (logoPath.endsWith('.svg')) {
                        e.target.src = logoPath.replace('.svg', '.png')
                    }
                }}
            />
        )
    }
    
    // Встроенный SVG (fallback, если официальные файлы не загрузились)
    const isWhite = variant === 'white' || variant === 'symbol-white'
    const isSymbolOnly = variant === 'symbol' || variant === 'symbol-white'
    const textColor = isWhite ? '#FFFFFF' : '#1a2165'
    const atomColor = isWhite ? '#FFFFFF' : '#1a2165'
    // Убираем зеленый цвет, используем только синие градиенты как в официальном логотипе
    const accentColor = isWhite ? '#FFFFFF' : '#4896d2'
    
    const scale = height / 40
    const width = isSymbolOnly ? height : 150 * scale
    
    return (
        <svg 
            width={width} 
            height={height} 
            viewBox={isSymbolOnly ? "0 0 60 60" : "0 0 150 40"} 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Символ атома */}
            <g>
                {/* Ядро атома */}
                <circle 
                    cx={isSymbolOnly ? "30" : "20"} 
                    cy={isSymbolOnly ? "30" : "20"} 
                    r={isSymbolOnly ? "5" : "4.5"} 
                    fill={atomColor} 
                />
                
                {/* Орбиты электронов - три эллипса под углом 60° */}
                <ellipse 
                    cx={isSymbolOnly ? "30" : "20"} 
                    cy={isSymbolOnly ? "30" : "20"} 
                    rx={isSymbolOnly ? "18" : "14"} 
                    ry={isSymbolOnly ? "9" : "7"} 
                    stroke={atomColor} 
                    strokeWidth={isSymbolOnly ? "2" : "1.8"} 
                    fill="none" 
                    opacity={isWhite ? 0.85 : (isSymbolOnly ? 0.6 : 0.5)}
                />
                <ellipse 
                    cx={isSymbolOnly ? "30" : "20"} 
                    cy={isSymbolOnly ? "30" : "20"} 
                    rx={isSymbolOnly ? "18" : "14"} 
                    ry={isSymbolOnly ? "9" : "7"} 
                    stroke={atomColor} 
                    strokeWidth={isSymbolOnly ? "2" : "1.8"} 
                    fill="none" 
                    opacity={isWhite ? 0.85 : (isSymbolOnly ? 0.6 : 0.5)}
                    transform={`rotate(60 ${isSymbolOnly ? "30 30" : "20 20"})`}
                />
                <ellipse 
                    cx={isSymbolOnly ? "30" : "20"} 
                    cy={isSymbolOnly ? "30" : "20"} 
                    rx={isSymbolOnly ? "18" : "14"} 
                    ry={isSymbolOnly ? "9" : "7"} 
                    stroke={atomColor} 
                    strokeWidth={isSymbolOnly ? "2" : "1.8"} 
                    fill="none" 
                    opacity={isWhite ? 0.85 : (isSymbolOnly ? 0.6 : 0.5)}
                    transform={`rotate(120 ${isSymbolOnly ? "30 30" : "20 20"})`}
                />
                
                {/* Электроны на орбитах */}
                {isSymbolOnly ? (
                    <>
                        <circle cx="48" cy="30" r="3" fill={accentColor} />
                        <circle cx="12" cy="30" r="3" fill={accentColor} />
                        <circle cx="30" cy="12" r="3" fill={accentColor} />
                        <circle cx="30" cy="48" r="3" fill={accentColor} />
                        <circle cx="39" cy="15" r="3" fill={accentColor} />
                        <circle cx="21" cy="45" r="3" fill={accentColor} />
                    </>
                ) : (
                    <>
                <circle cx="34" cy="20" r="2.5" fill={accentColor} />
                <circle cx="6" cy="20" r="2.5" fill={accentColor} />
                <circle cx="20" cy="6" r="2.5" fill={accentColor} />
                <circle cx="20" cy="34" r="2.5" fill={accentColor} />
                <circle cx="27" cy="11" r="2.5" fill={accentColor} />
                <circle cx="13" cy="29" r="2.5" fill={accentColor} />
                    </>
                )}
            </g>
            
            {/* Текст "РОСАТОМ" - только если не символ */}
            {!isSymbolOnly && (
            <text 
                x="48" 
                y="27" 
                fontFamily="'Arial', 'Helvetica', sans-serif" 
                fontSize="22" 
                fontWeight="700" 
                fill={textColor}
                letterSpacing="1px"
            >
                РОСАТОМ
            </text>
            )}
        </svg>
    )
}

