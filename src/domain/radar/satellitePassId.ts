import type { SatellitePassId } from './models'

export function createSatellitePassId(
  satelliteId: string,
  visibleFrom: string,
): SatellitePassId {
  return `${satelliteId}:${visibleFrom}`
}
