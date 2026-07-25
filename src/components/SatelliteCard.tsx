import type { SatellitePassResponse } from '../api/types/radarResponse'

type SatelliteCardProps = {
  satellite: SatellitePassResponse
}

function formatDate(date: string) {
  return new Date(date).toLocaleString()
}

function SatelliteCard({ satellite }: SatelliteCardProps) {
  const { info, visibility } = satellite

  return (
    <article className="satellite-card">
      <h2>{info.satellite_name}</h2>

      <dl className="satellite-details">
        <div>
          <dt>Object type</dt>
          <dd>{info.object_type}</dd>
        </div>
        <div>
          <dt>Owner</dt>
          <dd>{info.owner.name}</dd>
        </div>
        <div>
          <dt>Maximum elevation</dt>
          <dd>{Math.round(visibility.max_elevation_deg)}°</dd>
        </div>
        <div>
          <dt>Visible from</dt>
          <dd>
            <time dateTime={visibility.visible_from}>
              {formatDate(visibility.visible_from)}
            </time>
          </dd>
        </div>
        <div>
          <dt>Visible until</dt>
          <dd>
            <time dateTime={visibility.visible_until}>
              {formatDate(visibility.visible_until)}
            </time>
          </dd>
        </div>
      </dl>
    </article>
  )
}

export default SatelliteCard
