'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getBlogs } from '@/services/api'
import { Blog } from '@/types/database'
import { formatDate } from '@/lib/utils'
import { BookOpen, Calendar, ArrowRight, BookMarked } from 'lucide-react'

export default function BlogListPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBlogs()
      .then(setBlogs)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen py-24 bg-zinc-950 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">
        <div className="inline-flex items-center gap-1.5 bg-accent/15 text-accent text-xs font-bold uppercase px-3 py-1 rounded-full border border-accent/20">
          <BookOpen className="h-3.5 w-3.5" /> Design Trends
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-none">
          Inspiration Blog
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed font-light">
          Stay updated with local design guides, tiling tips, and the latest sanitary fixture trends.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="h-96 bg-zinc-900 rounded-2xl animate-pulse border border-zinc-800"
              ></div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-16 space-y-3 bg-zinc-900/20 rounded-2xl border border-zinc-900">
            <BookMarked className="h-10 w-10 text-zinc-700 mx-auto" />
            <h3 className="text-lg font-bold text-white">No articles found</h3>
            <p className="text-xs text-zinc-500">There are no articles published in our blog yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.slug}`}
                className="group bg-zinc-900/30 rounded-3xl overflow-hidden border border-zinc-850 hover:border-zinc-800 transition-all duration-350 flex flex-col justify-between"
              >
                <div>
                  <div className="h-64 relative overflow-hidden bg-zinc-950">
                    <img
                      src={blog.featured_image || ''}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                      loading="lazy"
                    />
                  </div>

                  <div className="p-8 space-y-4">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-550">
                      <Calendar className="h-3.5 w-3.5 text-accent" />
                      {formatDate(blog.created_at)}
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-accent transition-colors duration-200 line-clamp-2 leading-snug">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-zinc-500 line-clamp-3 leading-relaxed font-light">
                      {blog.content}
                    </p>
                  </div>
                </div>

                <div className="p-8 pt-0 mt-4 flex items-center justify-between border-t border-zinc-900/40">
                  <span className="text-accent text-xs font-bold group-hover:translate-x-1.5 transition-transform duration-300 flex items-center gap-1">
                    Read Article <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
