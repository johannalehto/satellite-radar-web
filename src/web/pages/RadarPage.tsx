import { useVisibleSatellites } from '../../radar/hooks/useVisibleSatellites'
import SatellitePassCard from '../components/SatellitePassCard'
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
