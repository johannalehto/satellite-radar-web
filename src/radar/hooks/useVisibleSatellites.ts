import { useEffect, useState } from 'react'
import { mapVisibleSatellitesResponse } from '../../api/mappers/mapRadarResponse'
import { getVisibleSatellites } from '../../api/radarApi'
import type { SatellitePass } from '../../domain/radar/models'

type UseVisibleSatellitesResult = {
  satellitePasses: SatellitePass[]
  isLoading: boolean
  error: Error | null
}

export function useVisibleSatellites(
  latitude: number,
  longitude: number,
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
        const response = await getVisibleSatellites(latitude, longitude)
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
  }, [latitude, longitude])

  return {
    satellitePasses,
    isLoading,
    error,
  }
}
