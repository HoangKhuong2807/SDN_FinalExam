/**
 * Reusable Book Form Component
 * 
 * This component can be used for both creating and editing books.
 * It accepts an optional book prop for editing mode.
 */

'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { type Book } from '@/lib/supabase'
import { createBook, updateBook } from '@/app/actions/books'

interface BookFormProps {
  book?: Book | null
  bookId?: string
}

export default function BookForm({ book, bookId }: BookFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize form state with book data if editing, or empty if creating
  const [formData, setFormData] = useState({
    title: book?.title || '',
    author: book?.author || '',
    tags: book?.tags?.join(', ') || '',
    cover_url: book?.cover_url || '',
  })

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      // Validate required fields
      if (!formData.title.trim() || !formData.author.trim()) {
        throw new Error('Title and author are required')
      }

      // Convert tags string to array
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      // Call the appropriate server action
      if (bookId) {
        await updateBook(bookId, {
          title: formData.title.trim(),
          author: formData.author.trim(),
          tags: tagsArray,
          cover_url: formData.cover_url.trim() || null,
        })
      } else {
        await createBook({
          title: formData.title.trim(),
          author: formData.author.trim(),
          tags: tagsArray,
          cover_url: formData.cover_url.trim() || null,
        })
      }

      // Redirect to home page after successful submission
      router.push('/')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save book')
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-5 py-4 rounded-xl shadow-md flex items-center gap-2">
          <span className="text-xl">⚠️</span>
          <span className="font-medium">{error}</span>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <span>📖</span> Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-gray-900"
          placeholder="Enter book title"
        />
      </div>

      <div>
        <label htmlFor="author" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <span>✍️</span> Author <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="author"
          required
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-gray-900"
          placeholder="Enter author name"
        />
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <span>🏷️</span> Tags (comma-separated)
        </label>
        <input
          type="text"
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-gray-900"
          placeholder="e.g., IT, Programming, Fiction"
        />
        <p className="mt-2 text-sm text-gray-500 flex items-center gap-1">
          <span>💡</span> Separate multiple tags with commas
        </p>
      </div>

      <div>
        <label htmlFor="cover_url" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <span>🖼️</span> Cover Image URL
        </label>
        <input
          type="url"
          id="cover_url"
          value={formData.cover_url}
          onChange={(e) => setFormData({ ...formData, cover_url: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-gray-900"
          placeholder="https://example.com/book-cover.jpg"
        />
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none"
        >
          {isSubmitting ? '⏳ Saving...' : book ? '💾 Update Book' : '✨ Create Book'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/')}
          className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

