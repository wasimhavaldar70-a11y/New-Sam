import { getProductBySlug, getRelatedProducts } from '@/services/api'
import { formatPrice, cn } from '@/lib/utils'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MessageSquare, ShoppingBag, Truck, Info, HelpCircle } from 'lucide-react'
import ProductInquiryForm from './ProductInquiryForm'

interface ProductDetailsProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: ProductDetailsProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return {
      title: 'Product Not Found | Sangli Ceramica',
    }
  }

  return {
    title: `${product.name} | Premium Tiles in Sangli`,
    description: product.description || `Buy high-quality ${product.name} at Sangli Ceramica showroom. Available in ${product.size} size with a premium ${product.finish} finish.`,
    openGraph: {
      title: product.name,
      description: product.description || '',
      images:
        product.product_images && product.product_images.length > 0
          ? [product.product_images[0].image_url]
          : [],
    },
  }
}

export default async function ProductDetailsPage({ params }: ProductDetailsProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.id, product.category_id, 4)

  const defaultImage =
    product.product_images && product.product_images.length > 0
      ? product.product_images[0].image_url
      : 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80'

  const whatsappMessage = encodeURIComponent(
    `Hello Sangli Ceramica, I want to inquire about the product: ${product.name} (Brand: ${product.brand}, Size: ${product.size || 'N/A'}, Price: ${formatPrice(product.price)}). Please share catalog details and availability.`
  )
  const whatsappUrl = `https://wa.me/919876543210?text=${whatsappMessage}`

  return (
    <div className="min-h-screen py-24 bg-zinc-950 text-zinc-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Back navigation */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-accent transition-colors text-sm font-semibold group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Product Catalog
        </Link>

        {/* Product Info columns - 12 Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Column 1: Image Showcase - 6 cols */}
          <div className="lg:col-span-6 space-y-4">
            <div className="h-[400px] md:h-[500px] rounded-3xl overflow-hidden border border-zinc-850 bg-zinc-900 shadow-2xl relative">
              <img
                src={defaultImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.featured && (
                <span className="absolute top-6 left-6 bg-accent text-zinc-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Featured
                </span>
              )}
            </div>

            {/* Thumbnail selector simulation */}
            {product.product_images && product.product_images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.product_images.map((img) => (
                  <div
                    key={img.id}
                    className="h-20 rounded-xl overflow-hidden border border-zinc-850 bg-zinc-900 shadow-md cursor-pointer hover:border-accent transition-colors"
                  >
                    <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Column 2: Specs & Inquiry Form - 6 cols */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <span className="text-xs text-accent font-bold uppercase tracking-widest bg-accent/15 px-3 py-1 rounded-full border border-accent/20">
                {product.brand}
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {product.name}
              </h1>
              <p className="text-2xl font-bold text-white">{formatPrice(product.price)}</p>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Technical Specifications Grid */}
            <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-6 space-y-4 glass-panel">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-zinc-800 pb-2 flex items-center gap-1.5">
                <Info className="h-4 w-4 text-accent" />
                Technical Specifications
              </h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs sm:text-sm">
                <div>
                  <span className="text-zinc-550 block">Dimensions</span>
                  <span className="text-white font-medium">{product.size || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-zinc-550 block">Surface Finish</span>
                  <span className="text-white font-medium">{product.finish || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-zinc-550 block">Material Composition</span>
                  <span className="text-white font-medium">{product.material || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-zinc-550 block">Availability</span>
                  <span
                    className={cn(
                      'font-bold',
                      product.stock_status === 'In Stock'
                        ? 'text-emerald-500'
                        : 'text-amber-500'
                    )}
                  >
                    {product.stock_status}
                  </span>
                </div>
              </div>
            </div>

            {/* Inquiry Form */}
            <ProductInquiryForm productId={product.id} productName={product.name} />

            {/* Direct WhatsApp Action */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all hover:scale-101 border border-emerald-500/25 cursor-pointer text-sm"
            >
              <MessageSquare className="h-4 w-4" /> Direct WhatsApp Inquiry
            </a>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="pt-20 border-t border-zinc-900/60 space-y-8">
            <h2 className="text-2xl font-bold text-white">Related Collections</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((prod) => {
                const image =
                  prod.product_images && prod.product_images.length > 0
                    ? prod.product_images[0].image_url
                    : 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80'
                return (
                  <Link
                    key={prod.id}
                    href={`/products/${prod.slug}`}
                    className="group bg-zinc-900/30 rounded-2xl overflow-hidden border border-zinc-850 hover:border-zinc-800 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-48 relative overflow-hidden bg-zinc-950">
                        <img
                          src={image}
                          alt={prod.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                        />
                      </div>
                      <div className="p-5 space-y-2">
                        <h4 className="text-sm font-bold text-white group-hover:text-accent transition-colors line-clamp-1">
                          {prod.name}
                        </h4>
                        <p className="text-xs text-zinc-550 font-medium">{prod.brand}</p>
                      </div>
                    </div>
                    <div className="p-5 pt-0 mt-2 flex items-center justify-between border-t border-zinc-900/40">
                      <span className="text-sm font-bold text-white">
                        {formatPrice(prod.price)}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
