import { useEffect, useState } from 'react'
import './AppHeader.css'

function padNumber(value: number) {
  return String(value).padStart(2, '0')
}

function formatDate(date: Date) {
  return [
    padNumber(date.getDate()),
    padNumber(date.getMonth() + 1),
    date.getFullYear(),
  ].join('/')
}

function formatTime(date: Date) {
  return `${padNumber(date.getHours())}:${padNumber(date.getMinutes())}`
}

function AppHeader() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date())
    }, 1_000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  return (
    <header className="app-header">
      <p className="app-title">SATELLITES NOW</p>
      <div className="app-date-time">
        <time dateTime={now.toISOString()}>{formatDate(now)}</time>
        <time dateTime={now.toISOString()}>{formatTime(now)}</time>
      </div>
    </header>
  )
}

export default AppHeader
