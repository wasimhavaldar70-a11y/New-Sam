'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { appointmentSchema, AppointmentFormInput } from '@/lib/validation/schemas'
import { submitAppointment } from '@/app/actions/formActions'
import { Calendar, User, Phone, Mail, FileText, CheckCircle, Loader2, Sparkles } from 'lucide-react'

export default function BookAppointmentPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AppointmentFormInput>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      customer_name: '',
      phone: '',
      email: '',
      appointment_date: '',
      message: '',
    },
  })

  const onSubmit = async (data: AppointmentFormInput) => {
    setIsSubmitting(true)
    setSubmitResult(null)
    try {
      const response = await submitAppointment(data)
      if (response.success) {
        setSubmitResult({ success: true, message: response.message || 'Showroom visit booked!' })
        reset()
      } else {
        setSubmitResult({
          success: false,
          message: typeof response.error === 'string' ? response.error : 'Validation failed. Check your inputs.',
        })
      }
    } catch (error) {
      setSubmitResult({ success: false, message: 'Something went wrong. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen py-24 bg-zinc-950 flex flex-col justify-center items-center px-4">
      <div className="absolute inset-0 bg-cover bg-center opacity-5 pointer-events-none" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80')` }}></div>

      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-10 shadow-2xl relative z-10 glass-panel space-y-8">
        
        {submitResult?.success ? (
          /* SUCCESS STATE */
          <div className="text-center py-12 space-y-6 animate-fade-in">
            <div className="h-16 w-16 bg-emerald-600/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
              <CheckCircle className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold text-white">Visit Scheduled!</h2>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-md mx-auto">
                {submitResult.message} Our showroom executive will contact you shortly to confirm your slot and arrange a VIP walkthrough.
              </p>
            </div>
            <button
              onClick={() => setSubmitResult(null)}
              className="inline-flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              Book Another Session
            </button>
          </div>
        ) : (
          /* FORM STATE */
          <>
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-1 bg-accent/15 text-accent text-xs font-bold uppercase px-3 py-1 rounded-full border border-accent/20">
                <Sparkles className="h-3.5 w-3.5" /> VIP Showroom Access
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Schedule a Private Visit
              </h1>
              <p className="text-zinc-400 text-sm md:text-base max-w-md mx-auto leading-relaxed font-light">
                Fill in your details below to schedule a consultation with our interior and ceramics architects.
              </p>
            </div>

            {submitResult && !submitResult.success && (
              <div className="bg-red-900/15 border border-red-500/25 text-red-200 px-4 py-3 rounded-xl text-sm text-center">
                {submitResult.message}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Customer Name */}
                <div className="space-y-2">
                  <label htmlFor="customer_name" className="text-sm font-medium text-zinc-300 flex items-center gap-1.5">
                    <User className="h-4 w-4 text-accent" />
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="customer_name"
                    type="text"
                    placeholder="Enter your full name"
                    {...register('customer_name')}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-accent focus:ring-1 focus:ring-accent text-white rounded-xl px-4 py-3 text-sm transition-all placeholder-zinc-600"
                  />
                  {errors.customer_name && (
                    <p className="text-xs text-red-500 font-semibold">{errors.customer_name.message}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-zinc-300 flex items-center gap-1.5">
                    <Phone className="h-4 w-4 text-accent" />
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="e.g. 9876543210"
                    {...register('phone')}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-accent focus:ring-1 focus:ring-accent text-white rounded-xl px-4 py-3 text-sm transition-all placeholder-zinc-600"
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500 font-semibold">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Email Address */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-zinc-300 flex items-center gap-1.5">
                    <Mail className="h-4 w-4 text-accent" />
                    Email Address <span className="text-zinc-650">(Optional)</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="e.g. john@example.com"
                    {...register('email')}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-accent focus:ring-1 focus:ring-accent text-white rounded-xl px-4 py-3 text-sm transition-all placeholder-zinc-600"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 font-semibold">{errors.email.message}</p>
                  )}
                </div>

                {/* Appointment Date */}
                <div className="space-y-2">
                  <label htmlFor="appointment_date" className="text-sm font-medium text-zinc-300 flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-accent" />
                    Preferred Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="appointment_date"
                    type="date"
                    {...register('appointment_date')}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-accent focus:ring-1 focus:ring-accent text-white rounded-xl px-4 py-3 text-sm transition-all text-zinc-400"
                  />
                  {errors.appointment_date && (
                    <p className="text-xs text-red-500 font-semibold">{errors.appointment_date.message}</p>
                  )}
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-zinc-300 flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-accent" />
                  Reason for Visit / Requirements <span className="text-zinc-650">(Optional)</span>
                </label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="e.g. Looking for 800x1600mm floor tiles for my living room, and sanitary closets..."
                  {...register('message')}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-accent focus:ring-1 focus:ring-accent text-white rounded-xl px-4 py-3 text-sm transition-all placeholder-zinc-600 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent hover:bg-amber-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-accent/15 transition-all flex items-center justify-center gap-2 hover:scale-101 disabled:opacity-50 disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Scheduling your visit...
                  </>
                ) : (
                  <>
                    <Calendar className="h-5 w-5" /> Book Appointment
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
