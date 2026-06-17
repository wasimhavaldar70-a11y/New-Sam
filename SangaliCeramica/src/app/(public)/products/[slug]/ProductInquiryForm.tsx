'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { inquirySchema, InquiryFormInput } from '@/lib/validation/schemas'
import { submitInquiry } from '@/app/actions/formActions'
import { MessageSquare, User, Phone, Mail, CheckCircle, Loader2 } from 'lucide-react'

interface ProductInquiryFormProps {
  productId: string
  productName: string
}

export default function ProductInquiryForm({
  productId,
  productName,
}: ProductInquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InquiryFormInput>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      customer_name: '',
      phone: '',
      email: '',
      product_id: productId,
      message: `Hello Sangli Ceramica, I am interested in your "${productName}". Please send me pricing and availability details.`,
    },
  })

  const onSubmit = async (data: InquiryFormInput) => {
    setIsSubmitting(true)
    setSubmitResult(null)
    try {
      const response = await submitInquiry(data)
      if (response.success) {
        setSubmitResult({ success: true, message: response.message || 'Inquiry submitted!' })
        reset({
          customer_name: '',
          phone: '',
          email: '',
          product_id: productId,
          message: `Hello Sangli Ceramica, I am interested in your "${productName}". Please send me pricing and availability details.`,
        })
      } else {
        setSubmitResult({
          success: false,
          message: typeof response.error === 'string' ? response.error : 'Validation failed.',
        })
      }
    } catch (error) {
      setSubmitResult({ success: false, message: 'Failed to send inquiry. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-zinc-900 border border-zinc-850 rounded-2xl p-6 shadow-xl space-y-6">
      {submitResult?.success ? (
        <div className="text-center py-6 space-y-3 animate-fade-in">
          <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">Inquiry Received</h3>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto">
            {submitResult.message}
          </p>
          <button
            onClick={() => setSubmitResult(null)}
            className="inline-flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-xs font-semibold"
          >
            Inquire Again
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-zinc-800 pb-2 flex items-center gap-1.5">
            <MessageSquare className="h-4 w-4 text-accent" />
            Send Showroom Inquiry
          </h3>

          {submitResult && !submitResult.success && (
            <div className="bg-red-900/15 border border-red-500/25 text-red-200 px-3 py-2 rounded-xl text-xs">
              {submitResult.message}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-medium">Your Name *</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-755" />
                  <input
                    type="text"
                    placeholder="Enter name"
                    {...register('customer_name')}
                    className="w-full bg-zinc-950 border border-zinc-850 focus:border-accent focus:ring-1 focus:ring-accent text-white rounded-xl pl-9 pr-3 py-2.5 text-xs transition-all placeholder-zinc-700"
                  />
                </div>
                {errors.customer_name && (
                  <p className="text-red-500 font-semibold">{errors.customer_name.message}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-medium">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-755" />
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    {...register('phone')}
                    className="w-full bg-zinc-950 border border-zinc-855 focus:border-accent focus:ring-1 focus:ring-accent text-white rounded-xl pl-9 pr-3 py-2.5 text-xs transition-all placeholder-zinc-700"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 font-semibold">{errors.phone.message}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-zinc-400 font-medium">Email <span className="text-zinc-650">(Optional)</span></label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-755" />
                <input
                  type="email"
                  placeholder="e.g. name@example.com"
                  {...register('email')}
                  className="w-full bg-zinc-950 border border-zinc-850 focus:border-accent focus:ring-1 focus:ring-accent text-white rounded-xl pl-9 pr-3 py-2.5 text-xs transition-all placeholder-zinc-700"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 font-semibold">{errors.email.message}</p>
              )}
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <label className="text-zinc-400 font-medium">Requirements *</label>
              <textarea
                rows={3}
                placeholder="Inquiry message..."
                {...register('message')}
                className="w-full bg-zinc-950 border border-zinc-850 focus:border-accent focus:ring-1 focus:ring-accent text-white rounded-xl px-4.5 py-3 text-xs transition-all placeholder-zinc-700 resize-none"
              />
              {errors.message && (
                <p className="text-red-500 font-semibold">{errors.message.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-accent hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:hover:scale-100 text-xs uppercase tracking-wider"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Submitting Inquiry...
                </>
              ) : (
                <>Send Catalog Inquiry</>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
