import { useState } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'
import AppShell from './app/AppShell'
import type { ObserverLocation } from './location/models'
import LocationPage from './pages/LocationPage'
import RadarPage from './pages/RadarPage'
import SatelliteListPage from './pages/SatelliteListPage'

const DEFAULT_RADAR_LATITUDE = 36.3112
const DEFAULT_RADAR_LONGITUDE = 139.5341

function App() {
  const [observerLocation, setObserverLocation] =
    useState<ObserverLocation | null>(null)
  const latitude =
    observerLocation?.latitude ?? DEFAULT_RADAR_LATITUDE
  const longitude =
    observerLocation?.longitude ?? DEFAULT_RADAR_LONGITUDE

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route
            index
            element={
              <LocationPage
                onLocationResolved={setObserverLocation}
              />
            }
          />
          <Route
            path="radar"
            element={
              <RadarPage
                latitude={latitude}
                longitude={longitude}
              />
            }
          />
          <Route path="satellites" element={<SatelliteListPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
