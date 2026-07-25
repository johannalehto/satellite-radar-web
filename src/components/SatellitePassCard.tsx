import type { SatellitePass } from '../domain/radar/models'

type SatellitePassCardProps = {
  pass: SatellitePass
}

function formatDate(timestampMs: number) {
  return new Date(timestampMs).toLocaleString()
}

function SatellitePassCard({ pass }: SatellitePassCardProps) {
  return (
    <article className="satellite-pass-card">
      <h2>{pass.name}</h2>

      <dl className="satellite-details">
        <div>
          <dt>Object type</dt>
          <dd>{pass.objectType}</dd>
        </div>
        <div>
          <dt>Owner</dt>
          <dd>{pass.owner.name}</dd>
        </div>
        <div>
          <dt>Maximum elevation</dt>
          <dd>{Math.round(pass.maxElevationDeg)}°</dd>
        </div>
        <div>
          <dt>Visible from</dt>
          <dd>
            <time dateTime={new Date(pass.visibleFromMs).toISOString()}>
              {formatDate(pass.visibleFromMs)}
            </time>
          </dd>
        </div>
        <div>
          <dt>Visible until</dt>
          <dd>
            <time dateTime={new Date(pass.visibleUntilMs).toISOString()}>
              {formatDate(pass.visibleUntilMs)}
            </time>
          </dd>
        </div>
      </dl>
    </article>
  )
}

export default SatellitePassCard
