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
        <Loader2 className="h-8 w-8 animate-spin text-zinc-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-800 pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-mono tracking-tight text-zinc-100">
            BLOG_POSTS_
          </h2>
          <p className="mt-1 text-sm text-zinc-500 font-mono">
            &gt; manage articles
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <button className="inline-flex items-center gap-2 font-mono bg-zinc-100 text-zinc-950 hover:bg-zinc-200 px-4 py-2 rounded-md">
              <Plus className="h-4 w-4" />
              NEW_POST
            </button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-950 border-zinc-800">
            <DialogHeader>
              <DialogTitle className="font-mono text-zinc-100">
                CREATE_NEW_POST_
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="font-mono text-zinc-400">
                  TITLE
                </Label>
                <Input
                  id="title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Enter post title..."
                  className="bg-zinc-900 border-zinc-800 font-mono text-zinc-100"
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className="font-mono border-zinc-700 text-zinc-400"
                >
                  CANCEL
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={!newTitle.trim() || isCreating}
                  className="font-mono bg-zinc-100 text-zinc-950"
                >
                  {isCreating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  CREATE
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border border-zinc-800 bg-zinc-950">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
              <TableHead className="font-mono text-zinc-500 text-xs uppercase">
                Title
              </TableHead>
              <TableHead className="font-mono text-zinc-500 text-xs uppercase">
                Created
              </TableHead>
              <TableHead className="text-right font-mono text-zinc-500 text-xs uppercase">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-8 font-mono text-zinc-500"
                >
                  // no posts found
                </TableCell>
              </TableRow>
            ) : (
              posts?.map((post) => (
                <TableRow
                  key={post.id}
                  className="border-zinc-800 hover:bg-zinc-900/50"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-zinc-600" />
                      <span className="font-mono text-zinc-200">
                        {post.title}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-zinc-500 text-sm">
                    {post.createdAt
                      ? new Date(post.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <a
                        href={'/admin/blog/' + post.id.toString()}
                        className="text-zinc-500 hover:text-zinc-100 p-2"
                      >
                        <Pencil className="h-4 w-4" />
                      </a>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-zinc-500 hover:text-red-400"
                        onClick={() => deleteMutation.mutate({ id: post.id })}
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
