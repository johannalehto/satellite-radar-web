import {
  useMemo,
  useState,
} from 'react'
import { buildRadarScene } from '../../domain/radar/calculations/buildRadarScene'
import { useRadarClock } from '../../radar/hooks/useRadarClock'
import { useSatelliteData } from '../app/useSatelliteData'
import RadarView from '../components/RadarView'
import SatelliteDetailSheet from '../components/SatelliteDetailSheet'
import { radarClockOptions } from '../config/radarTimestamp'
import { useSatelliteDetailSelection } from '../hooks/useSatelliteDetailSelection'
import './RadarPage.css'

function RadarPage() {
  const [showLabels, setShowLabels] = useState(false)
  const {
    selectedPassId,
    isDetailSheetClosing,
    selectSatellite,
    closeDetailSheet,
  } = useSatelliteDetailSelection()
  const {
    satellitePasses,
    isLoading,
    error,
  } = useSatelliteData()
  const radarTimestampMs = useRadarClock(radarClockOptions)
  const radarScene = buildRadarScene(satellitePasses, radarTimestampMs)
  const selectedPass = useMemo(
    () =>
      satellitePasses.find(
        (pass) => pass.passId === selectedPassId,
      ) ?? null,
    [satellitePasses, selectedPassId],
  )
  const selectedRadarSatellite =
    radarScene.satellites.find(
      (satellite) => satellite.passId === selectedPassId,
    ) ?? null

  return (
    <section className="radar-page" aria-label="Satellite radar">
      <div className="radar-page-meta">
        <label className="radar-label-toggle">
          <span>DISPLAY NAMES</span>
          <input
            type="checkbox"
            checked={showLabels}
            onChange={(event) => setShowLabels(event.target.checked)}
          />
          <span className="radar-label-toggle-track" aria-hidden="true" />
        </label>
      </div>

      {isLoading ? (
        <p className="loading">Loading satellites…</p>
      ) : error ? (
        <p className="error" role="alert">
          Unable to load visible satellites.
        </p>
      ) : (
        <RadarView
          scene={radarScene}
          selectedPassId={selectedPassId}
          showLabels={showLabels}
          onSelectSatellite={selectSatellite}
          onBackgroundClick={closeDetailSheet}
        />
      )}

      {selectedPass && (
        <SatelliteDetailSheet
          pass={selectedPass}
          elevationDeg={
            selectedRadarSatellite?.elevationDeg ?? null
          }
          timestampMs={radarTimestampMs}
          isClosing={isDetailSheetClosing}
          onClose={closeDetailSheet}
        />
      )}
    </section>
  )
}

export default RadarPage
