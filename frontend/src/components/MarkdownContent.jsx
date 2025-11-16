import React from 'react'

export default function MarkdownContent({ content }) {
    if (!content) return null

    // Простой парсер markdown для основных элементов
    const parseMarkdown = (text) => {
        const lines = text.split('\n')
        const elements = []
        let currentParagraph = []
        let inList = false
        let listItems = []

        const flushParagraph = () => {
            if (currentParagraph.length > 0) {
                elements.push({
                    type: 'paragraph',
                    content: currentParagraph.join(' ')
                })
                currentParagraph = []
            }
        }

        const flushList = () => {
            if (listItems.length > 0) {
                elements.push({
                    type: 'ul',
                    items: listItems
                })
                listItems = []
                inList = false
            }
        }

        lines.forEach((line, index) => {
            const trimmed = line.trim()

            // Заголовки
            if (trimmed.startsWith('# ')) {
                flushParagraph()
                flushList()
                elements.push({
                    type: 'h1',
                    content: trimmed.substring(2)
                })
                return
            }
            if (trimmed.startsWith('## ')) {
                flushParagraph()
                flushList()
                elements.push({
                    type: 'h2',
                    content: trimmed.substring(3)
                })
                return
            }
            if (trimmed.startsWith('### ')) {
                flushParagraph()
                flushList()
                elements.push({
                    type: 'h3',
                    content: trimmed.substring(4)
                })
                return
            }

            // Списки
            if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                flushParagraph()
                inList = true
                const itemText = trimmed.substring(2).trim()
                // Обработка жирного текста в списках
                const processedText = itemText.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                listItems.push(processedText)
                return
            }

            // Жирный текст в строках
            if (trimmed.includes('**')) {
                flushList()
                currentParagraph.push(trimmed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'))
                return
            }

            // Обычный текст
            if (trimmed) {
                flushList()
                currentParagraph.push(trimmed)
            } else {
                flushParagraph()
                flushList()
            }
        })

        flushParagraph()
        flushList()

        return elements
    }

    const elements = parseMarkdown(content)

    return (
        <div className="markdown-content">
            {elements.map((element, index) => {
                switch (element.type) {
                    case 'h1':
                        return (
                            <h1 key={index} className="text-3xl font-bold text-primary mb-6 mt-8 first:mt-0 border-b-2 border-gray-200 pb-3">
                                {element.content}
                            </h1>
                        )
                    case 'h2':
                        return (
                            <h2 key={index} className="text-2xl font-bold text-primary mb-4 mt-8">
                                {element.content}
                            </h2>
                        )
                    case 'h3':
                        return (
                            <h3 key={index} className="text-xl font-semibold text-primary mb-3 mt-6">
                                {element.content}
                            </h3>
                        )
                    case 'paragraph':
                        return (
                            <p 
                                key={index} 
                                className="text-gray-700 mb-5 leading-7 text-base"
                                dangerouslySetInnerHTML={{ __html: element.content }}
                            />
                        )
                    case 'ul':
                        return (
                            <ul key={index} className="list-disc list-outside mb-5 space-y-2 text-gray-700 ml-6">
                                {element.items.map((item, itemIndex) => (
                                    <li 
                                        key={itemIndex} 
                                        className="leading-7"
                                        dangerouslySetInnerHTML={{ __html: item }}
                                    />
                                ))}
                            </ul>
                        )
                    default:
                        return null
                }
            })}
            <style>{`
                .markdown-content strong {
                    font-weight: 600;
                    color: #004AAD;
                }
                .markdown-content ul li {
                    margin-left: 0.5rem;
                }
            `}</style>
        </div>
    )
}

