/**
 * Create Book Page
 * 
 * Allows users to add a new book to the collection.
 */

import BookForm from '@/components/BookForm'

export default function CreateBookPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
            ➕ Add New Book
          </h1>
          <p className="text-gray-600 text-lg">
            Fill in the details to add a new book to your collection
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
          <BookForm />
        </div>
      </div>
    </div>
  )
}

