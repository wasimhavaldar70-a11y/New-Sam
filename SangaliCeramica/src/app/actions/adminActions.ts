'use server'

import { isDbConfigured } from '@/services/api'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function adminLogin(formData: any) {
  const email = formData.email
  const password = formData.password
  const configured = await isDbConfigured()

  if (!configured) {
    if (email === 'admin@sangliceramica.com' && password === 'admin123') {
      const cookieStore = await cookies()
      cookieStore.set('sb-admin-preview-session', 'true', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
      })
      return { success: true, message: 'Logged in as Admin (Preview Mode)' }
    }
    return {
      success: false,
      error: 'Invalid credentials. Use admin@sangliceramica.com / admin123 for preview.',
    }
  }

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    // Verify role is admin
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (profileError || profile?.role !== 'admin') {
      await supabase.auth.signOut()
      return {
        success: false,
        error: 'Unauthorized. Only admins can access the dashboard.',
      }
    }

    return { success: true, message: 'Successfully logged in.' }
  } catch (error: any) {
    console.error('Login error:', error)
    return { success: false, error: error.message || 'Authentication failed.' }
  }
}

export async function adminLogout() {
  const cookieStore = await cookies()
  cookieStore.delete('sb-admin-preview-session')

  const configured = await isDbConfigured()
  if (configured) {
    try {
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = await createClient()
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return { success: true }
}

export async function createProductAction(productData: any) {
  const configured = await isDbConfigured()
  if (!configured) {
    return {
      success: true,
      message: 'Product created successfully (Simulation in Preview Mode)!',
    }
  }

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('products')
      .insert({
        category_id: productData.category_id,
        name: productData.name,
        slug: productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: productData.description || null,
        price: parseFloat(productData.price) || 0,
        brand: productData.brand,
        size: productData.size,
        finish: productData.finish,
        material: productData.material,
        stock_status: productData.stock_status,
        featured: !!productData.featured,
      })
      .select()
      .single()

    if (error) throw error

    // If an image URL was specified, add it to product_images
    if (productData.image_url) {
      await supabase.from('product_images').insert({
        product_id: data.id,
        image_url: productData.image_url,
        sort_order: 0,
      })
    }

    revalidatePath('/products')
    return { success: true, message: 'Product created successfully!' }
  } catch (error: any) {
    console.error('Error creating product:', error)
    return { success: false, error: error.message || 'Failed to create product.' }
  }
}

export async function updateProductAction(id: string, productData: any) {
  const configured = await isDbConfigured()
  if (!configured) {
    return {
      success: true,
      message: 'Product updated successfully (Simulation in Preview Mode)!',
    }
  }

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const { error } = await supabase
      .from('products')
      .update({
        category_id: productData.category_id,
        name: productData.name,
        slug: productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: productData.description || null,
        price: parseFloat(productData.price) || 0,
        brand: productData.brand,
        size: productData.size,
        finish: productData.finish,
        material: productData.material,
        stock_status: productData.stock_status,
        featured: !!productData.featured,
      })
      .eq('id', id)

    if (error) throw error

    revalidatePath(`/products/${productData.slug}`)
    revalidatePath('/products')
    return { success: true, message: 'Product updated successfully!' }
  } catch (error: any) {
    console.error('Error updating product:', error)
    return { success: false, error: error.message || 'Failed to update product.' }
  }
}

export async function deleteProductAction(id: string) {
  const configured = await isDbConfigured()
  if (!configured) {
    return {
      success: true,
      message: 'Product deleted successfully (Simulation in Preview Mode)!',
    }
  }

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) throw error

    revalidatePath('/products')
    return { success: true, message: 'Product deleted successfully!' }
  } catch (error: any) {
    console.error('Error deleting product:', error)
    return { success: false, error: error.message || 'Failed to delete product.' }
  }
}

export async function updateLeadStatusAction(
  id: string,
  type: 'inquiry' | 'appointment',
  status: string
) {
  const configured = await isDbConfigured()
  if (!configured) {
    return {
      success: true,
      message: 'Lead status updated (Simulation in Preview Mode)!',
    }
  }

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const table = type === 'inquiry' ? 'inquiries' : 'appointments'
    const { error } = await supabase.from(table).update({ status }).eq('id', id)

    if (error) throw error

    return { success: true, message: 'Lead status updated successfully!' }
  } catch (error: any) {
    console.error('Error updating lead status:', error)
    return { success: false, error: error.message || 'Failed to update lead status.' }
  }
}

export async function updateSettingsAction(settingsData: any) {
  const configured = await isDbConfigured()
  if (!configured) {
    return {
      success: true,
      message: 'Settings saved successfully (Simulation in Preview Mode)!',
    }
  }

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const { error } = await supabase
      .from('settings')
      .update({
        website_name: settingsData.website_name,
        address: settingsData.address,
        phone: settingsData.phone,
        email: settingsData.email,
        whatsapp: settingsData.whatsapp,
        google_map: settingsData.google_map,
      })
      .eq('id', '00000000-0000-0000-0000-000000000000')

    if (error) throw error

    return { success: true, message: 'Website settings updated successfully!' }
  } catch (error: any) {
    console.error('Error updating settings:', error)
    return { success: false, error: error.message || 'Failed to update settings.' }
  }
}

export async function bulkUploadProductsCSV(csvText: string) {
  // Simple CSV parser that handles commas inside quotes
  const parseCSVLine = (line: string) => {
    const result = []
    let current = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"' || char === "'") {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    result.push(current.trim())
    return result
  }

  const lines = csvText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  if (lines.length < 2) {
    return { success: false, error: 'CSV must contain header and at least one product row.' }
  }

  const headers = parseCSVLine(lines[0])
  const productsToInsert = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    if (values.length < headers.length) continue

    const row: any = {}
    headers.forEach((header, index) => {
      row[header] = values[index]
    })
    productsToInsert.push(row)
  }

  const configured = await isDbConfigured()
  if (!configured) {
    console.log('Bulk Upload Simulation:', productsToInsert)
    return {
      success: true,
      message: `Successfully simulated importing ${productsToInsert.length} products (Preview Mode)!`,
    }
  }

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    // Get all categories to match slug with ID
    const { data: categories } = await supabase.from('categories').select('id, slug')
    const categoryMap = new Map(categories?.map((c) => [c.slug, c.id]))

    const finalProducts = []
    for (const p of productsToInsert) {
      const categoryId = categoryMap.get(p.category_slug)
      if (!categoryId) {
        throw new Error(
          `Category slug "${p.category_slug}" for product "${p.name}" was not found. Please create the category first.`
        )
      }

      finalProducts.push({
        category_id: categoryId,
        name: p.name,
        slug: p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: p.description || null,
        price: parseFloat(p.price) || 0,
        brand: p.brand || 'Premium Brand',
        size: p.size || 'Standard',
        finish: p.finish || 'Polished',
        material: p.material || 'Vitrified',
        stock_status: p.stock_status || 'In Stock',
        featured: p.featured === 'true' || p.featured === '1',
      })
    }

    // Insert batch
    const { data, error } = await supabase.from('products').insert(finalProducts).select()
    if (error) throw error

    // Optionally insert a dummy image for each product
    const imagesToInsert = (data || []).map((prod) => ({
      product_id: prod.id,
      image_url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80',
      sort_order: 0,
    }))

    await supabase.from('product_images').insert(imagesToInsert)

    revalidatePath('/products')
    return { success: true, message: `Successfully imported ${finalProducts.length} products!` }
  } catch (error: any) {
    console.error('Bulk upload error:', error)
    return { success: false, error: error.message || 'Failed to bulk import products.' }
  }
}
