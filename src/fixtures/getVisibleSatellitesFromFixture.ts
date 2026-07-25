import type { VisibleSatellitesLoader } from '../api/radarClient'
import { radarResponseFixture } from './radarResponseFixture'

export const getVisibleSatellitesFromFixture: VisibleSatellitesLoader = async (
  latitude,
  longitude,
) => {
  void latitude
  void longitude

  return radarResponseFixture
}
