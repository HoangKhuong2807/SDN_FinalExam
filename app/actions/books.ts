/**
 * Server Actions for Book CRUD Operations
 * 
 * These server actions handle all database operations for books.
 * They use the Supabase client to interact with the PostgreSQL database.
 */

'use server'

import { supabase, type Book, type BookInput } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

/**
 * Fetch all books from the database
 */
export async function getBooks(): Promise<Book[]> {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('title', { ascending: true })

    if (error) {
      console.error('Error fetching books:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Failed to fetch books:', error)
    throw new Error('Failed to load books')
  }
}

/**
 * Fetch a single book by ID
 */
export async function getBookById(id: string): Promise<Book | null> {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // Book not found
        return null
      }
      console.error('Error fetching book:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Failed to fetch book:', error)
    throw new Error('Failed to load book')
  }
}

/**
 * Create a new book
 */
export async function createBook(book: BookInput): Promise<Book> {
  try {
    // Validate required fields
    if (!book.title || !book.author) {
      throw new Error('Title and author are required')
    }

    // Convert tags string to array if needed (handled in form, but just in case)
    const tagsArray = Array.isArray(book.tags) 
      ? book.tags 
      : book.tags 
        ? book.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : []

    const { data, error } = await supabase
      .from('books')
      .insert([
        {
          title: book.title.trim(),
          author: book.author.trim(),
          tags: tagsArray,
          cover_url: book.cover_url?.trim() || null,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating book:', error)
      throw error
    }

    // Revalidate the book list page to show the new book
    revalidatePath('/')
    
    return data
  } catch (error) {
    console.error('Failed to create book:', error)
    throw new Error('Failed to save book')
  }
}

/**
 * Update an existing book
 */
export async function updateBook(id: string, book: BookInput): Promise<Book> {
  try {
    // Validate required fields
    if (!book.title || !book.author) {
      throw new Error('Title and author are required')
    }

    // Convert tags string to array if needed
    const tagsArray = Array.isArray(book.tags) 
      ? book.tags 
      : book.tags 
        ? book.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : []

    const { data, error } = await supabase
      .from('books')
      .update({
        title: book.title.trim(),
        author: book.author.trim(),
        tags: tagsArray,
        cover_url: book.cover_url?.trim() || null,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating book:', error)
      throw error
    }

    // Revalidate the book list and edit pages
    revalidatePath('/')
    revalidatePath(`/edit/${id}`)
    
    return data
  } catch (error) {
    console.error('Failed to update book:', error)
    throw new Error('Failed to update book')
  }
}

/**
 * Delete a book by ID
 */
export async function deleteBook(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting book:', error)
      throw error
    }

    // Revalidate the book list page
    revalidatePath('/')
  } catch (error) {
    console.error('Failed to delete book:', error)
    throw new Error('Failed to delete book')
  }
}

