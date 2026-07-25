import { buildRadarScene } from '../../domain/radar/calculations/buildRadarScene'
import { useRadarClock } from '../../radar/hooks/useRadarClock'
import { useVisibleSatellites } from '../../radar/hooks/useVisibleSatellites'
import RadarView from '../components/RadarView'
import SatellitePassList from '../components/SatellitePassList'
import { radarClockOptions } from '../config/radarTimestamp'
import { visibleSatellitesLoader } from '../config/visibleSatellitesLoader'
import './RadarPage.css'

const RADAR_LATITUDE = 36.3112
const RADAR_LONGITUDE = 139.5341

function RadarPage() {
  const { satellitePasses, isLoading, error } = useVisibleSatellites(
    RADAR_LATITUDE,
    RADAR_LONGITUDE,
    visibleSatellitesLoader,
  )
  const radarTimestampMs = useRadarClock(radarClockOptions)
  const radarScene = buildRadarScene(satellitePasses, radarTimestampMs)

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
        <>
          <RadarView scene={radarScene} />
          <SatellitePassList passes={satellitePasses} />
        </>
      )}
    </main>
  )
}

export default RadarPage
