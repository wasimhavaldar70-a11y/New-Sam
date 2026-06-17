'use client'

import { useState, useTransition } from 'react'
import { Category, Product, Inquiry, Appointment } from '@/types/database'
import {
  Package,
  Layers,
  MessageSquare,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
} from 'lucide-react'
import { formatDate, cn } from '@/lib/utils'
import { updateLeadStatusAction } from '@/app/actions/adminActions'

interface DashboardClientProps {
  categories: Category[]
  products: Product[]
  inquiries: Inquiry[]
  appointments: Appointment[]
}

export default function DashboardClient({
  categories,
  products,
  inquiries,
  appointments,
}: DashboardClientProps) {
  const [inquiryList, setInquiryList] = useState<Inquiry[]>(inquiries)
  const [appointmentList, setAppointmentList] = useState<Appointment[]>(appointments)
  const [isPending, startTransition] = useTransition()

  // Handler to toggle inquiry status
  const handleToggleInquiryStatus = (id: string, currentStatus: string) => {
    const nextStatus =
      currentStatus === 'pending'
        ? 'in_progress'
        : currentStatus === 'in_progress'
        ? 'completed'
        : 'pending'

    startTransition(async () => {
      const res = await updateLeadStatusAction(id, 'inquiry', nextStatus)
      if (res.success) {
        setInquiryList((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: nextStatus as any } : item))
        )
      }
    })
  }

  // Handler to toggle appointment status
  const handleToggleAppointmentStatus = (id: string, currentStatus: string) => {
    const nextStatus =
      currentStatus === 'pending'
        ? 'scheduled'
        : currentStatus === 'scheduled'
        ? 'completed'
        : currentStatus === 'completed'
        ? 'cancelled'
        : 'pending'

    startTransition(async () => {
      const res = await updateLeadStatusAction(id, 'appointment', nextStatus)
      if (res.success) {
        setAppointmentList((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: nextStatus as any } : item))
        )
      }
    })
  }

  const totalProducts = products.length
  const totalCategories = categories.length
  const totalLeads = inquiryList.length
  const totalBookings = appointmentList.length

  // Svg Bar Chart Calculation (Products per category)
  const categoryChartData = categories.map((cat) => {
    const count = products.filter((p) => p.category_id === cat.id).length
    return { name: cat.name, count }
  })
  const maxCount = Math.max(...categoryChartData.map((d) => d.count), 1)

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1 */}
        <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-2xl flex items-center justify-between shadow-lg">
          <div className="space-y-1">
            <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Total Products</span>
            <p className="text-3xl font-extrabold text-white">{totalProducts}</p>
          </div>
          <div className="h-12 w-12 bg-blue-900/10 text-blue-400 rounded-xl flex items-center justify-center">
            <Package className="h-6 w-6" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-2xl flex items-center justify-between shadow-lg">
          <div className="space-y-1">
            <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Categories</span>
            <p className="text-3xl font-extrabold text-white">{totalCategories}</p>
          </div>
          <div className="h-12 w-12 bg-purple-900/10 text-purple-400 rounded-xl flex items-center justify-center">
            <Layers className="h-6 w-6" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-2xl flex items-center justify-between shadow-lg">
          <div className="space-y-1">
            <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Total Leads</span>
            <p className="text-3xl font-extrabold text-white">{totalLeads}</p>
          </div>
          <div className="h-12 w-12 bg-emerald-900/10 text-emerald-400 rounded-xl flex items-center justify-center">
            <MessageSquare className="h-6 w-6" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-2xl flex items-center justify-between shadow-lg">
          <div className="space-y-1">
            <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Bookings</span>
            <p className="text-3xl font-extrabold text-white">{totalBookings}</p>
          </div>
          <div className="h-12 w-12 bg-amber-900/10 text-accent rounded-xl flex items-center justify-center">
            <Calendar className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* 2. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Products breakdown */}
        <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="h-4.5 w-4.5 text-accent" /> Product Density by Category
          </h3>
          
          <div className="space-y-4 pt-2">
            {categoryChartData.map((data) => {
              const percentage = (data.count / maxCount) * 100
              return (
                <div key={data.name} className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="text-zinc-400">{data.name}</span>
                    <span className="text-white">{data.count} items</span>
                  </div>
                  <div className="w-full h-3 bg-zinc-950 rounded-full overflow-hidden border border-zinc-850">
                    <div
                      className="h-full bg-accent rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Action guidelines */}
        <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-2xl space-y-4 flex flex-col justify-center">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            CMS Guidelines
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed font-light">
            You are operating the <strong>Sangli Ceramica CMS</strong> panel. <br />
            Here, you can inspect fresh leads captured from tile inquiry forms or showroom slot bookings. To toggle lead resolution stages, simply click on the colored status badges in the tables below. This will cycle their states from <strong>Pending</strong> → <strong>In Progress</strong> → <strong>Completed</strong>.
          </p>
        </div>
      </div>

      {/* 3. Inquiries Table */}
      <div className="bg-zinc-900 border border-zinc-850 rounded-2xl p-6 shadow-lg space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Recent Product Inquiries
        </h3>

        <div className="overflow-x-auto border border-zinc-850 rounded-xl">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-zinc-950/60 border-b border-zinc-850 text-zinc-400">
                <th className="p-4 font-semibold uppercase tracking-wider text-xs">Date</th>
                <th className="p-4 font-semibold uppercase tracking-wider text-xs">Name</th>
                <th className="p-4 font-semibold uppercase tracking-wider text-xs">Phone</th>
                <th className="p-4 font-semibold uppercase tracking-wider text-xs">Product</th>
                <th className="p-4 font-semibold uppercase tracking-wider text-xs">Message</th>
                <th className="p-4 font-semibold uppercase tracking-wider text-xs">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850 text-zinc-300">
              {inquiryList.slice(0, 5).map((inq) => (
                <tr key={inq.id} className="hover:bg-zinc-900/30">
                  <td className="p-4 text-zinc-500">{formatDate(inq.created_at)}</td>
                  <td className="p-4 font-bold text-white">{inq.customer_name}</td>
                  <td className="p-4">{inq.phone}</td>
                  <td className="p-4 text-accent font-medium">
                    {inq.products?.name || 'General Query'}
                  </td>
                  <td className="p-4 text-zinc-500 max-w-xs truncate">{inq.message}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleInquiryStatus(inq.id, inq.status)}
                      className={cn(
                        'px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border cursor-pointer flex items-center gap-1.5 transition-colors',
                        inq.status === 'completed'
                          ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900'
                          : inq.status === 'in_progress'
                          ? 'bg-blue-950/40 text-blue-400 border-blue-900'
                          : 'bg-zinc-950 text-zinc-400 border-zinc-850'
                      )}
                    >
                      {inq.status === 'completed' ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : inq.status === 'in_progress' ? (
                        <Clock className="h-3 w-3" />
                      ) : (
                        <Clock className="h-3 w-3 text-zinc-650" />
                      )}
                      {inq.status}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Appointments Table */}
      <div className="bg-zinc-900 border border-zinc-850 rounded-2xl p-6 shadow-lg space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Upcoming Showroom Visits
        </h3>

        <div className="overflow-x-auto border border-zinc-850 rounded-xl">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-zinc-950/60 border-b border-zinc-850 text-zinc-400">
                <th className="p-4 font-semibold uppercase tracking-wider text-xs">Slot Date</th>
                <th className="p-4 font-semibold uppercase tracking-wider text-xs">Customer</th>
                <th className="p-4 font-semibold uppercase tracking-wider text-xs">Phone</th>
                <th className="p-4 font-semibold uppercase tracking-wider text-xs">Notes</th>
                <th className="p-4 font-semibold uppercase tracking-wider text-xs">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850 text-zinc-300">
              {appointmentList.slice(0, 5).map((appt) => (
                <tr key={appt.id} className="hover:bg-zinc-900/30">
                  <td className="p-4 text-accent font-bold">{formatDate(appt.appointment_date)}</td>
                  <td className="p-4 font-bold text-white">{appt.customer_name}</td>
                  <td className="p-4">{appt.phone}</td>
                  <td className="p-4 text-zinc-500 max-w-xs truncate">{appt.message || 'No details'}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleAppointmentStatus(appt.id, appt.status)}
                      className={cn(
                        'px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border cursor-pointer flex items-center gap-1.5 transition-colors',
                        appt.status === 'completed'
                          ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900'
                          : appt.status === 'scheduled'
                          ? 'bg-blue-950/40 text-blue-400 border-blue-900'
                          : appt.status === 'cancelled'
                          ? 'bg-red-950/40 text-red-400 border-red-900'
                          : 'bg-zinc-950 text-zinc-400 border-zinc-850'
                      )}
                    >
                      {appt.status === 'completed' ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : appt.status === 'scheduled' ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : appt.status === 'cancelled' ? (
                        <XCircle className="h-3 w-3" />
                      ) : (
                        <Clock className="h-3 w-3" />
                      )}
                      {appt.status}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
