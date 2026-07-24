import type { RadarResponse } from '../types/radar'
import { radarResponseFixture } from './radarResponseFixture'

export async function getVisibleSatellites(
  latitude: number,
  longitude: number,
): Promise<RadarResponse> {
  void latitude
  void longitude

  return radarResponseFixture
}
