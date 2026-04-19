import { trpc } from '#/integrations/trpc/react'
import type { QuickLink } from '#/models/quick_link'
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
import { Plus, Trash2, ExternalLink, Loader2, AlertCircle, Terminal } from 'lucide-react'
import React from 'react'

export function AdminQuickLinks() {
  const [isOpen, setIsOpen] = React.useState(false)
  
  const utils = trpc.useUtils()
  const { data: links, isLoading } = trpc.quickLinks.getQuickLinks.useQuery()
  
  const addMutation = trpc.quickLinks.addQuickLink.useMutation({
    onSuccess: () => {
      utils.quickLinks.getQuickLinks.invalidate()
      setIsOpen(false)
      resetForm()
    }
  })

  const deleteMutation = trpc.quickLinks.deleteQuickLink.useMutation({
    onSuccess: () => {
      utils.quickLinks.getQuickLinks.invalidate()
    }
  })

  const [formData, setFormData] = React.useState({
    name: '',
    url: '',
    icon: '',
    type: 'social'
  })

  const resetForm = () => {
    setFormData({ name: '', url: '', icon: '', type: 'social' })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addMutation.mutate(formData)
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
            QUICK_LINKS_
          </h2>
          <p className="mt-1 text-sm text-zinc-500 font-mono">
            &gt; manage external links
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2 font-mono bg-zinc-100 text-zinc-950 hover:bg-zinc-200">
              <Plus className="h-4 w-4" />
              ADD_LINK
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px] bg-zinc-950 border-zinc-800">
            <DialogHeader>
              <DialogTitle className="font-mono text-zinc-100">
                // NEW LINK
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              {addMutation.error && (
                <div className="p-3 text-sm font-mono bg-red-950/30 border border-red-900/50 text-red-400 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {addMutation.error.message}
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
                <Label htmlFor="url" className="font-mono text-zinc-400 text-xs uppercase">URL</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  required
                  className="bg-zinc-900 border-zinc-800 font-mono text-zinc-100"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="icon" className="font-mono text-zinc-400 text-xs uppercase">Icon</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="Github, Twitter..."
                  className="bg-zinc-900 border-zinc-800 font-mono text-zinc-100 placeholder:text-zinc-600"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type" className="font-mono text-zinc-400 text-xs uppercase">Type</Label>
                <Input
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  placeholder="social, work..."
                  className="bg-zinc-900 border-zinc-800 font-mono text-zinc-100 placeholder:text-zinc-600"
                />
              </div>
              <DialogFooter>
                <Button 
                  type="submit" 
                  className="font-mono bg-zinc-100 text-zinc-950 hover:bg-zinc-200"
                  disabled={addMutation.isPending}
                >
                  {addMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  CREATE
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
              <TableHead className="font-mono text-zinc-500 text-xs uppercase">Name</TableHead>
              <TableHead className="font-mono text-zinc-500 text-xs uppercase">Type</TableHead>
              <TableHead className="font-mono text-zinc-500 text-xs uppercase">URL</TableHead>
              <TableHead className="text-right font-mono text-zinc-500 text-xs uppercase">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 font-mono text-zinc-500">
                  // no links found
                </TableCell>
              </TableRow>
            ) : (
              links?.map((link: QuickLink) => (
                <TableRow key={link.id} className="border-zinc-800 hover:bg-zinc-900/50">
                  <TableCell className="font-mono text-zinc-200">{link.name}</TableCell>
                  <TableCell>
                    <span className="font-mono text-xs bg-zinc-900 px-2 py-1 text-zinc-400 border border-zinc-800 uppercase">
                      {link.type}
                    </span>
                  </TableCell>
                  <TableCell>
                    <a 
                      href={link.url!} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center gap-1 text-sm font-mono text-zinc-400 hover:text-zinc-100"
                    >
                      <ExternalLink className="h-3 w-3" />
                      VISIT
                    </a>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-zinc-500 hover:text-red-400"
                      onClick={() => deleteMutation.mutate({ id: link.id })}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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