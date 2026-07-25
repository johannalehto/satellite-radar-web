import { radarResponseFixture } from '../fixtures/radarResponseFixture'
import type { VisibleSatellitesResponse } from './types/radarResponse'

export async function getVisibleSatellites(
  latitude: number,
  longitude: number,
): Promise<VisibleSatellitesResponse> {
  void latitude
  void longitude

  return radarResponseFixture
}
