import { cn } from '#/lib/utils'

const GLYPHS = ['.', '·', '+', '#', ':']

function hash(value: string): number {
  let result = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    result ^= value.charCodeAt(i)
    result = Math.imul(result, 16777619)
  }
  return result >>> 0
}

/**
 * A small, deterministic text pattern used where a project has no image.
 * Same project name always produces the same pattern.
 */
export function Dither({
  seed,
  className,
  rows = 5,
  columns = 9,
}: {
  seed: string
  className?: string
  rows?: number
  columns?: number
}) {
  const value = hash(seed)
  const lines: string[] = []

  for (let row = 0; row < rows; row += 1) {
    let line = ''
    for (let column = 0; column < columns; column += 1) {
      const index = (value >>> ((row * columns + column) % 24)) % GLYPHS.length
      line += GLYPHS[index]
      if (column < columns - 1) line += ' '
    }
    lines.push(line)
  }

  return (
    <pre aria-hidden="true" className={cn('dither', className)}>
      {lines.join('\n')}
    </pre>
  )
}
