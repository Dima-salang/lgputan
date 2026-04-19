import * as React from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { trpc } from '#/integrations/trpc/react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Textarea } from '#/components/ui/textarea'
import { ArrowLeft, Loader2, Save, Terminal } from 'lucide-react'

export function AdminEditBlog() {
  const { id } = useParams({ strict: false })
  const isNew = !id || id === 'new'
  const navigate = useNavigate()
  const utils = trpc.useUtils()

  const [title, setTitle] = React.useState('')
  const [content, setContent] = React.useState('')

  const { data: post, isLoading: isFetching } = trpc.blog.getPost.useQuery(
    { id: parseInt(id!) },
    { enabled: !isNew }
  )

  React.useEffect(() => {
    if (post) {
      setTitle(post.title)
      setContent(post.content)
    }
  }, [post])

  const addMutation = trpc.blog.addPost.useMutation({
    onSuccess: () => {
      utils.blog.getPosts.invalidate()
      navigate({ to: '/admin/blog' })
    }
  })

  const updateMutation = trpc.blog.updatePost.useMutation({
    onSuccess: () => {
      utils.blog.getPosts.invalidate()
      navigate({ to: '/admin/blog' })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isNew) {
      addMutation.mutate({ title, content })
    } else {
      updateMutation.mutate({ id: parseInt(id!), title, content })
    }
  }

  if (!isNew && isFetching) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 border-b border-zinc-800 pb-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate({ to: '/admin/blog' })}
          className="text-zinc-500 hover:text-zinc-100"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold font-mono tracking-tight text-zinc-100">
            {isNew ? 'NEW_POST_' : 'EDIT_POST_'}
          </h2>
          <p className="text-sm text-zinc-500 font-mono">
            &gt; {isNew ? 'create article' : 'modify article'}
          </p>
        </div>
      </div>

      <div className="border border-zinc-800 bg-zinc-950 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="title" className="font-mono text-zinc-400 text-xs uppercase">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title..."
              required
              className="bg-zinc-900 border-zinc-800 font-mono text-zinc-100 text-lg"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="content" className="font-mono text-zinc-400 text-xs uppercase">Content (Markdown)</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your content here..."
              required
              className="min-h-[400px] bg-zinc-900 border-zinc-800 font-mono text-sm text-zinc-100 resize-y"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate({ to: '/admin/blog' })}
              className="font-mono border-zinc-700 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
            >
              CANCEL
            </Button>
            <Button 
              type="submit" 
              className="font-mono bg-zinc-100 text-zinc-950 hover:bg-zinc-200"
              disabled={addMutation.isPending || updateMutation.isPending}
            >
              {(addMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isNew ? 'PUBLISH' : 'SAVE'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}