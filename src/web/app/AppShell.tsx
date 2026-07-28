import { Outlet } from 'react-router-dom'
import AppHeader from '../components/layout/AppHeader'
import BottomNavigation from '../components/layout/BottomNavigation'
import './AppShell.css'

type AppShellProps = {
  latitude: number
  longitude: number
  locationName: string | null
}

function AppShell({
  latitude,
  longitude,
  locationName,
}: AppShellProps) {
  return (
    <div className="app-shell">
      <AppHeader
        latitude={latitude}
        longitude={longitude}
        locationName={locationName}
      />
      <main className="app-content">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  )
}

export default AppShell
