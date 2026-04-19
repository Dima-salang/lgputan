interface TerminalLineProps {
  prompt?: string
  command: string
  output?: React.ReactNode
  isLast?: boolean
}

export function TerminalLine({
  prompt = 'guest@portfolio:~$',
  command,
  output,
  isLast,
}: TerminalLineProps) {
  return (
    <div className="font-mono text-sm leading-relaxed">
      <div className="flex gap-2">
        <span className="text-[var(--lagoon-deep)] shrink-0">{prompt}</span>
        <span className="text-[var(--foreground)]">{command}</span>
      </div>
      {output && (
        <div className="text-[var(--muted-foreground)] pl-0">{output}</div>
      )}
      {isLast && (
        <div className="flex gap-2 mt-1">
          <span className="text-[var(--lagoon-deep)] shrink-0">{prompt}</span>
          <span className="animate-pulse">█</span>
        </div>
      )}
    </div>
  )
}

interface TerminalWindowProps {
  lines: Array<{
    command: string
    output?: React.ReactNode
  }>
  showCursor?: boolean
}

export function TerminalWindow({
  lines,
  showCursor = true,
}: TerminalWindowProps) {
  return (
    <div className="rounded-xl border border-[var(--chip-line)] bg-[var(--surface)]/80 p-4 sm:p-6 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--lagoon)]/8 via-transparent to-[var(--palm)]/5" />
      <div className="absolute top-0 left-0 right-0 h-8 bg-[var(--chip-line)]/50 flex items-center px-3 gap-1.5">
        <div className="size-2.5 rounded-full bg-red-500/70" />
        <div className="size-2.5 rounded-full bg-amber-500/70" />
        <div className="size-2.5 rounded-full bg-emerald-500/70" />
        <span className="ml-2 text-xs font-mono text-[var(--muted-foreground)]">
          bash — 80×24
        </span>
      </div>
      <div className="pt-6 font-mono text-sm">
        {lines.map((line, i) => (
          <TerminalLine
            key={i}
            command={line.command}
            output={line.output}
            isLast={showCursor && i === lines.length - 1}
          />
        ))}
      </div>
    </div>
  )
}
