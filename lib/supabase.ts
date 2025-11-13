/**
 * Supabase Client Utility
 * 
 * This file creates and exports a Supabase client instance.
 * The client reads the Supabase URL and anon key from environment variables:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY
 * 
 * These should be set in your .env.local file for local development,
 * and in your Vercel project settings for production deployment.
 */

import { createClient } from '@supabase/supabase-js'

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate that environment variables are set and not placeholders
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
  )
}

if (supabaseUrl.includes('your_supabase') || supabaseAnonKey.includes('your_supabase')) {
  throw new Error(
    'Please replace the placeholder values in your .env.local file with your actual Supabase credentials. Get them from: https://app.supabase.com/project/_/settings/api'
  )
}

// Validate URL format
try {
  new URL(supabaseUrl)
} catch {
  throw new Error(
    `Invalid Supabase URL format: "${supabaseUrl}". Please check your NEXT_PUBLIC_SUPABASE_URL in .env.local`
  )
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definition for the Book model
export interface Book {
  id: string
  title: string
  author: string
  tags: string[]
  cover_url: string | null
  created_at: string
}

// Type definition for creating/updating a book (without id and created_at)
export interface BookInput {
  title: string
  author: string
  tags: string[] | string | null | undefined
  cover_url?: string | null
}

