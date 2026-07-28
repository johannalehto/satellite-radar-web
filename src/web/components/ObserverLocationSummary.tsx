import './ObserverLocationSummary.css'

type ObserverLocationSummaryProps = {
  latitude: number
  longitude: number
  locationName: string | null
}

function ObserverLocationSummary({
  latitude,
  longitude,
  locationName,
}: ObserverLocationSummaryProps) {
  return (
    <div className="observer-location-summary">
      <p>{locationName ?? 'Location name unavailable'}</p>
      <p>
        {latitude.toFixed(4)}, {longitude.toFixed(4)}
      </p>
    </div>
  )
}

export default ObserverLocationSummary
