import { useEffect, useState } from 'react'
import { mapVisibleSatellitesResponse } from '../../api/mappers/mapRadarResponse'
import { getVisibleSatellites } from '../../api/radarApi'
import type { SatellitePass } from '../../domain/radar/models'
import SatellitePassCard from '../components/SatellitePassCard'
import './RadarPage.css'

function RadarPage() {
  const [satellitePasses, setSatellitePasses] = useState<SatellitePass[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isCancelled = false

    async function loadSatellites() {
      const response = await getVisibleSatellites(0, 0)

      if (!isCancelled) {
        setSatellitePasses(mapVisibleSatellitesResponse(response))
        setIsLoading(false)
      }
    }

    loadSatellites()

    return () => {
      isCancelled = true
    }
  }, [])

  return (
    <main className="radar-page">
      <h1>SATELLITES NOW</h1>

      {isLoading ? (
        <p className="loading">Loading satellites…</p>
      ) : (
        <section className="satellite-list" aria-label="Visible satellites">
          {satellitePasses.map((pass) => (
            <SatellitePassCard
              key={pass.passId}
              pass={pass}
            />
          ))}
        </section>
      )}
    </main>
  )
}

export default RadarPage
