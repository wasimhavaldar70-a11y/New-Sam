'use client'

import { useState, useEffect } from 'react'
import { getProjects } from '@/services/api'
import { Project } from '@/types/database'
import { MapPin, Trophy, ShieldAlert } from 'lucide-react'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen py-24 bg-zinc-950 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">
        <div className="inline-flex items-center gap-1.5 bg-accent/15 text-accent text-xs font-bold uppercase px-3 py-1 rounded-full border border-accent/20">
          <Trophy className="h-3.5 w-3.5" /> Landmark Installs
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-none">
          Completed Projects
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed font-light">
          Review premium commercial properties and private residences styled and supplied by Sangli Ceramica.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-96 bg-zinc-900 rounded-2xl animate-pulse border border-zinc-800"
              ></div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 space-y-3 bg-zinc-900/20 rounded-2xl border border-zinc-900">
            <ShieldAlert className="h-10 w-10 text-zinc-700 mx-auto" />
            <h3 className="text-lg font-bold text-white">No projects found</h3>
            <p className="text-xs text-zinc-500">There are no completed projects in our portfolio yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="group bg-zinc-900/30 rounded-2xl overflow-hidden border border-zinc-850 hover:border-zinc-800 transition-all duration-350"
              >
                <div className="h-64 relative overflow-hidden bg-zinc-950">
                  <img
                    src={proj.image_url || ''}
                    alt={proj.title}
                    className="w-full h-full object-cover transition-transform duration-550 group-hover:scale-104"
                    loading="lazy"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-1 text-xs text-accent font-semibold">
                    <MapPin className="h-3.5 w-3.5" />
                    {proj.location}
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors duration-200">
                    {proj.title}
                  </h3>
                  <p className="text-sm text-zinc-500 leading-relaxed font-light">
                    {proj.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
