'use client'

import { useState, useEffect } from 'react'
import { getGalleryItems } from '@/services/api'
import { GalleryItem } from '@/types/database'
import { Image, Layers, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const filterCategories = ['All', 'Living Room', 'Bathroom', 'Lobby', 'Kitchen']

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadGallery() {
      setLoading(true)
      try {
        const catFilter = selectedCategory === 'All' ? undefined : selectedCategory
        const data = await getGalleryItems(catFilter)
        setItems(data)
      } catch (err) {
        console.error('Failed to load gallery items:', err)
      } finally {
        setLoading(false)
      }
    }
    loadGallery()
  }, [selectedCategory])

  return (
    <div className="min-h-screen py-24 bg-zinc-950 space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">
        <div className="inline-flex items-center gap-1.5 bg-accent/15 text-accent text-xs font-bold uppercase px-3 py-1 rounded-full border border-accent/20">
          <Sparkles className="h-3.5 w-3.5" /> Luxury Concepts
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-none">
          Design Inspiration Gallery
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed font-light">
          Explore complete tile layouts, elevation cladding, and modern bathroom sets created using our products.
        </p>

        {/* Categories Toggles */}
        <div className="flex flex-wrap justify-center items-center gap-3 pt-6">
          {filterCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'px-5 py-2.5 rounded-full text-xs font-bold transition-all border cursor-pointer uppercase tracking-wider',
                selectedCategory === cat
                  ? 'bg-accent text-white border-accent shadow-md shadow-accent/10'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-72 bg-zinc-900 rounded-2xl animate-pulse border border-zinc-800"
              ></div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 space-y-3 bg-zinc-900/20 rounded-2xl border border-zinc-900">
            <Image className="h-10 w-10 text-zinc-700 mx-auto" />
            <h3 className="text-lg font-bold text-white">No gallery items found</h3>
            <p className="text-xs text-zinc-500">
              There are no showcase photos uploaded for this category yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative h-80 rounded-2xl overflow-hidden border border-zinc-850 hover:border-accent/30 transition-all duration-350 flex flex-col justify-end p-6"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-104"
                  style={{ backgroundImage: `url(${item.image_url})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>

                <div className="relative z-10 space-y-1">
                  <span className="text-[10px] font-bold text-accent uppercase tracking-widest bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">
                    {item.category}
                  </span>
                  <h3 className="text-base font-bold text-white pt-1 line-clamp-1">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
