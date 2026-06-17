'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Inquiry } from '@/types/database'
import {
  FileDown,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  HelpCircle,
  Search,
  ChevronRight,
  Database,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { updateLeadStatusAction } from '@/app/actions/adminActions'
import { cn } from '@/lib/utils'

interface InquiriesClientProps {
  initialInquiries: Inquiry[]
}

export default function InquiriesClient({ initialInquiries }: InquiriesClientProps) {
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries)
  const [filterStatus, setFilterStatus] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [isPending, startTransition] = useTransition()

  // Cycle status: pending -> in_progress -> completed -> pending
  const handleToggleStatus = (id: string, currentStatus: string) => {
    const nextStatus =
      currentStatus === 'pending'
        ? 'in_progress'
        : currentStatus === 'in_progress'
        ? 'completed'
        : 'pending'

    startTransition(async () => {
      const res = await updateLeadStatusAction(id, 'inquiry', nextStatus)
      if (res.success) {
        setInquiries((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: nextStatus as any } : item))
        )
      }
    })
  }

  // Export inquiries to CSV
  const handleExportCSV = () => {
    if (inquiries.length === 0) return

    const headers = ['Date', 'Customer Name', 'Phone', 'Email', 'Product Name', 'Message', 'Status']
    const rows = inquiries.map((inq) => [
      formatDate(inq.created_at),
      inq.customer_name,
      inq.phone,
      inq.email || 'N/A',
      inq.products?.name || 'General Query',
      (inq.message || '').replace(/"/g, '""'), // escape quotes
      inq.status,
    ])

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.map((val) => `"${val}"`).join(','))].join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `sangli_ceramica_inquiries_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.phone.includes(searchQuery) ||
      (inq.products?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'All' || inq.status === filterStatus

    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Search, Filter, and Export Row */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-650" />
          <input
            type="text"
            placeholder="Search leads by customer name/phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-850 text-white rounded-xl pl-10 pr-3 py-2.5 text-xs focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder-zinc-650"
          />
        </div>

        {/* Filter status & Export */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {['All', 'pending', 'in_progress', 'completed'].map((status) => (
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

          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-md shadow-emerald-650/10 shrink-0 ml-auto"
          >
            <FileDown className="h-4 w-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Leads Listing Table */}
      <div className="bg-zinc-900 border border-zinc-850 rounded-2xl overflow-hidden shadow-lg">
        {filteredInquiries.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <HelpCircle className="h-8 w-8 text-zinc-700 mx-auto" />
            <h4 className="text-sm font-bold text-white">No inquiries found</h4>
            <p className="text-xs text-zinc-500">There are no inquiries matching your query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-zinc-950/60 border-b border-zinc-850 text-zinc-400">
                  <th className="p-4 font-semibold uppercase tracking-wider text-xs">Date</th>
                  <th className="p-4 font-semibold uppercase tracking-wider text-xs">Customer Details</th>
                  <th className="p-4 font-semibold uppercase tracking-wider text-xs">Product Target</th>
                  <th className="p-4 font-semibold uppercase tracking-wider text-xs">Message</th>
                  <th className="p-4 font-semibold uppercase tracking-wider text-xs">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850 text-zinc-300">
                {filteredInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-zinc-900/30">
                    {/* Date */}
                    <td className="p-4 text-zinc-500 font-medium">
                      {formatDate(inq.created_at)}
                    </td>

                    {/* Customer */}
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="font-bold text-white">{inq.customer_name}</div>
                        <div className="flex flex-col gap-0.5 text-zinc-500 text-[11px]">
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3 text-zinc-650" /> {inq.phone}
                          </span>
                          {inq.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3 text-zinc-650" /> {inq.email}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Target Product */}
                    <td className="p-4">
                      {inq.products ? (
                        <Link
                          href={`/products/${inq.products.slug}`}
                          target="_blank"
                          className="text-accent hover:underline font-semibold"
                        >
                          {inq.products.name}
                        </Link>
                      ) : (
                        <span className="text-zinc-550 italic">General Showroom Query</span>
                      )}
                    </td>

                    {/* Message */}
                    <td className="p-4 text-zinc-400 font-light leading-relaxed max-w-sm">
                      {inq.message}
                    </td>

                    {/* Status Toggle */}
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleStatus(inq.id, inq.status)}
                        className={cn(
                          'px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border cursor-pointer flex items-center gap-1.5 transition-colors',
                          inq.status === 'completed'
                            ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900'
                            : inq.status === 'in_progress'
                            ? 'bg-blue-950/40 text-blue-400 border-blue-900'
                            : 'bg-zinc-950 text-zinc-400 border-zinc-850'
                        )}
                        title="Click to cycle status"
                      >
                        {inq.status === 'completed' ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : inq.status === 'in_progress' ? (
                          <Clock className="h-3 w-3 animate-pulse text-blue-400" />
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
        )}
      </div>
    </div>
  )
}
