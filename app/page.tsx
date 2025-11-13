/**
 * Main Page - Book List
 * 
 * Displays all books with search, filter, and sort functionality.
 */

import { Suspense } from 'react'
import Link from 'next/link'
import { getBooks } from '@/app/actions/books'
import BookCard from '@/components/BookCard'
import BookListClient from '@/components/BookListClient'

export const dynamic = 'force-dynamic'

async function BookList() {
  let books
  let error: string | null = null

  try {
    books = await getBooks()
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load books'
    books = []
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <span className="font-semibold">{error}</span>
          </div>
        </div>
      </div>
    )
  }

  return <BookListClient initialBooks={books} />
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Suspense
        fallback={
          <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
                <p className="text-gray-600 text-lg font-medium">Loading your books...</p>
              </div>
            </div>
          </div>
        }
      >
        <BookList />
      </Suspense>
    </div>
  )
}

