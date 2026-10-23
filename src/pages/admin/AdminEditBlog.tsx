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
      updateMutation.mutate({ id: parseInt(id!), title, content })
    }
  }

  const handleBack = () => {
    window.location.href = '/admin/blog'
  }

  if (!isNew && isFetching) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 border-b border-zinc-800 pb-4">
        <button
          onClick={handleBack}
          className="text-zinc-500 hover:text-zinc-100 p-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h2 className="text-2xl font-bold font-mono tracking-tight text-zinc-100">
            {isNew ? 'NEW_POST_' : 'EDIT_POST_'}
          </h2>
          <p className="text-sm text-zinc-500 font-mono">
            &gt; {isNew ? 'create article' : 'modify article'}
          </p>
        </div>
      </div>

      <div className="border border-zinc-800 bg-zinc-950">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-2 p-6 pb-0">
            <Label
              htmlFor="title"
              className="font-mono text-zinc-400 text-xs uppercase"
            >
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title..."
              required
              className="bg-zinc-900 border-zinc-800 font-mono text-zinc-100 text-lg"
            />
          </div>

          <div className="flex items-center gap-2 px-6 border-b border-zinc-800">
            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-mono border-b-2 transition-colors ${
                !showPreview
                  ? 'border-zinc-100 text-zinc-100'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Edit3 className="h-4 w-4" />
              EDIT
            </button>
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-mono border-b-2 transition-colors ${
                showPreview
                  ? 'border-zinc-100 text-zinc-100'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Eye className="h-4 w-4" />
              PREVIEW
            </button>
          </div>

          <div className="p-6 pt-0">
            {showPreview ? (
              <div className="prose prose-invert max-w-none min-h-[400px] p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                {content ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                  </ReactMarkdown>
                ) : (
                  <p className="text-zinc-500 font-mono">// no content yet</p>
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
                className="min-h-[400px] bg-zinc-900 border-zinc-800 font-mono text-sm text-zinc-100 resize-y"
              />
            )}
          </div>

          <div className="flex justify-end gap-3 px-6 pb-6 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={handleBack}
              className="font-mono border border-zinc-700 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 px-4 py-2 rounded-md"
            >
              CANCEL
            </button>
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
