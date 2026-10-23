import { useState, useEffect } from 'react'
import { useParams } from '@tanstack/react-router'
import { trpc } from '#/integrations/trpc/react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { RichTextEditor } from '#/components/admin/RichTextEditor'
import { ArrowLeft, Loader2 } from 'lucide-react'

export function AdminEditBlog() {
  const { id } = useParams({ strict: false })
  const isNew = !id || id === 'new'
  const utils = trpc.useUtils()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const { data: post, isLoading: isFetching } = trpc.blog.getPost.useQuery(
    { id: parseInt(id!) },
    { enabled: !isNew && !!id },
  )

  useEffect(() => {
    if (post) {
      setTitle(post.title)
      setContent(post.content)
    }
  }, [post])

  const addMutation = trpc.blog.addPost.useMutation({
    onSuccess: () => {
      utils.blog.getPosts.invalidate()
      window.location.href = '/admin/blog'
    },
  })

  const updateMutation = trpc.blog.updatePost.useMutation({
    onSuccess: () => {
      utils.blog.getPosts.invalidate()
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isNew) {
      addMutation.mutate({ title, content })
    } else {
      updateMutation.mutate({ id: parseInt(id), title, content })
    }
  }

  const handleBack = () => {
    window.location.href = '/admin/blog'
  }

  if (!isNew && isFetching) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/70" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 border-b border-border pb-4">
        <button
          onClick={handleBack}
          aria-label="Back to posts"
          className="text-muted-foreground hover:text-foreground p-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h2 className="font-display text-4xl leading-none text-foreground">
            {isNew ? 'New post' : 'Edit post'}
          </h2>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            {isNew ? 'Write a new post.' : 'Edit this post.'}
          </p>
        </div>
      </div>

      <div className="border border-border bg-background">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-2 p-6 pb-0">
            <Label
              htmlFor="title"
              className="font-mono text-muted-foreground text-xs uppercase"
            >
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title..."
              required
              className="bg-secondary border-border font-mono text-foreground text-lg"
            />
          </div>

          <div className="grid gap-2 px-6">
            <span className="font-mono text-muted-foreground text-xs uppercase">
              Content
            </span>
            <RichTextEditor value={content} onChange={setContent} />
            <p className="font-mono text-[10px] text-muted-foreground">
              Use the toolbar to add headings, lists, links, and code.
            </p>
          </div>

          <div className="flex justify-end gap-3 px-6 pb-6 pt-4 border-t border-border">
            <button
              type="button"
              onClick={handleBack}
              className="font-mono border border-border text-muted-foreground hover:text-foreground hover:bg-secondary px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <Button
              type="submit"
              className="font-mono bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={addMutation.isPending || updateMutation.isPending}
            >
              {(addMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isNew ? 'Publish' : 'Save changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
