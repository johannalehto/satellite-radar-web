import { useEffect, useState } from 'react'
import { mapVisibleSatellitesResponse } from '../../api/mappers/mapRadarResponse'
import type { VisibleSatellitesLoader } from '../../api/radarClient'
import type { SatellitePass } from '../../domain/radar/models'

type UseVisibleSatellitesResult = {
  satellitePasses: SatellitePass[]
  isLoading: boolean
  error: Error | null
}

export function useVisibleSatellites(
  latitude: number,
  longitude: number,
  loadVisibleSatellites: VisibleSatellitesLoader,
): UseVisibleSatellitesResult {
  const [satellitePasses, setSatellitePasses] = useState<SatellitePass[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isCancelled = false

    async function loadSatellites() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await loadVisibleSatellites(latitude, longitude)
        const passes = mapVisibleSatellitesResponse(response)

        if (!isCancelled) {
          setSatellitePasses(passes)
        }
      } catch (caughtError) {
        if (!isCancelled) {
          const requestError =
            caughtError instanceof Error
              ? caughtError
              : new Error('Unable to load visible satellites')

          setError(requestError)
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    loadSatellites()

    return () => {
      isCancelled = true
    }
  }, [latitude, longitude, loadVisibleSatellites])

  return {
    satellitePasses,
    isLoading,
    error,
  }
}
