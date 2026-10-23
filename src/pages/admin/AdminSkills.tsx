import * as React from 'react'
import { trpc } from '#/integrations/trpc/react'
import type { Skill } from '#/models/skill'
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
import { Plus, Pencil, Trash2, Loader2, AlertCircle } from 'lucide-react'

export function AdminSkills() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [editingSkill, setEditingSkill] = React.useState<any>(null)

  const utils = trpc.useUtils()
  const { data: skills, isLoading } = trpc.skills.getSkills.useQuery()

  const addMutation = trpc.skills.addSkill.useMutation({
    onSuccess: () => {
      utils.skills.getSkills.invalidate()
      setIsOpen(false)
      resetForm()
    },
  })

  const updateMutation = trpc.skills.updateSkill.useMutation({
    onSuccess: () => {
      utils.skills.getSkills.invalidate()
      setIsOpen(false)
      resetForm()
    },
  })

  const deleteMutation = trpc.skills.deleteSkill.useMutation({
    onSuccess: () => {
      utils.skills.getSkills.invalidate()
    },
  })

  const [formData, setFormData] = React.useState({
    name: '',
    icon: '',
  })

  const resetForm = () => {
    setFormData({ name: '', icon: '' })
    setEditingSkill(null)
  }

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill)
    setFormData({
      name: skill.name,
      icon: skill.icon || '',
    })
    setIsOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingSkill) {
      updateMutation.mutate({ id: editingSkill.id, ...formData })
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
            Skills
          </h2>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Add, edit, or remove the skills shown on the site.
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
              Add skill
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px] bg-background border-border">
            <DialogHeader>
              <DialogTitle className="font-mono text-foreground">
                {editingSkill ? 'Edit skill' : 'New skill'}
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
                  htmlFor="icon"
                  className="font-mono text-muted-foreground text-xs uppercase"
                >
                  Icon
                </Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  placeholder="python, database, code"
                  className="bg-secondary border-border font-mono text-foreground placeholder:text-muted-foreground/70"
                />
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
                  {editingSkill ? 'Save changes' : 'Create skill'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto border border-border bg-background max-w-2xl">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-card/60">
              <TableHead className="font-mono text-muted-foreground text-xs uppercase">
                Skill
              </TableHead>
              <TableHead className="hidden font-mono text-muted-foreground text-xs uppercase sm:table-cell">
                Icon
              </TableHead>
              <TableHead className="text-right font-mono text-muted-foreground text-xs uppercase">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skills?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-8 font-mono text-muted-foreground"
                >
                  No skills yet.
                </TableCell>
              </TableRow>
            ) : (
              skills?.map((skill: Skill) => (
                <TableRow
                  key={skill.id}
                  className="border-border hover:bg-card/60"
                >
                  <TableCell className="font-mono text-foreground">
                    {skill.name}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <code className="font-mono bg-secondary px-2 py-1 text-xs text-muted-foreground border border-border">
                      {skill.icon || 'None'}
                    </code>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(skill)}
                        aria-label={`Edit ${skill.name}`}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => deleteMutation.mutate({ id: skill.id })}
                        aria-label={`Delete ${skill.name}`}
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
