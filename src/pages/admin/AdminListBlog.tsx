import { useState } from 'react'
import { trpc } from '#/integrations/trpc/react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { Plus, Pencil, Trash2, Loader2, FileText } from 'lucide-react'

export function AdminListBlog() {
  const utils = trpc.useUtils()
  const { data: posts, isLoading, refetch } = trpc.blog.getPosts.useQuery()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const deleteMutation = trpc.blog.deletePost.useMutation({
    onSuccess: () => {
      utils.blog.getPosts.invalidate()
    },
  })

  const createMutation = trpc.blog.addPost.useMutation({
    onSuccess: (newPost) => {
      setDialogOpen(false)
      setNewTitle('')
      refetch()
      window.location.href = '/admin/blog/' + newPost.id.toString()
    },
  })

  const handleCreate = async () => {
    if (!newTitle.trim()) return
    setIsCreating(true)
    createMutation.mutate({ title: newTitle.trim(), content: '' })
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
            Blog posts
          </h2>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Write and edit posts. A post appears on the site once it has
            content.
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <button className="inline-flex items-center gap-2 font-mono bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">
              <Plus className="h-4 w-4" />
              New post
            </button>
          </DialogTrigger>
          <DialogContent className="bg-background border-border">
            <DialogHeader>
              <DialogTitle className="font-mono text-foreground">
                New post
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="font-mono text-muted-foreground"
                >
                  TITLE
                </Label>
                <Input
                  id="title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Enter post title..."
                  className="bg-secondary border-border font-mono text-foreground"
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className="font-mono border-border text-muted-foreground"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={!newTitle.trim() || isCreating}
                  className="font-mono bg-primary text-primary-foreground"
                >
                  {isCreating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Create
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto border border-border bg-background">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-card/60">
              <TableHead className="font-mono text-muted-foreground text-xs uppercase">
                Title
              </TableHead>
              <TableHead className="hidden font-mono text-muted-foreground text-xs uppercase sm:table-cell">
                Created
              </TableHead>
              <TableHead className="text-right font-mono text-muted-foreground text-xs uppercase">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-8 font-mono text-muted-foreground"
                >
                  No posts yet.
                </TableCell>
              </TableRow>
            ) : (
              posts?.map((post) => (
                <TableRow
                  key={post.id}
                  className="border-border hover:bg-card/60"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground/70" />
                      <span className="font-mono text-foreground">
                        {post.title}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden font-mono text-muted-foreground text-sm sm:table-cell">
                    {post.createdAt
                      ? new Date(post.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <a
                        href={'/admin/blog/' + post.id.toString()}
                        className="text-muted-foreground hover:text-foreground p-2"
                        aria-label={`Edit ${post.title}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </a>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => deleteMutation.mutate({ id: post.id })}
                        aria-label={`Delete ${post.title}`}
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
