import { trpc } from '#/integrations/trpc/react'
import type { QuickLink } from '#/models/quick_link'
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
import { Plus, Trash2, ExternalLink, Loader2, AlertCircle } from 'lucide-react'
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
    },
  })

  const deleteMutation = trpc.quickLinks.deleteQuickLink.useMutation({
    onSuccess: () => {
      utils.quickLinks.getQuickLinks.invalidate()
    },
  })

  const [formData, setFormData] = React.useState({
    name: '',
    url: '',
    icon: '',
    type: 'social',
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
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/70" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4 flex items-center justify-between">
        <div>
          <h2 className="font-display text-4xl leading-none text-foreground">
            Quick links
          </h2>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Add or remove the links shown in the site footer.
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
              Add link
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px] bg-background border-border">
            <DialogHeader>
              <DialogTitle className="font-mono text-foreground">
                New link
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              {addMutation.error && (
                <div className="p-3 text-sm font-mono bg-destructive/10 border border-destructive/30 text-destructive flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {addMutation.error.message}
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
                  htmlFor="url"
                  className="font-mono text-muted-foreground text-xs uppercase"
                >
                  URL
                </Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
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
                  placeholder="github, linkedin, globe"
                  className="bg-secondary border-border font-mono text-foreground placeholder:text-muted-foreground/70"
                />
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="type"
                  className="font-mono text-muted-foreground text-xs uppercase"
                >
                  Type
                </Label>
                <Input
                  id="type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  placeholder="social, work"
                  className="bg-secondary border-border font-mono text-foreground placeholder:text-muted-foreground/70"
                />
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  className="font-mono bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={addMutation.isPending}
                >
                  {addMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save link
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
                Name
              </TableHead>
              <TableHead className="hidden font-mono text-muted-foreground text-xs uppercase sm:table-cell">
                Type
              </TableHead>
              <TableHead className="font-mono text-muted-foreground text-xs uppercase">
                URL
              </TableHead>
              <TableHead className="text-right font-mono text-muted-foreground text-xs uppercase">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 font-mono text-muted-foreground"
                >
                  No links yet.
                </TableCell>
              </TableRow>
            ) : (
              links?.map((link: QuickLink) => (
                <TableRow
                  key={link.id}
                  className="border-border hover:bg-card/60"
                >
                  <TableCell className="font-mono text-foreground">
                    {link.name}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="font-mono text-xs bg-secondary px-2 py-1 text-muted-foreground border border-border uppercase">
                      {link.type}
                    </span>
                  </TableCell>
                  <TableCell>
                    <a
                      href={link.url!}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-sm font-mono text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Open
                    </a>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => deleteMutation.mutate({ id: link.id })}
                      aria-label={`Delete ${link.name}`}
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
