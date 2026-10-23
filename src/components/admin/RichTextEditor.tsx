import { useEffect, useRef } from 'react'
import { EditorContent, useEditor, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Markdown } from 'tiptap-markdown'
import type { MarkdownStorage } from 'tiptap-markdown'
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Pilcrow,
  Quote,
  Redo2,
  SquareCode,
  Strikethrough,
  Undo2,
} from 'lucide-react'
import { cn } from '#/lib/utils'

type RichTextEditorProps = {
  value: string
  onChange: (markdown: string) => void
  disabled?: boolean
}

type ToolbarButtonProps = {
  label: string
  onClick: () => void
  active?: boolean
  disabled?: boolean
  children: React.ReactNode
}

function ToolbarButton({
  label,
  onClick,
  active,
  disabled,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active === undefined ? undefined : active}
      disabled={disabled}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={cn(
        'grid size-8 place-items-center text-muted-foreground transition-colors',
        'hover:bg-secondary hover:text-foreground',
        'disabled:pointer-events-none disabled:opacity-40',
        active && 'bg-secondary text-acid',
      )}
    >
      {children}
    </button>
  )
}

const EMPTY_TOOLBAR_STATE = {
  bold: false,
  italic: false,
  strike: false,
  code: false,
  heading1: false,
  heading2: false,
  heading3: false,
  paragraph: false,
  bulletList: false,
  orderedList: false,
  blockquote: false,
  codeBlock: false,
  link: false,
}

export function RichTextEditor({
  value,
  onChange,
  disabled = false,
}: RichTextEditorProps) {
  const lastValue = useRef(value)

  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: { openOnClick: false, autolink: true },
      }),
      Placeholder.configure({
        placeholder: 'Write your post…',
      }),
      Markdown.configure({
        html: false,
        tightLists: true,
        linkify: true,
        transformPastedText: true,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          'prose max-w-none min-h-[360px] px-5 py-4 text-foreground focus:outline-none',
        role: 'textbox',
        'aria-label': 'Post content',
        'aria-multiline': 'true',
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      const storage = currentEditor.storage as unknown as {
        markdown: MarkdownStorage
      }
      const markdown = storage.markdown.getMarkdown()
      lastValue.current = markdown
      onChange(markdown)
    },
  })

  const toolbar = useEditorState({
    editor,
    selector: (context) => ({
      ...EMPTY_TOOLBAR_STATE,
      bold: context.editor?.isActive('bold') ?? false,
      italic: context.editor?.isActive('italic') ?? false,
      strike: context.editor?.isActive('strike') ?? false,
      code: context.editor?.isActive('code') ?? false,
      heading1: context.editor?.isActive('heading', { level: 1 }) ?? false,
      heading2: context.editor?.isActive('heading', { level: 2 }) ?? false,
      heading3: context.editor?.isActive('heading', { level: 3 }) ?? false,
      paragraph: context.editor?.isActive('paragraph') ?? false,
      bulletList: context.editor?.isActive('bulletList') ?? false,
      orderedList: context.editor?.isActive('orderedList') ?? false,
      blockquote: context.editor?.isActive('blockquote') ?? false,
      codeBlock: context.editor?.isActive('codeBlock') ?? false,
      link: context.editor?.isActive('link') ?? false,
    }),
  })

  const active = toolbar ?? EMPTY_TOOLBAR_STATE

  useEffect(() => {
    if (!editor) return
    if (value === lastValue.current) return
    lastValue.current = value
    editor.commands.setContent(value, { emitUpdate: false })
  }, [editor, value])

  useEffect(() => {
    editor?.setEditable(!disabled)
  }, [editor, disabled])

  const setLink = () => {
    if (!editor) return
    const previousUrl = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('Link URL', previousUrl ?? 'https://')
    if (url === null) return

    if (url.trim() === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url.trim() })
      .run()
  }

  return (
    <div className="rich-editor border border-border bg-card/40">
      <div
        role="toolbar"
        aria-label="Text formatting"
        className="flex flex-wrap items-center gap-0.5 border-b border-border bg-background/60 p-2"
      >
        <ToolbarButton
          label="Undo"
          disabled={!editor || disabled}
          onClick={() => editor?.chain().focus().undo().run()}
        >
          <Undo2 className="size-4" aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          label="Redo"
          disabled={!editor || disabled}
          onClick={() => editor?.chain().focus().redo().run()}
        >
          <Redo2 className="size-4" aria-hidden="true" />
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />

        <ToolbarButton
          label="Paragraph"
          active={active.paragraph}
          disabled={!editor || disabled}
          onClick={() => editor?.chain().focus().setParagraph().run()}
        >
          <Pilcrow className="size-4" aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          label="Heading 1"
          active={active.heading1}
          disabled={!editor || disabled}
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <Heading1 className="size-4" aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          label="Heading 2"
          active={active.heading2}
          disabled={!editor || disabled}
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 className="size-4" aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          label="Heading 3"
          active={active.heading3}
          disabled={!editor || disabled}
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <Heading3 className="size-4" aria-hidden="true" />
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />

        <ToolbarButton
          label="Bold"
          active={active.bold}
          disabled={!editor || disabled}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <Bold className="size-4" aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          active={active.italic}
          disabled={!editor || disabled}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <Italic className="size-4" aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          label="Strikethrough"
          active={active.strike}
          disabled={!editor || disabled}
          onClick={() => editor?.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="size-4" aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          label="Inline code"
          active={active.code}
          disabled={!editor || disabled}
          onClick={() => editor?.chain().focus().toggleCode().run()}
        >
          <Code className="size-4" aria-hidden="true" />
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />

        <ToolbarButton
          label="Bulleted list"
          active={active.bulletList}
          disabled={!editor || disabled}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <List className="size-4" aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          label="Numbered list"
          active={active.orderedList}
          disabled={!editor || disabled}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="size-4" aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          label="Quote"
          active={active.blockquote}
          disabled={!editor || disabled}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="size-4" aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          label="Code block"
          active={active.codeBlock}
          disabled={!editor || disabled}
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
        >
          <SquareCode className="size-4" aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          label="Add link"
          active={active.link}
          disabled={!editor || disabled}
          onClick={setLink}
        >
          <Link2 className="size-4" aria-hidden="true" />
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />
    </div>
  )
}
