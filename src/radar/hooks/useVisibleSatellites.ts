import { useEffect, useState } from 'react'
import { mapVisibleSatellitesResponse } from '../../api/mappers/mapRadarResponse'
import type { VisibleSatellitesLoader } from '../../api/radarClient'
import type { SatellitePass } from '../../domain/radar/models'

type UseVisibleSatellitesResult = {
  satellitePasses: SatellitePass[]
  isLoading: boolean
  isRefreshing: boolean
  error: Error | null
  refreshError: Error | null
}

const DEFAULT_REFRESH_INTERVAL_MS = 120_000

export function useVisibleSatellites(
  latitude: number,
  longitude: number,
  loadVisibleSatellites: VisibleSatellitesLoader,
  refreshIntervalMs = DEFAULT_REFRESH_INTERVAL_MS,
): UseVisibleSatellitesResult {
  const [satellitePasses, setSatellitePasses] = useState<SatellitePass[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [refreshError, setRefreshError] = useState<Error | null>(null)

  useEffect(() => {
    let isCancelled = false
    let isRequestInFlight = false

    async function loadSatellites(isInitialLoad: boolean) {
      if (isRequestInFlight) {
        return
      }

      isRequestInFlight = true
      if (isInitialLoad) {
        setIsLoading(true)
        setError(null)
      } else {
        setIsRefreshing(true)
        setRefreshError(null)
      }

      try {
        const response = await loadVisibleSatellites(latitude, longitude)
        const passes = mapVisibleSatellitesResponse(response)

        if (!isCancelled) {
          setSatellitePasses(passes)
          setError(null)
          setRefreshError(null)
        }
      } catch (caughtError) {
        if (!isCancelled) {
          const requestError =
            caughtError instanceof Error
              ? caughtError
              : new Error('Unable to load visible satellites')

          if (isInitialLoad) {
            setError(requestError)
          } else {
            setRefreshError(requestError)
          }
        }
      } finally {
        isRequestInFlight = false
        if (!isCancelled) {
          if (isInitialLoad) {
            setIsLoading(false)
          } else {
            setIsRefreshing(false)
          }
        }
      }
    }

    loadSatellites(true)
    const refreshIntervalId = window.setInterval(() => {
      loadSatellites(false)
    }, refreshIntervalMs)

    return () => {
      isCancelled = true
      window.clearInterval(refreshIntervalId)
    }
  }, [
    latitude,
    longitude,
    loadVisibleSatellites,
    refreshIntervalMs,
  ])

  return {
    satellitePasses,
    isLoading,
    isRefreshing,
    error,
    refreshError,
  }
}
