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
    }
  })

  const updateMutation = trpc.skills.updateSkill.useMutation({
    onSuccess: () => {
      utils.skills.getSkills.invalidate()
      setIsOpen(false)
      resetForm()
    }
  })

  const deleteMutation = trpc.skills.deleteSkill.useMutation({
    onSuccess: () => {
      utils.skills.getSkills.invalidate()
    }
  })

  const [formData, setFormData] = React.useState({
    name: '',
    icon: ''
  })

  const resetForm = () => {
    setFormData({ name: '', icon: '' })
    setEditingSkill(null)
  }

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill)
    setFormData({
      name: skill.name,
      icon: skill.icon || ''
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
        <Loader2 className="h-8 w-8 animate-spin text-zinc-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-800 pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-mono tracking-tight text-zinc-100">
            SKILLS_
          </h2>
          <p className="mt-1 text-sm text-zinc-500 font-mono">
            &gt; manage technical skills
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2 font-mono bg-zinc-100 text-zinc-950 hover:bg-zinc-200">
              <Plus className="h-4 w-4" />
              ADD_SKILL
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px] bg-zinc-950 border-zinc-800">
            <DialogHeader>
              <DialogTitle className="font-mono text-zinc-100">
                {editingSkill ? '// EDIT SKILL' : '// NEW SKILL'}
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
                <Label htmlFor="icon" className="font-mono text-zinc-400 text-xs uppercase">Icon (Lucide)</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="React, Code, Database..."
                  className="bg-zinc-900 border-zinc-800 font-mono text-zinc-100 placeholder:text-zinc-600"
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
                  {editingSkill ? 'UPDATE' : 'CREATE'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border border-zinc-800 bg-zinc-950 max-w-2xl">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
              <TableHead className="font-mono text-zinc-500 text-xs uppercase">Skill</TableHead>
              <TableHead className="font-mono text-zinc-500 text-xs uppercase">Icon</TableHead>
              <TableHead className="text-right font-mono text-zinc-500 text-xs uppercase">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skills?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 font-mono text-zinc-500">
                  // no skills found
                </TableCell>
              </TableRow>
            ) : (
              skills?.map((skill: Skill) => (
                <TableRow key={skill.id} className="border-zinc-800 hover:bg-zinc-900/50">
                  <TableCell className="font-mono text-zinc-200">{skill.name}</TableCell>
                  <TableCell>
                    <code className="font-mono bg-zinc-900 px-2 py-1 text-xs text-zinc-400 border border-zinc-800">
                      {skill.icon || 'null'}
                    </code>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEdit(skill)}
                        className="text-zinc-500 hover:text-zinc-100"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-zinc-500 hover:text-red-400"
                        onClick={() => deleteMutation.mutate({ id: skill.id })}
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