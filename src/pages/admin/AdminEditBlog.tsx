import { useState, useEffect } from 'react'
import { useParams } from '@tanstack/react-router'
import { trpc } from '#/integrations/trpc/react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Textarea } from '#/components/ui/textarea'
import { ArrowLeft, Loader2, Eye, Edit3 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function AdminEditBlog() {
  const { id } = useParams({ strict: false })
  const isNew = !id || id === 'new'
  const utils = trpc.useUtils()
  const [showPreview, setShowPreview] = useState(false)

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

          <div className="flex items-center gap-2 px-6 border-b border-border">
            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-mono border-b-2 transition-colors ${
                !showPreview
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground/90'
              }`}
            >
              <Edit3 className="h-4 w-4" />
              Write
            </button>
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-mono border-b-2 transition-colors ${
                showPreview
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground/90'
              }`}
            >
              <Eye className="h-4 w-4" />
              Preview
            </button>
          </div>

          <div className="p-6 pt-0">
            {showPreview ? (
              <div className="prose max-w-none min-h-[400px] p-4 bg-card/60 rounded-lg border border-border">
                {content ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                  </ReactMarkdown>
                ) : (
                  <p className="text-muted-foreground font-mono">
                    Nothing to preview yet.
                  </p>
                )}
              </div>
            ) : (
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`Write your content here using Markdown...

# Heading 1
## Heading 2

**bold text** and *italic text*

- List item 1
- List item 2

[link text](https://example.com)

\`code\`

> quote

---`}
                required
                className="min-h-[400px] bg-secondary border-border font-mono text-sm text-foreground resize-y"
              />
            )}
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
