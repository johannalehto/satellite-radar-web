import type { SatellitePass } from '../../domain/radar/models'
import type { SatellitePassStatus } from '../../domain/radar/selectors/satellitePassStatus'
import SatellitePassCard from './SatellitePassCard'
import './SatellitePassList.css'

type SatellitePassListProps = {
  title: string
  timerLabel: string
  passes: SatellitePass[]
  status: SatellitePassStatus
  timestampMs: number
  onSelectPass: (pass: SatellitePass) => void
}

function SatellitePassList({
  title,
  timerLabel,
  passes,
  status,
  timestampMs,
  onSelectPass,
}: SatellitePassListProps) {
  return (
    <section className="satellite-pass-list" aria-labelledby={`${status}-title`}>
      <h2 id={`${status}-title`}>{title}</h2>
      <div className="satellite-pass-columns" aria-hidden="true">
        <span>NAME</span>
        <span>{timerLabel}</span>
      </div>

      {passes.length > 0 ? (
        <div>
          {passes.map((pass) => (
            <SatellitePassCard
              key={pass.passId}
              pass={pass}
              status={status}
              timestampMs={timestampMs}
              onSelect={onSelectPass}
            />
          ))}
        </div>
      ) : (
        <p className="satellite-pass-empty">None</p>
      )}
    </section>
  )
}

export default SatellitePassList
