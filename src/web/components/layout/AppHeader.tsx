import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import ObserverLocationSummary from '../ObserverLocationSummary'
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

type AppHeaderProps = {
  latitude: number
  longitude: number
  locationName: string | null
  showRadarLabels: boolean
  onShowRadarLabelsChange: (showLabels: boolean) => void
}

function AppHeader({
  latitude,
  longitude,
  locationName,
  showRadarLabels,
  onShowRadarLabelsChange,
}: AppHeaderProps) {
  const location = useLocation()
  const [now, setNow] = useState(() => new Date())
  const showObserverLocation = location.pathname !== '/'

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
      {showObserverLocation && (
        <div className="app-header-meta">
          <ObserverLocationSummary
            latitude={latitude}
            longitude={longitude}
            locationName={locationName}
          />
          {location.pathname === '/radar' && (
            <label className="radar-label-toggle">
              <span>DISPLAY NAMES</span>
              <input
                type="checkbox"
                checked={showRadarLabels}
                onChange={(event) =>
                  onShowRadarLabelsChange(event.target.checked)
                }
              />
              <span
                className="radar-label-toggle-track"
                aria-hidden="true"
              />
            </label>
          )}
        </div>
      )}
    </header>
  )
}

export default AppHeader
