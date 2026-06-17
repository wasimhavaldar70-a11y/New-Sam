'use client'

import { useState, useTransition } from 'react'
import { Category, Product } from '@/types/database'
import {
  Plus,
  Edit2,
  Trash2,
  Upload,
  Search,
  Loader2,
  CheckCircle,
  HelpCircle,
  Star,
  FileSpreadsheet,
} from 'lucide-react'
import {
  createProductAction,
  updateProductAction,
  deleteProductAction,
  bulkUploadProductsCSV,
} from '@/app/actions/adminActions'
import { formatPrice, cn } from '@/lib/utils'

interface AdminProductsClientProps {
  categories: Category[]
  initialProducts: Product[]
}

export default function AdminProductsClient({
  categories,
  initialProducts,
}: AdminProductsClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [searchQuery, setSearchQuery] = useState('')
  const [isPending, startTransition] = useTransition()

  // Form states
  const [showFormModal, setShowFormModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // CSV states
  const [showCSVModal, setShowCSVModal] = useState(false)
  const [csvText, setCsvText] = useState('')

  // Form fields state
  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '')
  const [price, setPrice] = useState('0')
  const [brand, setBrand] = useState('')
  const [size, setSize] = useState('')
  const [finish, setFinish] = useState('')
  const [material, setMaterial] = useState('')
  const [stockStatus, setStockStatus] = useState<'In Stock' | 'Out of Stock' | 'Call for Availability'>('In Stock')
  const [featured, setFeatured] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [description, setDescription] = useState('')

  const resetForm = () => {
    setName('')
    setCategoryId(categories[0]?.id || '')
    setPrice('0')
    setBrand('')
    setSize('')
    setFinish('')
    setMaterial('')
    setStockStatus('In Stock')
    setFeatured(false)
    setImageUrl('')
    setDescription('')
    setErrorMsg('')
  }

  const handleOpenCreate = () => {
    setEditingProduct(null)
    resetForm()
    setShowFormModal(true)
  }

  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod)
    setName(prod.name)
    setCategoryId(prod.category_id)
    setPrice(prod.price.toString())
    setBrand(prod.brand || '')
    setSize(prod.size || '')
    setFinish(prod.finish || '')
    setMaterial(prod.material || '')
    setStockStatus(prod.stock_status)
    setFeatured(prod.featured)
    setImageUrl(prod.product_images?.[0]?.image_url || '')
    setDescription(prod.description || '')
    setErrorMsg('')
    setShowFormModal(true)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    const payload = {
      category_id: categoryId,
      name,
      price: parseFloat(price),
      brand,
      size,
      finish,
      material,
      stock_status: stockStatus,
      featured,
      image_url: imageUrl,
      description,
    }

    startTransition(async () => {
      let res
      if (editingProduct) {
        res = await updateProductAction(editingProduct.id, payload)
      } else {
        res = await createProductAction(payload)
      }

      if (res.success) {
        setSuccessMsg(res.message || 'Operation succeeded!')
        // Sync local products state for demonstration
        if (editingProduct) {
          setProducts((prev) =>
            prev.map((p) =>
              p.id === editingProduct.id
                ? {
                    ...p,
                    ...payload,
                    product_images: imageUrl
                      ? [{ id: 'img', product_id: p.id, image_url: imageUrl, sort_order: 0, created_at: '' }]
                      : p.product_images,
                  }
                : p
            )
          )
        } else {
          // Add a dummy entry to list
          const newId = Math.random().toString()
          const category = categories.find((c) => c.id === categoryId)
          setProducts((prev) => [
            {
              id: newId,
              created_at: new Date().toISOString(),
              ...payload,
              categories: category,
              product_images: imageUrl
                ? [{ id: 'img', product_id: newId, image_url: imageUrl, sort_order: 0, created_at: '' }]
                : [],
            } as any,
            ...prev,
          ])
        }
        setTimeout(() => {
          setShowFormModal(false)
          setSuccessMsg('')
        }, 1500)
      } else {
        setErrorMsg(res.error || 'Operation failed')
      }
    })
  }

  const handleDeleteProduct = (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    startTransition(async () => {
      const res = await deleteProductAction(id)
      if (res.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id))
        alert('Product deleted successfully.')
      } else {
        alert(res.error || 'Failed to delete product')
      }
    })
  }

  const handleCSVSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!csvText.trim()) {
      setErrorMsg('Please paste CSV content.')
      return
    }

    startTransition(async () => {
      const res = await bulkUploadProductsCSV(csvText)
      if (res.success) {
        setSuccessMsg(res.message || 'CSV Imported!')
        setCsvText('')
        setTimeout(() => {
          setShowCSVModal(false)
          setSuccessMsg('')
          // Reload page to refresh data since it is batch
          window.location.reload()
        }, 2000)
      } else {
        setErrorMsg(res.error || 'CSV Import failed')
      }
    })
  }

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Search and Action Buttons Row */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-650" />
          <input
            type="text"
            placeholder="Search products by name/brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-850 text-white rounded-xl pl-10 pr-3 py-2.5 text-xs focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder-zinc-600"
          />
        </div>

        {/* Action Panel */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setShowCSVModal(true)}
            className="w-full md:w-auto flex items-center justify-center gap-1.5 bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 text-zinc-300 font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
          >
            <Upload className="h-4 w-4 text-accent" /> Bulk CSV Upload
          </button>

          <button
            onClick={handleOpenCreate}
            className="w-full md:w-auto flex items-center justify-center gap-1.5 bg-accent hover:bg-amber-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-lg shadow-accent/10"
          >
            <Plus className="h-4 w-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-zinc-900 border border-zinc-850 rounded-2xl overflow-hidden shadow-lg">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <HelpCircle className="h-8 w-8 text-zinc-700 mx-auto" />
            <h4 className="text-sm font-bold text-white">No products found</h4>
            <p className="text-xs text-zinc-500">Try refining your search keyword.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-zinc-950/60 border-b border-zinc-850 text-zinc-400">
                  <th className="p-4 font-semibold uppercase tracking-wider text-xs">Image</th>
                  <th className="p-4 font-semibold uppercase tracking-wider text-xs">Product Details</th>
                  <th className="p-4 font-semibold uppercase tracking-wider text-xs">Category</th>
                  <th className="p-4 font-semibold uppercase tracking-wider text-xs">Price</th>
                  <th className="p-4 font-semibold uppercase tracking-wider text-xs">Featured</th>
                  <th className="p-4 font-semibold uppercase tracking-wider text-xs">Status</th>
                  <th className="p-4 font-semibold uppercase tracking-wider text-xs text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850 text-zinc-300">
                {filteredProducts.map((prod) => {
                  const image =
                    prod.product_images && prod.product_images.length > 0
                      ? prod.product_images[0].image_url
                      : 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80'
                  const categoryName =
                    categories.find((c) => c.id === prod.category_id)?.name || 'Tiles'

                  return (
                    <tr key={prod.id} className="hover:bg-zinc-900/30">
                      {/* Image thumbnail */}
                      <td className="p-4">
                        <img
                          src={image}
                          alt=""
                          className="h-12 w-12 rounded-lg object-cover bg-zinc-950 border border-zinc-800"
                        />
                      </td>

                      {/* Name & brand info */}
                      <td className="p-4">
                        <div>
                          <div className="font-bold text-white">{prod.name}</div>
                          <div className="text-zinc-500 text-[10px] uppercase font-semibold mt-0.5">
                            {prod.brand} • {prod.size}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-4 text-zinc-400">{categoryName}</td>

                      {/* Price */}
                      <td className="p-4 font-bold text-white">{formatPrice(prod.price)}</td>

                      {/* Featured */}
                      <td className="p-4">
                        {prod.featured ? (
                          <Star className="h-4.5 w-4.5 fill-amber-500 text-amber-500" />
                        ) : (
                          <Star className="h-4.5 w-4.5 text-zinc-700" />
                        )}
                      </td>

                      {/* Stock Status */}
                      <td className="p-4">
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border',
                            prod.stock_status === 'In Stock'
                              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900'
                              : 'bg-zinc-950 text-zinc-500 border-zinc-850'
                          )}
                        >
                          {prod.stock_status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(prod)}
                            className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit2 className="h-4.5 w-4.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-1.5 hover:bg-red-950/20 rounded-lg text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE & EDIT FORM MODAL */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider border-b border-zinc-800 pb-2">
              {editingProduct ? 'Edit Showroom Product' : 'Add New Showroom Product'}
            </h3>

            {errorMsg && (
              <div className="bg-red-900/15 border border-red-500/25 text-red-200 px-4 py-2.5 rounded-xl text-xs text-center">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="bg-emerald-950/40 border border-emerald-900 text-emerald-400 px-4 py-2.5 rounded-xl text-xs text-center flex items-center justify-center gap-1.5">
                <CheckCircle className="h-4 w-4" /> {successMsg}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Product Name */}
                <div className="space-y-1.5">
                  <label className="text-zinc-400 font-semibold uppercase tracking-wider">Product Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Royal Statuario White"
                    className="w-full bg-zinc-950 border border-zinc-850 text-white rounded-xl px-3 py-2.5 focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder-zinc-700"
                  />
                </div>

                {/* Category ID */}
                <div className="space-y-1.5">
                  <label className="text-zinc-400 font-semibold uppercase tracking-wider">Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-850 text-white rounded-xl px-3 py-2.5 focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Brand */}
                <div className="space-y-1.5">
                  <label className="text-zinc-400 font-semibold uppercase tracking-wider">Brand Name *</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    required
                    placeholder="e.g. Kajaria Eternity"
                    className="w-full bg-zinc-950 border border-zinc-850 text-white rounded-xl px-3 py-2.5 focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder-zinc-700"
                  />
                </div>

                {/* Size */}
                <div className="space-y-1.5">
                  <label className="text-zinc-400 font-semibold uppercase tracking-wider">Size *</label>
                  <input
                    type="text"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    required
                    placeholder="e.g. 800x1600 mm"
                    className="w-full bg-zinc-950 border border-zinc-850 text-white rounded-xl px-3 py-2.5 focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder-zinc-700"
                  />
                </div>

                {/* Finish */}
                <div className="space-y-1.5">
                  <label className="text-zinc-400 font-semibold uppercase tracking-wider">Finish *</label>
                  <input
                    type="text"
                    value={finish}
                    onChange={(e) => setFinish(e.target.value)}
                    required
                    placeholder="e.g. High Gloss / Carving"
                    className="w-full bg-zinc-950 border border-zinc-850 text-white rounded-xl px-3 py-2.5 focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder-zinc-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Material */}
                <div className="space-y-1.5">
                  <label className="text-zinc-400 font-semibold uppercase tracking-wider">Material *</label>
                  <input
                    type="text"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    required
                    placeholder="e.g. Vitrified Slab / Ceramic"
                    className="w-full bg-zinc-950 border border-zinc-850 text-white rounded-xl px-3 py-2.5 focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder-zinc-700"
                  />
                </div>

                {/* Price */}
                <div className="space-y-1.5">
                  <label className="text-zinc-400 font-semibold uppercase tracking-wider">Price (INR) *</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    min={0}
                    className="w-full bg-zinc-950 border border-zinc-850 text-white rounded-xl px-3 py-2.5 focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  />
                </div>

                {/* Stock Status */}
                <div className="space-y-1.5">
                  <label className="text-zinc-400 font-semibold uppercase tracking-wider">Stock Status *</label>
                  <select
                    value={stockStatus}
                    onChange={(e) => setStockStatus(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-850 text-white rounded-xl px-3 py-2.5 focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                    <option value="Call for Availability">Call for Availability</option>
                  </select>
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-semibold uppercase tracking-wider">Showcase Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or Supabase storage link"
                  className="w-full bg-zinc-950 border border-zinc-855 text-white rounded-xl px-3 py-2.5 focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder-zinc-700"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-semibold uppercase tracking-wider">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write details about the design patterns, spacing, or usage suggestions..."
                  className="w-full bg-zinc-950 border border-zinc-850 text-white rounded-xl px-3 py-2.5 focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder-zinc-700 resize-none"
                />
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4 bg-zinc-950 border border-zinc-850 text-accent focus:ring-accent rounded transition-all cursor-pointer"
                />
                <label htmlFor="featured" className="text-zinc-300 font-semibold uppercase tracking-wider cursor-pointer">
                  Feature this product on homepage
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="bg-accent hover:bg-amber-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-accent/10 flex items-center gap-1.5 cursor-pointer disabled:opacity-55"
                >
                  {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV UPLOAD MODAL */}
      {showCSVModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl relative space-y-6">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
              <FileSpreadsheet className="h-5 w-5 text-accent" />
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                Bulk Import Products
              </h3>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              Paste comma-separated values (CSV) matching the column order below. The first row must be the headers: <br />
              <code className="text-accent bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-850 inline-block mt-2 font-mono">
                category_slug,name,brand,size,finish,material,price,stock_status,featured
              </code>
            </p>

            {errorMsg && (
              <div className="bg-red-900/15 border border-red-500/25 text-red-200 px-4 py-2.5 rounded-xl text-xs text-center">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="bg-emerald-950/40 border border-emerald-900 text-emerald-400 px-4 py-2.5 rounded-xl text-xs text-center flex items-center justify-center gap-1.5">
                <CheckCircle className="h-4 w-4" /> {successMsg}
              </div>
            )}

            <form onSubmit={handleCSVSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-semibold uppercase tracking-wider">CSV Raw Content</label>
                <textarea
                  rows={8}
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  placeholder={`category_slug,name,brand,size,finish,material,price,stock_status,featured
floor-tiles,Carrara Classic,Somany,800x1600 mm,Satin,Glazed Vitrified,1350,In Stock,true
wall-tiles,Hexa Mint Deco,Simpolo,300x300 mm,Matte,Ceramic,850,In Stock,false`}
                  className="w-full bg-zinc-950 border border-zinc-850 text-white rounded-xl p-4 focus:border-accent focus:ring-1 focus:ring-accent transition-all font-mono placeholder-zinc-700 resize-none text-[11px]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowCSVModal(false)}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="bg-accent hover:bg-amber-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-accent/10 flex items-center gap-1.5 cursor-pointer disabled:opacity-55"
                >
                  {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Import CSV Rows
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
