import { useState } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'
import AppShell from './app/AppShell'
import SatelliteDataLayout from './app/SatelliteDataLayout'
import type { ObserverLocation } from './location/models'
import LocationPage from './pages/LocationPage'
import RadarPage from './pages/RadarPage'
import SatelliteListPage from './pages/SatelliteListPage'

const DEFAULT_RADAR_LATITUDE = 36.3112
const DEFAULT_RADAR_LONGITUDE = 139.5341

function App() {
  const [observerLocation, setObserverLocation] =
    useState<ObserverLocation | null>(null)
  const [showRadarLabels, setShowRadarLabels] = useState(false)
  const latitude =
    observerLocation?.latitude ?? DEFAULT_RADAR_LATITUDE
  const longitude =
    observerLocation?.longitude ?? DEFAULT_RADAR_LONGITUDE

  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <AppShell
              latitude={latitude}
              longitude={longitude}
              locationName={observerLocation?.name ?? null}
              showRadarLabels={showRadarLabels}
              onShowRadarLabelsChange={setShowRadarLabels}
            />
          }
        >
          <Route
            index
            element={
              <LocationPage
                onLocationResolved={setObserverLocation}
              />
            }
          />
          <Route
            element={
              <SatelliteDataLayout
                latitude={latitude}
                longitude={longitude}
                locationName={observerLocation?.name ?? null}
              />
            }
          >
            <Route
              path="radar"
              element={<RadarPage showLabels={showRadarLabels} />}
            />
            <Route
              path="satellites"
              element={<SatelliteListPage />}
            />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
