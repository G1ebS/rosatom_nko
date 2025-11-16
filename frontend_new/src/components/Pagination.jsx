import React from 'react'

export default function Pagination({ currentPage, totalPages, onPageChange, itemsPerPage = 10, totalItems }) {
    if (totalPages <= 1) return null

    const pages = []
    const maxVisible = 5
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let endPage = Math.min(totalPages, startPage + maxVisible - 1)
    
    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
    }

    return (
        <div className="flex items-center justify-between mt-8">
            <div className="text-sm text-gray-600">
                Показано {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} из {totalItems}
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-modern border-2 border-gray-200 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:border-accent transition-all"
                >
                    Назад
                </button>
                
                {startPage > 1 && (
                    <>
                        <button
                            onClick={() => onPageChange(1)}
                            className="px-4 py-2 rounded-modern border-2 border-gray-200 text-sm font-semibold hover:border-accent transition-all"
                        >
                            1
                        </button>
                        {startPage > 2 && <span className="text-gray-400">...</span>}
                    </>
                )}

                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-4 py-2 rounded-modern text-sm font-semibold transition-all ${
                            currentPage === page
                                ? 'bg-gradient-primary text-white shadow-modern'
                                : 'border-2 border-gray-200 hover:border-accent'
                        }`}
                    >
                        {page}
                    </button>
                ))}

                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && <span className="text-gray-400">...</span>}
                        <button
                            onClick={() => onPageChange(totalPages)}
                            className="px-4 py-2 rounded-modern border-2 border-gray-200 text-sm font-semibold hover:border-accent transition-all"
                        >
                            {totalPages}
                        </button>
                    </>
                )}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-modern border-2 border-gray-200 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:border-accent transition-all"
                >
                    Вперёд
                </button>
            </div>
        </div>
    )
}

