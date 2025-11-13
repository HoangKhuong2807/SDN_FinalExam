/**
 * Edit Book Page
 * 
 * Allows users to edit an existing book.
 */

import { notFound } from 'next/navigation'
import { getBookById } from '@/app/actions/books'
import BookForm from '@/components/BookForm'

interface EditBookPageProps {
  params: {
    id: string
  }
}

export default async function EditBookPage({ params }: EditBookPageProps) {
  const book = await getBookById(params.id)

  if (!book) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            ✏️ Edit Book
          </h1>
          <p className="text-gray-600 text-lg">
            Update the details of your book
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
          <BookForm book={book} bookId={params.id} />
        </div>
      </div>
    </div>
  )
}

