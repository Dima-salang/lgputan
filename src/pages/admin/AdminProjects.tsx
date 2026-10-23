import * as React from 'react'
import { splitLinks } from '#/lib/data'
import { trpc } from '#/integrations/trpc/react'
import type { Project } from '#/models/project'
import { Button } from '#/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '#/components/ui/dialog'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import {
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Loader2,
  AlertCircle,
} from 'lucide-react'

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
    },
  })

  const updateMutation = trpc.projects.updateProject.useMutation({
    onSuccess: () => {
      utils.projects.getProjects.invalidate()
      setIsOpen(false)
      resetForm()
    },
  })

  const deleteMutation = trpc.projects.deleteProject.useMutation({
    onSuccess: () => {
      utils.projects.getProjects.invalidate()
    },
  })

  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    image_url: '',
    url: '',
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
      url: project.url || '',
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
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/70" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4 flex items-center justify-between">
        <div>
          <h2 className="font-display text-4xl leading-none text-foreground">
            Projects
          </h2>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Add, edit, or remove the projects shown on the site.
          </p>
        </div>
        <Dialog
          open={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button className="gap-2 font-mono bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              Add project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-background border-border">
            <DialogHeader>
              <DialogTitle className="font-mono text-foreground">
                {editingProject ? 'Edit project' : 'New project'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              {(addMutation.error || updateMutation.error) && (
                <div className="p-3 text-sm font-mono bg-destructive/10 border border-destructive/30 text-destructive flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {addMutation.error?.message || updateMutation.error?.message}
                </div>
              )}
              <div className="grid gap-2">
                <Label
                  htmlFor="name"
                  className="font-mono text-muted-foreground text-xs uppercase"
                >
                  Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="bg-secondary border-border font-mono text-foreground"
                />
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="description"
                  className="font-mono text-muted-foreground text-xs uppercase"
                >
                  Description
                </Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="bg-secondary border-border font-mono text-foreground"
                />
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="image_url"
                  className="font-mono text-muted-foreground text-xs uppercase"
                >
                  Image URL
                </Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
                  }
                  className="bg-secondary border-border font-mono text-foreground"
                />
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="url"
                  className="font-mono text-muted-foreground text-xs uppercase"
                >
                  Project links
                </Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                  placeholder="https://github.com, https://demo.com"
                  className="bg-secondary border-border font-mono text-foreground"
                />
                <p className="text-xs font-mono text-muted-foreground/70">
                  Add one or more links, separated by commas.
                </p>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  className="font-mono bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={addMutation.isPending || updateMutation.isPending}
                >
                  {(addMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingProject ? 'Save changes' : 'Create project'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto border border-border bg-background">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-card/60">
              <TableHead className="font-mono text-muted-foreground text-xs uppercase">
                Project
              </TableHead>
              <TableHead className="hidden font-mono text-muted-foreground text-xs uppercase sm:table-cell">
                URL
              </TableHead>
              <TableHead className="text-right font-mono text-muted-foreground text-xs uppercase">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-8 font-mono text-muted-foreground"
                >
                  No projects yet.
                </TableCell>
              </TableRow>
            ) : (
              projects?.map((project: Project) => (
                <TableRow
                  key={project.id}
                  className="border-border hover:bg-card/60"
                >
                  <TableCell>
                    <div className="font-mono text-foreground">
                      {project.name}
                    </div>
                    <div className="text-xs font-mono text-muted-foreground/70 line-clamp-1 max-w-[300px]">
                      {project.description || 'No description'}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {project.url ? (
                      <div className="flex flex-wrap gap-2">
                        {splitLinks(project.url).map((link) => (
                          <a
                            key={link.href}
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-sm font-mono text-muted-foreground hover:text-foreground"
                          >
                            <ExternalLink className="h-3 w-3" />
                            {link.label}
                          </a>
                        ))}
                      </div>
                    ) : (
                      <span className="font-mono text-xs text-muted-foreground/70">
                        None
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(project)}
                        aria-label={`Edit ${project.name}`}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() =>
                          deleteMutation.mutate({ id: project.id })
                        }
                        aria-label={`Delete ${project.name}`}
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
