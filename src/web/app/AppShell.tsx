import { Outlet } from 'react-router-dom'
import AppHeader from '../components/layout/AppHeader'
import BottomNavigation from '../components/layout/BottomNavigation'
import './AppShell.css'

type AppShellProps = {
  latitude: number
  longitude: number
  locationName: string | null
  showRadarLabels: boolean
  onShowRadarLabelsChange: (showLabels: boolean) => void
}

function AppShell({
  latitude,
  longitude,
  locationName,
  showRadarLabels,
  onShowRadarLabelsChange,
}: AppShellProps) {
  return (
    <div className="app-shell">
      <AppHeader
        latitude={latitude}
        longitude={longitude}
        locationName={locationName}
        showRadarLabels={showRadarLabels}
        onShowRadarLabelsChange={onShowRadarLabelsChange}
      />
      <main className="app-content">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  )
}

export default AppShell
