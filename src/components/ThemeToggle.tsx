import { useEffect, useState } from 'react'
import { Monitor, Moon, Sun } from 'lucide-react'

type ThemeMode = 'light' | 'dark' | 'auto'

function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') return 'dark'

  const stored = window.localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark' || stored === 'auto') {
    return stored
  }

  return 'dark'
}

function applyThemeMode(mode: ThemeMode) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const resolved = mode === 'auto' ? (prefersDark ? 'dark' : 'light') : mode

  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(resolved)

  if (mode === 'auto') {
    document.documentElement.removeAttribute('data-theme')
  } else {
    document.documentElement.setAttribute('data-theme', mode)
  }

  document.documentElement.style.colorScheme = resolved
}

const MODE_LABEL: Record<ThemeMode, string> = {
  dark: 'Dark',
  light: 'Light',
  auto: 'System',
}

export default function ThemeToggle({
  className = '',
}: {
  className?: string
}) {
  const [mode, setMode] = useState<ThemeMode>('dark')

  useEffect(() => {
    const initialMode = getInitialMode()
    setMode(initialMode)
    applyThemeMode(initialMode)
  }, [])

  useEffect(() => {
    if (mode !== 'auto') return

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyThemeMode('auto')

    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [mode])

  function toggleMode() {
    const nextMode: ThemeMode =
      mode === 'dark' ? 'light' : mode === 'light' ? 'auto' : 'dark'
    setMode(nextMode)
    applyThemeMode(nextMode)
    window.localStorage.setItem('theme', nextMode)
  }

  const Icon = mode === 'dark' ? Moon : mode === 'light' ? Sun : Monitor
  const next = MODE_LABEL[
    mode === 'dark' ? 'light' : mode === 'light' ? 'auto' : 'dark'
  ]

  return (
    <button
      type="button"
      onClick={toggleMode}
      aria-label={`Theme: ${MODE_LABEL[mode]}. Switch to ${next}.`}
      title={`Theme: ${MODE_LABEL[mode]} — click for ${next}`}
      className={`grid size-9 place-items-center border border-border text-muted-foreground transition-colors hover:border-acid/50 hover:text-foreground ${className}`}
    >
      <Icon className="size-4" aria-hidden="true" />
    </button>
  )
}
