import { Outlet } from 'react-router-dom'
import { useVisibleSatellites } from '../../radar/hooks/useVisibleSatellites'
import { visibleSatellitesLoader } from '../config/visibleSatellitesLoader'

type SatelliteDataLayoutProps = {
  latitude: number
  longitude: number
  locationName: string | null
}

function SatelliteDataLayout({
  latitude,
  longitude,
  locationName,
}: SatelliteDataLayoutProps) {
  const satelliteData = useVisibleSatellites(
    latitude,
    longitude,
    visibleSatellitesLoader,
  )

  return (
    <Outlet
      context={{
        ...satelliteData,
        latitude,
        longitude,
        locationName,
      }}
    />
  )
}

export default SatelliteDataLayout
