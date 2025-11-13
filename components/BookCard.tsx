/**
 * Book Card Component
 * 
 * Displays a single book in the list with its details and action buttons.
 */

'use client'

import { useState } from 'react'
import { type Book } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'

interface BookCardProps {
  book: Book
  onDelete: (id: string) => void
}

export default function BookCard({ book, onDelete }: BookCardProps) {
  const [imageError, setImageError] = useState(false)

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${book.title}"?`)) {
      onDelete(book.id)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden card-hover border border-gray-100">
      <div className="p-6">
        <div className="flex gap-6">
          {/* Cover Image */}
          {book.cover_url && !imageError ? (
            <div className="flex-shrink-0">
              <div className="relative w-[120px] h-[180px] rounded-lg overflow-hidden shadow-md ring-2 ring-gray-100">
                <Image
                  src={book.cover_url}
                  alt={`${book.title} cover`}
                  width={120}
                  height={180}
                  className="object-cover w-full h-full"
                  onError={() => setImageError(true)}
                />
              </div>
            </div>
          ) : (
            <div className="flex-shrink-0 w-[120px] h-[180px] bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-gray-500 text-xs text-center px-2 font-medium">📚 No Cover</span>
            </div>
          )}

          {/* Book Details */}
          <div className="flex-1 min-w-0 flex flex-col">
            <h3 className="text-2xl font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
              {book.title}
            </h3>
            <p className="text-gray-600 mb-4 flex items-center gap-2">
              <span className="text-gray-400">✍️</span>
              <span className="font-medium text-gray-700">{book.author}</span>
            </p>
            
            {/* Tags */}
            {book.tags && book.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {book.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 text-xs font-semibold rounded-full border border-purple-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-auto pt-4">
              <Link
                href={`/edit/${book.id}`}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg transition-all duration-200"
              >
                ✏️ Edit
              </Link>
              <button
                onClick={handleDelete}
                className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold rounded-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-md hover:shadow-lg transition-all duration-200"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

