import { getBlogBySlug } from '@/services/api'
import { formatDate } from '@/lib/utils'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, ArrowLeft, Bookmark } from 'lucide-react'

interface BlogDetailsProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: BlogDetailsProps): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlogBySlug(slug)

  if (!blog) {
    return {
      title: 'Article Not Found | Sangli Ceramica',
    }
  }

  return {
    title: `${blog.title} | Sangli Ceramica Blog`,
    description: blog.content.substring(0, 155).replace(/\s+/g, ' ') + '...',
    openGraph: {
      title: blog.title,
      description: blog.content.substring(0, 150),
      images: blog.featured_image ? [blog.featured_image] : [],
    },
  }
}

export default async function BlogDetailsPage({ params }: BlogDetailsProps) {
  const { slug } = await params
  const blog = await getBlogBySlug(slug)

  if (!blog) {
    notFound()
  }

  return (
    <div className="min-h-screen py-24 bg-zinc-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-accent transition-colors text-sm font-semibold group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Blog List
        </Link>

        {/* Article Meta Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 text-xs text-zinc-550 font-medium">
            <Calendar className="h-4 w-4 text-accent" />
            {formatDate(blog.created_at)}
            <span className="text-zinc-800">•</span>
            <span className="text-accent flex items-center gap-0.5">
              <Bookmark className="h-3 w-3" />
              Design Guide
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            {blog.title}
          </h1>
        </div>

        {/* Featured Cover Image */}
        {blog.featured_image && (
          <div className="h-[350px] md:h-[480px] rounded-3xl overflow-hidden border border-zinc-900 bg-zinc-900 shadow-2xl">
            <img
              src={blog.featured_image}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Rich Text Body Content */}
        <article className="prose prose-invert max-w-none text-zinc-300 leading-relaxed font-light text-sm sm:text-base space-y-6 pt-4">
          {blog.content.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="whitespace-pre-line">
              {paragraph}
            </p>
          ))}
        </article>
      </div>
    </div>
  )
}
