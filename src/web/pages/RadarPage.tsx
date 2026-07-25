import { useVisibleSatellites } from '../../radar/hooks/useVisibleSatellites'
import SatellitePassList from '../components/SatellitePassList'
import './RadarPage.css'

function RadarPage() {
  const { satellitePasses, isLoading, error } = useVisibleSatellites(0, 0)

  return (
    <main className="radar-page">
      <h1>SATELLITES NOW</h1>

      {isLoading ? (
        <p className="loading">Loading satellites…</p>
      ) : error ? (
        <p className="error" role="alert">
          Unable to load visible satellites.
        </p>
      ) : (
        <SatellitePassList passes={satellitePasses} />
      )}
    </main>
  )
}

export default RadarPage
