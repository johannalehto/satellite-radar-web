import { Outlet } from 'react-router-dom'
import AppHeader from '../components/layout/AppHeader'
import BottomNavigation from '../components/layout/BottomNavigation'
import './AppShell.css'

function AppShell() {
  return (
    <div className="app-shell">
      <AppHeader />
      <main className="app-content">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  )
}

export default AppShell
