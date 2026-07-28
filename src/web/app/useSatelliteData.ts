import { useOutletContext } from 'react-router-dom'
import type { SatellitePass } from '../../domain/radar/models'

type SatelliteDataContext = {
  satellitePasses: SatellitePass[]
  latitude: number
  longitude: number
  locationName: string | null
  isLoading: boolean
  isRefreshing: boolean
  error: Error | null
  refreshError: Error | null
}

export function useSatelliteData() {
  return useOutletContext<SatelliteDataContext>()
}
