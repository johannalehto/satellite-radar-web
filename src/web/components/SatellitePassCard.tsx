import type { SatellitePass } from '../../domain/radar/models'
import type { SatellitePassStatus } from '../../domain/radar/selectors/satellitePassStatus'
import './SatellitePassCard.css'

type SatellitePassCardProps = {
  pass: SatellitePass
  status: SatellitePassStatus
  timestampMs: number
  onSelect: (pass: SatellitePass) => void
}

function formatDuration(durationMs: number) {
  const totalSeconds = Math.max(
    0,
    Math.ceil(durationMs / 1_000),
  )
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

function getStatusDuration(
  pass: SatellitePass,
  status: SatellitePassStatus,
  timestampMs: number,
) {
  if (status === 'approaching') {
    return pass.visibleFromMs - timestampMs
  }

  if (status === 'visible-now') {
    return pass.visibleUntilMs - timestampMs
  }

  return timestampMs - pass.visibleUntilMs
}

function SatellitePassCard({
  pass,
  status,
  timestampMs,
  onSelect,
}: SatellitePassCardProps) {
  const displayName = pass.owner?.code
    ? `${pass.name}, ${pass.owner.code}`
    : pass.name

  return (
    <button
      className="satellite-pass-row"
      type="button"
      onClick={() => onSelect(pass)}
    >
      <p>{displayName}</p>
      <strong>
        {formatDuration(
          getStatusDuration(pass, status, timestampMs),
        )}
      </strong>
    </button>
  )
}

export default SatellitePassCard
