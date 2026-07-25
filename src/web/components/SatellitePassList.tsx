import type { SatellitePass } from '../../domain/radar/models'
import SatellitePassCard from './SatellitePassCard'
import './SatellitePassList.css'

type SatellitePassListProps = {
  passes: SatellitePass[]
}

function SatellitePassList({ passes }: SatellitePassListProps) {
  return (
    <section className="satellite-pass-list" aria-label="Visible satellites">
      {passes.map((pass) => (
        <SatellitePassCard key={pass.passId} pass={pass} />
      ))}
    </section>
  )
}

export default SatellitePassList
