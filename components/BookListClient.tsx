/**
 * Client Component for Book List
 * 
 * Handles client-side interactivity: search, filter, and sort.
 */

'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { type Book } from '@/lib/supabase'
import { deleteBook } from '@/app/actions/books'
import BookCard from './BookCard'
import Link from 'next/link'

interface BookListClientProps {
  initialBooks: Book[]
}

export default function BookListClient({ initialBooks }: BookListClientProps) {
  const router = useRouter()
  const [books] = useState<Book[]>(initialBooks)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  // Get all unique tags from books
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    books.forEach(book => {
      if (book.tags) {
        book.tags.forEach(tag => tags.add(tag))
      }
    })
    return Array.from(tags).sort()
  }, [books])

  // Filter and sort books
  const filteredAndSortedBooks = useMemo(() => {
    let filtered = books

    // Filter by search query (case-insensitive substring match on title)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(query)
      )
    }

    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter(book =>
        book.tags && book.tags.includes(selectedTag)
      )
    }

    // Sort by title
    const sorted = [...filtered].sort((a, b) => {
      const comparison = a.title.localeCompare(b.title)
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return sorted
  }, [books, searchQuery, selectedTag, sortOrder])

  const handleDelete = async (id: string) => {
    setIsDeleting(id)
    try {
      await deleteBook(id)
      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete book')
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
            📚 My Book Collection
          </h1>
          <p className="text-gray-600 text-lg">
            Manage and organize your personal library
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span>🔍</span> Search by Title
              </label>
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter book title..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
              />
            </div>

            {/* Filter by Tag */}
            <div>
              <label htmlFor="tag-filter" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span>🏷️</span> Filter by Tag
              </label>
              <select
                id="tag-filter"
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white"
              >
                <option value="">All Tags</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label htmlFor="sort" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span>🔤</span> Sort by Title
              </label>
              <select
                id="sort"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white"
              >
                <option value="asc">A - Z</option>
                <option value="desc">Z - A</option>
              </select>
            </div>
          </div>

          {/* Add Book Button */}
          <div className="flex justify-center">
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <span className="text-xl">➕</span> Add New Book
            </Link>
          </div>
        </div>

        {/* Book List */}
        {filteredAndSortedBooks.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-16 text-center border border-white/20">
            <div className="text-6xl mb-4">📖</div>
            <p className="text-gray-600 text-xl font-medium">
              {books.length === 0
                ? "Your collection is empty. Add your first book to get started!"
                : "No books match your search criteria. Try adjusting your filters."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredAndSortedBooks.map(book => (
              <div
                key={book.id}
                className={isDeleting === book.id ? 'opacity-50 pointer-events-none transition-opacity duration-300' : 'animate-in fade-in duration-300'}
              >
                <BookCard book={book} onDelete={handleDelete} />
              </div>
            ))}
          </div>
        )}

        {/* Results Count */}
        {filteredAndSortedBooks.length > 0 && (
          <div className="mt-8 text-center">
            <div className="inline-block bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-md border border-white/20">
              <p className="text-gray-700 font-semibold">
                Showing <span className="text-purple-600 font-bold">{filteredAndSortedBooks.length}</span> of <span className="text-blue-600 font-bold">{books.length}</span> book{books.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

