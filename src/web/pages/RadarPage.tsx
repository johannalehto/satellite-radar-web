import { buildRadarScene } from '../../domain/radar/calculations/buildRadarScene'
import { useRadarClock } from '../../radar/hooks/useRadarClock'
import { useVisibleSatellites } from '../../radar/hooks/useVisibleSatellites'
import RadarView from '../components/RadarView'
import SatellitePassList from '../components/SatellitePassList'
import { radarClockOptions } from '../config/radarTimestamp'
import { visibleSatellitesLoader } from '../config/visibleSatellitesLoader'
import './RadarPage.css'

type RadarPageProps = {
  latitude: number
  longitude: number
}

function RadarPage({ latitude, longitude }: RadarPageProps) {
  const { satellitePasses, isLoading, error } = useVisibleSatellites(
    latitude,
    longitude,
    visibleSatellitesLoader,
  )
  const radarTimestampMs = useRadarClock(radarClockOptions)
  const radarScene = buildRadarScene(satellitePasses, radarTimestampMs)

  return (
    <section className="radar-page" aria-label="Satellite radar">
      {isLoading ? (
        <p className="loading">Loading satellites…</p>
      ) : error ? (
        <p className="error" role="alert">
          Unable to load visible satellites.
        </p>
      ) : (
        <>
          <RadarView scene={radarScene} />
          <SatellitePassList passes={satellitePasses} />
        </>
      )}
    </section>
  )
}

export default RadarPage
