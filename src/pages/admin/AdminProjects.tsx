import * as React from 'react'
import { trpc } from '#/integrations/trpc/react'
import type { Project } from '#/models/project'
import { Button } from '#/components/ui/button'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '#/components/ui/table'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '#/components/ui/dialog'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Plus, Pencil, Trash2, ExternalLink, Loader2, AlertCircle, Terminal } from 'lucide-react'

export function AdminProjects() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [editingProject, setEditingProject] = React.useState<any>(null)
  
  const utils = trpc.useUtils()
  const { data: projects, isLoading } = trpc.projects.getProjects.useQuery()
  
  const addMutation = trpc.projects.addProject.useMutation({
    onSuccess: () => {
      utils.projects.getProjects.invalidate()
      setIsOpen(false)
      resetForm()
    }
  })

  const updateMutation = trpc.projects.updateProject.useMutation({
    onSuccess: () => {
      utils.projects.getProjects.invalidate()
      setIsOpen(false)
      resetForm()
    }
  })

  const deleteMutation = trpc.projects.deleteProject.useMutation({
    onSuccess: () => {
      utils.projects.getProjects.invalidate()
    }
  })

  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    image_url: '',
    url: ''
  })

  const resetForm = () => {
    setFormData({ name: '', description: '', image_url: '', url: '' })
    setEditingProject(null)
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setFormData({
      name: project.name,
      description: project.description || '',
      image_url: project.image_url || '',
      url: project.url || ''
    })
    setIsOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingProject) {
      updateMutation.mutate({ id: editingProject.id, ...formData })
    } else {
      addMutation.mutate(formData)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-800 pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-mono tracking-tight text-zinc-100">
            PROJECTS_
          </h2>
          <p className="mt-1 text-sm text-zinc-500 font-mono">
            &gt; manage portfolio projects
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2 font-mono bg-zinc-100 text-zinc-950 hover:bg-zinc-200">
              <Plus className="h-4 w-4" />
              ADD_PROJECT
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-zinc-800">
            <DialogHeader>
              <DialogTitle className="font-mono text-zinc-100">
                {editingProject ? '// EDIT PROJECT' : '// NEW PROJECT'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              {(addMutation.error || updateMutation.error) && (
                <div className="p-3 text-sm font-mono bg-red-950/30 border border-red-900/50 text-red-400 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {addMutation.error?.message || updateMutation.error?.message}
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="name" className="font-mono text-zinc-400 text-xs uppercase">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-zinc-900 border-zinc-800 font-mono text-zinc-100"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description" className="font-mono text-zinc-400 text-xs uppercase">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-zinc-900 border-zinc-800 font-mono text-zinc-100"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image_url" className="font-mono text-zinc-400 text-xs uppercase">Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="bg-zinc-900 border-zinc-800 font-mono text-zinc-100"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="url" className="font-mono text-zinc-400 text-xs uppercase">Project URL</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="bg-zinc-900 border-zinc-800 font-mono text-zinc-100"
                />
              </div>
              <DialogFooter>
                <Button 
                  type="submit" 
                  className="font-mono bg-zinc-100 text-zinc-950 hover:bg-zinc-200"
                  disabled={addMutation.isPending || updateMutation.isPending}
                >
                  {(addMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingProject ? 'UPDATE' : 'CREATE'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border border-zinc-800 bg-zinc-950">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
              <TableHead className="font-mono text-zinc-500 text-xs uppercase">Project</TableHead>
              <TableHead className="font-mono text-zinc-500 text-xs uppercase">URL</TableHead>
              <TableHead className="text-right font-mono text-zinc-500 text-xs uppercase">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 font-mono text-zinc-500">
                  // no projects found
                </TableCell>
              </TableRow>
            ) : (
              projects?.map((project: Project) => (
                <TableRow key={project.id} className="border-zinc-800 hover:bg-zinc-900/50">
                  <TableCell>
                    <div className="font-mono text-zinc-200">{project.name}</div>
                    <div className="text-xs font-mono text-zinc-600 line-clamp-1 max-w-[300px]">
                      {project.description || '// no description'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {project.url ? (
                      <a 
                        href={project.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-1 text-sm font-mono text-zinc-400 hover:text-zinc-100"
                      >
                        <ExternalLink className="h-3 w-3" />
                        VISIT
                      </a>
                    ) : (
                      <span className="font-mono text-xs text-zinc-600">null</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEdit(project)}
                        className="text-zinc-500 hover:text-zinc-100"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-zinc-500 hover:text-red-400"
                        onClick={() => deleteMutation.mutate({ id: project.id })}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}