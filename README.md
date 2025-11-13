# Book Collection Manager

A full-stack web application for managing your personal book collection. Built with Next.js, TypeScript, Supabase, and Tailwind CSS.

## Features

- 📚 **View all books** with title, author, tags, and cover images
- 🔍 **Search books** by title (case-insensitive)
- 🏷️ **Filter books** by tags
- 📊 **Sort books** by title (A-Z or Z-A)
- ➕ **Add new books** with a simple form
- ✏️ **Edit existing books**
- 🗑️ **Delete books** with confirmation

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel-ready

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works fine)
- npm or yarn package manager

## Local Setup

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to your project's SQL Editor
3. Run the migration script from `supabase/migrations/001_create_books_table.sql`:

```sql
-- Create the books table
CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  tags TEXT[],
  cover_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
CREATE INDEX IF NOT EXISTS idx_books_tags ON books USING GIN(tags);

-- Enable Row Level Security
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Create policy (allows all operations since no auth is required)
CREATE POLICY "Allow all operations on books" ON books
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

### 3. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Get your Supabase credentials:
   - Go to your Supabase project settings: **Settings** → **API**
   - Copy your **Project URL** and **anon/public key**

3. Update `.env.local` with your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### 1. Push Your Code to GitHub

Create a GitHub repository and push your code:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-github-repo-url
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"New Project"**
3. Import your GitHub repository
4. Configure environment variables:
   - Click **"Environment Variables"**
   - Add `NEXT_PUBLIC_SUPABASE_URL` with your Supabase project URL
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` with your Supabase anon key
5. Click **"Deploy"**

### 3. Set Up Database (if not done already)

If you haven't run the migration yet:

1. Go to your Supabase project's SQL Editor
2. Run the migration script from `supabase/migrations/001_create_books_table.sql`
3. Verify the table was created in the **Table Editor**

### 4. Verify Deployment

Once deployed, visit your Vercel URL and test the application:
- Add a book
- Search and filter books
- Edit and delete books

## Project Structure

```
├── app/
│   ├── actions/
│   │   └── books.ts          # Server actions for CRUD operations
│   ├── create/
│   │   └── page.tsx          # Create book page
│   ├── edit/
│   │   └── [id]/
│   │       └── page.tsx      # Edit book page
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   ├── not-found.tsx         # 404 page
│   └── page.tsx              # Main book list page
├── components/
│   ├── BookCard.tsx          # Book card component
│   ├── BookForm.tsx          # Reusable form component
│   └── BookListClient.tsx    # Client-side list with filters
├── lib/
│   └── supabase.ts           # Supabase client configuration
├── supabase/
│   └── migrations/
│       └── 001_create_books_table.sql  # Database migration
└── README.md
```

## Environment Variables

The application requires the following environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous/public key

These are read in `lib/supabase.ts` and must be prefixed with `NEXT_PUBLIC_` to be accessible in the browser.

## Database Schema

The `books` table has the following structure:

- `id` (UUID, Primary Key): Auto-generated unique identifier
- `title` (TEXT, Required): Book title
- `author` (TEXT, Required): Author name
- `tags` (TEXT[]): Array of tags (e.g., ['IT', 'Programming'])
- `cover_url` (TEXT, Nullable): URL to book cover image
- `created_at` (TIMESTAMPTZ): Timestamp of creation

## Notes

- No authentication is required for this app (as per requirements)
- Row Level Security (RLS) is enabled but allows all operations
- The app uses Next.js Server Actions for database operations
- All database operations are performed server-side for security

## Troubleshooting

### "Missing Supabase environment variables" error

Make sure your `.env.local` file exists and contains both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### Books not loading

1. Verify your Supabase credentials are correct
2. Check that the `books` table exists in your Supabase project
3. Verify RLS policies allow operations (the migration includes a permissive policy)

### Images not displaying

If cover images don't load, check:
- The URL is valid and publicly accessible
- The URL uses HTTPS (required by Next.js Image component)
- The image host allows hotlinking

## License

MIT

