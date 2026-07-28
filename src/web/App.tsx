import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'
import AppShell from './app/AppShell'
import LocationPage from './pages/LocationPage'
import RadarPage from './pages/RadarPage'
import SatelliteListPage from './pages/SatelliteListPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<LocationPage />} />
          <Route path="radar" element={<RadarPage />} />
          <Route path="satellites" element={<SatelliteListPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
