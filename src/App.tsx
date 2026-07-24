import { useEffect, useState } from 'react'
import { getVisibleSatellites } from './api/radarApi'
import SatelliteCard from './components/SatelliteCard'
import type { SatellitePass } from './types/radar'
import './App.css'

function App() {
  const [satellites, setSatellites] = useState<SatellitePass[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isCancelled = false

    async function loadSatellites() {
      const response = await getVisibleSatellites(0, 0)

      if (!isCancelled) {
        setSatellites(response)
        setIsLoading(false)
      }
    }

    loadSatellites()

    return () => {
      isCancelled = true
    }
  }, [])

  return (
    <main className="app">
      <h1>SATELLITES NOW</h1>

      {isLoading ? (
        <p className="loading">Loading satellites…</p>
      ) : (
        <section className="satellite-list" aria-label="Visible satellites">
          {satellites.map((satellite) => (
            <SatelliteCard
              key={`${satellite.info.satellite_id}-${satellite.visibility.visible_from}`}
              satellite={satellite}
            />
          ))}
        </section>
      )}
    </main>
  )
}

export default App
