import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLocationName } from '../../api/locationClient'
import satelliteWireframe from '../assets/landing/satellite-wireframe.png'
import type { ObserverLocation } from '../location/models'
import './LocationPage.css'

type LocationPageProps = {
  onLocationResolved: (location: ObserverLocation) => void
}

function getCurrentCoordinates(): Promise<GeolocationCoordinates> {
  if (!navigator.geolocation) {
    return Promise.reject(
      new Error('Location sharing is not supported by this browser.'),
    )
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve(coords),
      () => reject(new Error('Unable to access your location.')),
      {
        enableHighAccuracy: false,
        maximumAge: 300_000,
        timeout: 10_000,
      },
    )
  })
}

function LocationPage({ onLocationResolved }: LocationPageProps) {
  const navigate = useNavigate()
  const [isLocating, setIsLocating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFindSatellites() {
    setIsLocating(true)
    setError(null)

    try {
      const coordinates = await getCurrentCoordinates()
      let locationName: string | null = null

      try {
        locationName = await getLocationName(
          coordinates.latitude,
          coordinates.longitude,
        )
      } catch {
        // A place name is optional; coordinates are enough for the radar.
      }

      onLocationResolved({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        name: locationName,
      })
      navigate('/radar')
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to access your location.'
      setError(message)
      setIsLocating(false)
    }
  }

  return (
    <section className="location-page" aria-label="Find satellites">
      <div className="location-illustration" aria-hidden="true">
        <span className="satellite-trajectory satellite-trajectory-one" />
        <span className="satellite-trajectory satellite-trajectory-two" />
        <img src={satelliteWireframe} alt="" />
      </div>

      <div className="location-action">
        <button
          className="find-satellites-button"
          type="button"
          aria-describedby="location-disclaimer"
          disabled={isLocating}
          onClick={handleFindSatellites}
        >
          {isLocating ? 'Finding satellites…' : 'Find satellites'}
        </button>
        <p id="location-disclaimer" className="location-disclaimer">
          Your location is used only to calculate visible satellites
          above you.
        </p>
        {error && (
          <p className="location-error" role="alert">
            {error} Check your browser permissions and try again.
          </p>
        )}
      </div>
    </section>
  )
}

export default LocationPage
