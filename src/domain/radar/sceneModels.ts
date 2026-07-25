import type { SatellitePassId } from './models'
import type { NormalizedRadarPoint } from './calculations/projectToRadarPoint'

export type RadarSatelliteDot = {
  passId: SatellitePassId
  satelliteId: string
  name: string
  position: NormalizedRadarPoint
  azimuthDeg: number
  elevationDeg: number
}

export type RadarScene = {
  userPosition: NormalizedRadarPoint
  satellites: RadarSatelliteDot[]
}
