'use client'

import { Category, Product } from '@/types/database'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect, useTransition } from 'react'
import { Search, ArrowRight, Layers, HelpCircle, Loader2 } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import Link from 'next/link'

interface ProductsClientProps {
  categories: Category[]
  initialProducts: Product[]
  totalCount: number
  initialCategory: string
  initialQuery: string
  initialPage: number
}

export default function ProductsClient({
  categories,
  initialProducts,
  totalCount,
  initialCategory,
  initialQuery,
  initialPage,
}: ProductsClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const [searchVal, setSearchVal] = useState(initialQuery)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)

  // Sync state with url changes (e.g. from clicking header links)
  useEffect(() => {
    setSearchVal(initialQuery)
    setSelectedCategory(initialCategory)
  }, [initialQuery, initialCategory])

  const handleFilterChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug)
    updateURL(categorySlug, searchVal, 1)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateURL(selectedCategory, searchVal, 1)
  }

  const handlePageChange = (newPage: number) => {
    updateURL(selectedCategory, searchVal, newPage)
  }

  const updateURL = (catSlug: string, query: string, page: number) => {
    const params = new URLSearchParams()
    if (catSlug) params.set('category', catSlug)
    if (query) params.set('query', query)
    if (page > 1) params.set('page', page.toString())

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  const itemsPerPage = 12
  const totalPages = Math.ceil(totalCount / itemsPerPage)

  return (
    <div className="min-h-screen py-24 bg-zinc-950 space-y-12">
      {/* Search and Category Filter Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Product Directory
          </h1>
          <p className="text-sm text-zinc-400 max-w-lg mx-auto font-light">
            Search our showroom collection. Slabs, tiles, intelligent closets, and gold-finish mixers.
          </p>
        </div>

        {/* Search Bar & Filters Form */}
        <form
          onSubmit={handleSearchSubmit}
          className="max-w-3xl mx-auto bg-zinc-900 border border-zinc-850 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 shadow-xl glass-panel"
        >
          <div className="relative w-full flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-650" />
            <input
              type="text"
              placeholder="Search by name, brand, or material finish..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-850 text-white rounded-xl pl-12 pr-4 py-3.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder-zinc-750"
            />
          </div>
          <button
            type="submit"
            className="w-full md:w-auto bg-accent hover:bg-amber-600 text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-all shadow-md shadow-accent/15 cursor-pointer shrink-0"
          >
            Search Catalog
          </button>
        </form>

        {/* Horizontal Scrollable Categories Filter */}
        <div className="flex justify-center">
          <div className="flex gap-2.5 overflow-x-auto pb-2 px-4 max-w-full no-scrollbar">
            <button
              onClick={() => handleFilterChange('')}
              className={cn(
                'px-5 py-2.5 rounded-full text-xs font-bold transition-all border shrink-0 cursor-pointer uppercase tracking-wider',
                selectedCategory === ''
                  ? 'bg-accent text-white border-accent shadow-md shadow-accent/10'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-850 hover:border-zinc-700 hover:text-white'
              )}
            >
              All Products
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleFilterChange(cat.slug)}
                className={cn(
                  'px-5 py-2.5 rounded-full text-xs font-bold transition-all border shrink-0 cursor-pointer uppercase tracking-wider',
                  selectedCategory === cat.slug
                    ? 'bg-accent text-white border-accent shadow-md shadow-accent/10'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-850 hover:border-zinc-700 hover:text-white'
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Display Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isPending ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="h-10 w-10 text-accent animate-spin" />
            <p className="text-zinc-550 text-xs uppercase tracking-wider animate-pulse">
              Filtering Catalog...
            </p>
          </div>
        ) : initialProducts.length === 0 ? (
          <div className="text-center py-20 space-y-3 bg-zinc-900/10 rounded-2xl border border-zinc-900 max-w-xl mx-auto">
            <HelpCircle className="h-10 w-10 text-zinc-700 mx-auto" />
            <h3 className="text-lg font-bold text-white">No products match</h3>
            <p className="text-xs text-zinc-500">
              We couldn't find any items in our showroom matching your current criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in">
            {initialProducts.map((prod) => {
              const image =
                prod.product_images && prod.product_images.length > 0
                  ? prod.product_images[0].image_url
                  : 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80'
              return (
                <Link
                  key={prod.id}
                  href={`/products/${prod.slug}`}
                  className="group bg-zinc-900/40 rounded-2xl overflow-hidden border border-zinc-850 hover:border-zinc-800 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Image */}
                    <div className="h-60 relative overflow-hidden bg-zinc-950">
                      <img
                        src={image}
                        alt={prod.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
                        loading="lazy"
                      />
                      {prod.featured && (
                        <span className="absolute top-4 left-4 bg-accent text-zinc-950 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="p-6 space-y-3">
                      <span className="text-xs text-zinc-500 font-medium tracking-wide uppercase">
                        {prod.brand}
                      </span>
                      <h3 className="text-base font-bold text-white group-hover:text-accent transition-colors line-clamp-1">
                        {prod.name}
                      </h3>
                      <div className="flex flex-wrap gap-1.5 text-xs text-zinc-400">
                        {prod.size && (
                          <span className="bg-zinc-850 px-2 py-0.5 rounded-md border border-zinc-800">
                            {prod.size}
                          </span>
                        )}
                        {prod.finish && (
                          <span className="bg-zinc-850 px-2 py-0.5 rounded-md border border-zinc-800">
                            {prod.finish}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-zinc-900 mt-4 flex items-center justify-between">
                    <span className="text-lg font-bold text-white">
                      {formatPrice(prod.price)}
                    </span>
                    <span className="text-accent text-xs font-bold group-hover:translate-x-1.5 transition-transform duration-300 flex items-center gap-1">
                      Details <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && !isPending && (
          <div className="flex justify-center items-center gap-4 mt-16 pt-8 border-t border-zinc-900/60">
            <button
              onClick={() => handlePageChange(initialPage - 1)}
              disabled={initialPage <= 1}
              className="px-4 py-2 bg-zinc-900 border border-zinc-850 hover:bg-zinc-850 hover:border-zinc-700 text-zinc-300 text-xs font-bold rounded-xl transition-all disabled:opacity-40 disabled:hover:bg-zinc-900 cursor-pointer"
            >
              Previous
            </button>
            <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
              Page {initialPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(initialPage + 1)}
              disabled={initialPage >= totalPages}
              className="px-4 py-2 bg-zinc-900 border border-zinc-850 hover:bg-zinc-850 hover:border-zinc-700 text-zinc-300 text-xs font-bold rounded-xl transition-all disabled:opacity-40 disabled:hover:bg-zinc-900 cursor-pointer"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
