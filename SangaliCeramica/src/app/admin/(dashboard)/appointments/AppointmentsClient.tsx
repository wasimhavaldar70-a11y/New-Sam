'use client'

import { useState, useTransition } from 'react'
import { Appointment } from '@/types/database'
import {
  Calendar,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  HelpCircle,
  Search,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { updateLeadStatusAction } from '@/app/actions/adminActions'
import { cn } from '@/lib/utils'

interface AppointmentsClientProps {
  initialAppointments: Appointment[]
}

export default function AppointmentsClient({
  initialAppointments,
}: AppointmentsClientProps) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments)
  const [filterStatus, setFilterStatus] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [isPending, startTransition] = useTransition()

  // Cycle status: pending -> scheduled -> completed -> cancelled -> pending
  const handleToggleStatus = (id: string, currentStatus: string) => {
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
        setAppointments((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: nextStatus as any } : item))
        )
      }
    })
  }

  const filteredAppointments = appointments.filter((appt) => {
    const matchesSearch =
      appt.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.phone.includes(searchQuery)
    const matchesFilter = filterStatus === 'All' || appt.status === filterStatus

    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Search and Filter Row */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-650" />
          <input
            type="text"
            placeholder="Search bookings by customer name/phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-850 text-white rounded-xl pl-10 pr-3 py-2.5 text-xs focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder-zinc-650"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {['All', 'pending', 'scheduled', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer capitalize shrink-0',
                filterStatus === status
                  ? 'bg-accent text-white border-accent'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-850 hover:text-white'
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-zinc-900 border border-zinc-850 rounded-2xl overflow-hidden shadow-lg">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <HelpCircle className="h-8 w-8 text-zinc-700 mx-auto" />
            <h4 className="text-sm font-bold text-white">No visits scheduled</h4>
            <p className="text-xs text-zinc-500">There are no slots matching your query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-zinc-950/60 border-b border-zinc-850 text-zinc-400">
                  <th className="p-4 font-semibold uppercase tracking-wider text-xs">Slot Date</th>
                  <th className="p-4 font-semibold uppercase tracking-wider text-xs">Customer Name</th>
                  <th className="p-4 font-semibold uppercase tracking-wider text-xs">Phone & Email</th>
                  <th className="p-4 font-semibold uppercase tracking-wider text-xs">Customer Notes</th>
                  <th className="p-4 font-semibold uppercase tracking-wider text-xs">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850 text-zinc-300">
                {filteredAppointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-zinc-900/30">
                    {/* Date */}
                    <td className="p-4 font-bold text-accent">
                      {formatDate(appt.appointment_date)}
                    </td>

                    {/* Customer */}
                    <td className="p-4 font-bold text-white">
                      {appt.customer_name}
                    </td>

                    {/* Contact Details */}
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-zinc-650" />
                          <span>{appt.phone}</span>
                        </div>
                        {appt.email && (
                          <div className="flex items-center gap-1 text-zinc-500 text-[11px]">
                            <Mail className="h-3 w-3 text-zinc-650" />
                            <span>{appt.email}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Notes */}
                    <td className="p-4 text-zinc-400 font-light leading-relaxed max-w-sm">
                      {appt.message || <span className="text-zinc-700 italic">No instructions specified</span>}
                    </td>

                    {/* Status Toggle */}
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleStatus(appt.id, appt.status)}
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
                        title="Click to cycle status"
                      >
                        {appt.status === 'completed' ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : appt.status === 'scheduled' ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : appt.status === 'cancelled' ? (
                          <XCircle className="h-3 w-3 text-red-400" />
                        ) : (
                          <Clock className="h-3 w-3 text-zinc-650" />
                        )}
                        {appt.status}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
