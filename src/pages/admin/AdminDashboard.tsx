import * as React from 'react'
import { trpc } from '#/integrations/trpc/react'
import { 
  Briefcase, 
  FileText, 
  Link2, 
  Table2,
  Activity,
  Loader2
} from 'lucide-react'

export function AdminDashboard() {
  const { data: projects, isLoading: projectsLoading } = trpc.projects.getProjects.useQuery()
  const { data: skills, isLoading: skillsLoading } = trpc.skills.getSkills.useQuery()
  const { data: posts, isLoading: postsLoading } = trpc.blog.getPosts.useQuery()
  const { data: links, isLoading: linksLoading } = trpc.quickLinks.getQuickLinks.useQuery()

  const stats = [
    { name: 'Projects', value: projects?.length || 0, icon: Briefcase, color: 'text-amber-500' },
    { name: 'Skills', value: skills?.length || 0, icon: Table2, color: 'text-cyan-500' },
    { name: 'Blog Posts', value: posts?.length || 0, icon: FileText, color: 'text-violet-500' },
    { name: 'Quick Links', value: links?.length || 0, icon: Link2, color: 'text-emerald-500' },
  ]

  const isLoading = projectsLoading || skillsLoading || postsLoading || linksLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-zinc-800 pb-4">
        <h2 className="text-2xl font-bold font-mono tracking-tight text-zinc-100">
          DASHBOARD_
        </h2>
        <p className="mt-1 text-sm text-zinc-500 font-mono">
          &gt; system overview
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div 
            key={stat.name} 
            className="group relative bg-zinc-900/50 border border-zinc-800 p-5 hover:border-zinc-700 transition-colors"
          >
            <div className="absolute top-3 right-3">
              <stat.icon className={`h-5 w-5 ${stat.color} opacity-60 group-hover:opacity-100 transition-opacity`} />
            </div>
            <div className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">
              {stat.name}
            </div>
            <div className="text-3xl font-bold font-mono text-zinc-100">
              {stat.value}
            </div>
            <div className="absolute bottom-0 left-0 h-0.5 w-full bg-zinc-800 group-hover:bg-zinc-700 transition-colors" />
          </div>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="bg-zinc-900/30 border border-zinc-800 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-4 w-4 text-zinc-500" />
            <span className="text-sm font-mono text-zinc-400 uppercase tracking-wider">
              Recent Activity
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm font-mono">
              <span className="text-zinc-600">{'>'}</span>
              <span className="text-zinc-400">system operational</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-mono">
              <span className="text-zinc-600">{'>'}</span>
              <span className="text-zinc-400">database connected</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-mono">
              <span className="text-zinc-600">{'>'}</span>
              <span className="text-zinc-400">auth enabled</span>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/30 border border-zinc-800 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-4 w-4 text-zinc-500" />
            <span className="text-sm font-mono text-zinc-400 uppercase tracking-wider">
              Quick Stats
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm font-mono">
              <span className="text-zinc-500">total entries</span>
              <span className="text-zinc-300">
                {(projects?.length || 0) + (skills?.length || 0) + (posts?.length || 0) + (links?.length || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm font-mono">
              <span className="text-zinc-500">last updated</span>
              <span className="text-zinc-300">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}