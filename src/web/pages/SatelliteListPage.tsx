import { interpolateSatelliteTrack } from '../../domain/radar/calculations/interpolateSatelliteTrack'
import { groupSatellitePasses } from '../../domain/radar/selectors/satellitePassStatus'
import { useRadarClock } from '../../radar/hooks/useRadarClock'
import { useSatelliteData } from '../app/useSatelliteData'
import SatelliteDetailSheet from '../components/SatelliteDetailSheet'
import SatellitePassList from '../components/SatellitePassList'
import { radarClockOptions } from '../config/radarTimestamp'
import { useSatelliteDetailSelection } from '../hooks/useSatelliteDetailSelection'
import './SatelliteListPage.css'

function SatelliteListPage() {
  const {
    selectedPassId,
    isDetailSheetClosing,
    selectSatellite,
    closeDetailSheet,
  } = useSatelliteDetailSelection()
  const {
    satellitePasses,
    isLoading,
    isRefreshing,
    error,
    refreshError,
  } = useSatelliteData()
  const timestampMs = useRadarClock({
    ...radarClockOptions,
    intervalMs: 1_000,
  })
  const groups = groupSatellitePasses(
    satellitePasses,
    timestampMs,
  )
  const selectedPass =
    satellitePasses.find(
      (pass) => pass.passId === selectedPassId,
    ) ?? null
  const selectedPosition = selectedPass
    ? interpolateSatelliteTrack(selectedPass.track, timestampMs)
    : null

  return (
    <section className="satellite-list-page" aria-label="Satellite passes">
      {isLoading ? (
        <p className="satellite-list-status">Loading satellites…</p>
      ) : error ? (
        <p className="satellite-list-status is-error" role="alert">
          Unable to load satellite passes.
        </p>
      ) : (
        <div className="satellite-list-panel">
          {(isRefreshing || refreshError) && (
            <p className="satellite-refresh-status" aria-live="polite">
              {isRefreshing
                ? 'Updating satellite passes…'
                : 'Updates temporarily unavailable.'}
            </p>
          )}

          <SatellitePassList
            title="Visible now"
            timerLabel="VISIBLE FOR"
            passes={groups.visibleNow}
            status="visible-now"
            timestampMs={timestampMs}
            onSelectPass={(pass) => selectSatellite(pass.passId)}
          />
          <SatellitePassList
            title="Approaching"
            timerLabel="VISIBLE IN"
            passes={groups.approaching}
            status="approaching"
            timestampMs={timestampMs}
            onSelectPass={(pass) => selectSatellite(pass.passId)}
          />
          <SatellitePassList
            title="Passed"
            timerLabel="PASSED AGO"
            passes={groups.passed}
            status="passed"
            timestampMs={timestampMs}
            onSelectPass={(pass) => selectSatellite(pass.passId)}
          />
        </div>
      )}

      {selectedPass && (
        <SatelliteDetailSheet
          pass={selectedPass}
          elevationDeg={selectedPosition?.elevationDeg ?? null}
          timestampMs={timestampMs}
          isClosing={isDetailSheetClosing}
          onClose={closeDetailSheet}
        />
      )}
    </section>
  )
}

export default SatelliteListPage
