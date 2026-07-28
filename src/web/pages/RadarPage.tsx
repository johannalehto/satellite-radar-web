import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { buildRadarScene } from '../../domain/radar/calculations/buildRadarScene'
import type { SatellitePassId } from '../../domain/radar/models'
import { useRadarClock } from '../../radar/hooks/useRadarClock'
import { useVisibleSatellites } from '../../radar/hooks/useVisibleSatellites'
import RadarView from '../components/RadarView'
import SatelliteDetailSheet from '../components/SatelliteDetailSheet'
import { radarClockOptions } from '../config/radarTimestamp'
import { visibleSatellitesLoader } from '../config/visibleSatellitesLoader'
import './RadarPage.css'

type RadarPageProps = {
  latitude: number
  longitude: number
  locationName: string | null
}

const DETAIL_SHEET_EXIT_DURATION_MS = 520

function RadarPage({
  latitude,
  longitude,
  locationName,
}: RadarPageProps) {
  const [showLabels, setShowLabels] = useState(false)
  const [selectedPassId, setSelectedPassId] =
    useState<SatellitePassId | null>(null)
  const [isDetailSheetClosing, setIsDetailSheetClosing] =
    useState(false)
  const closeTimerRef = useRef<number | null>(null)
  const { satellitePasses, isLoading, error } = useVisibleSatellites(
    latitude,
    longitude,
    visibleSatellitesLoader,
  )
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

  useEffect(
    () => () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current)
      }
    },
    [],
  )

  const closeDetailSheet = useCallback(() => {
    if (selectedPassId === null || isDetailSheetClosing) {
      return
    }

    setIsDetailSheetClosing(true)
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    closeTimerRef.current = window.setTimeout(
      () => {
        setSelectedPassId(null)
        setIsDetailSheetClosing(false)
        closeTimerRef.current = null
      },
      prefersReducedMotion ? 0 : DETAIL_SHEET_EXIT_DURATION_MS,
    )
  }, [isDetailSheetClosing, selectedPassId])

  function handleSelectSatellite(passId: SatellitePassId) {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }

    setIsDetailSheetClosing(false)
    setSelectedPassId(passId)
  }

  return (
    <section className="radar-page" aria-label="Satellite radar">
      <div className="radar-page-meta">
        <div className="radar-location">
          <p>{locationName ?? 'Location name unavailable'}</p>
          <p>
            {latitude.toFixed(4)}, {longitude.toFixed(4)}
          </p>
        </div>

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
          onSelectSatellite={handleSelectSatellite}
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
