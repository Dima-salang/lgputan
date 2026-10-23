export function Marquee({ items }: { items: string[] }) {
  if (items.length === 0) return null

  const row = (
    <div className="flex shrink-0 items-center">
      {items.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className="flex items-center gap-6 px-6 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
        >
          <span className="text-acid" aria-hidden="true">
            *
          </span>
          {item}
        </span>
      ))}
    </div>
  )

  return (
    <div className="marquee border-y border-border py-4">
      <div className="marquee-track">
        {row}
        <div aria-hidden="true" className="flex shrink-0 items-center">
          {row}
        </div>
      </div>
    </div>
  )
}
