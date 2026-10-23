import { useEffect, useState } from 'react'
import { site } from '#/content/site'

export function LocalTime({ className }: { className?: string }) {
  const [time, setTime] = useState('--:--')

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat('en-PH', {
      timeZone: site.timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })

    const tick = () => setTime(formatter.format(new Date()))
    tick()

    const timer = window.setInterval(tick, 30_000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <span className={className} title={`Local time in ${site.location}`}>
      {time}
    </span>
  )
}
