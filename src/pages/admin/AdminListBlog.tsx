import * as React from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { trpc } from '#/integrations/trpc/react'
import { Button } from '#/components/ui/button'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '#/components/ui/table'
import { Plus, Pencil, Trash2, Loader2, FileText, ArrowLeft } from 'lucide-react'

import type { Post } from '#/models/post'

export function AdminListBlog() {
  const utils = trpc.useUtils()
  const { data: posts, isLoading } = trpc.blog.getPosts.useQuery()
  
  const deleteMutation = trpc.blog.deletePost.useMutation({
    onSuccess: () => {
      utils.blog.getPosts.invalidate()
    }
  })

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
        <Button asChild className="gap-2 font-mono bg-zinc-100 text-zinc-950 hover:bg-zinc-200">
          <Link to="/admin/blog/new">
            <Plus className="h-4 w-4" />
            NEW_POST
          </Link>
        </Button>
      </div>

      <div className="border border-zinc-800 bg-zinc-950">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
              <TableHead className="font-mono text-zinc-500 text-xs uppercase">Title</TableHead>
              <TableHead className="font-mono text-zinc-500 text-xs uppercase">Created</TableHead>
              <TableHead className="text-right font-mono text-zinc-500 text-xs uppercase">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 font-mono text-zinc-500">
                  // no posts found
                </TableCell>
              </TableRow>
            ) : (
              posts?.map((post: Post) => (
                <TableRow key={post.id} className="border-zinc-800 hover:bg-zinc-900/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-zinc-600" />
                      <span className="font-mono text-zinc-200">{post.title}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-zinc-500 text-sm">
                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild className="text-zinc-500 hover:text-zinc-100">
                        <Link to="/admin/blog/$id" params={{ id: post.id.toString() }}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
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