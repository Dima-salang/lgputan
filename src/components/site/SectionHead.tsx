import type { ReactNode } from 'react'

export function SectionHead({
  index,
  title,
  action,
}: {
  index: string
  title: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 pb-5">
      <h2 className="section-label text-[11px]">
        <span className="index">{index}</span>
        <span className="text-muted-foreground/50" aria-hidden="true">
          /
        </span>
        <span>{title}</span>
      </h2>
      {action}
    </div>
  )
}
