import type { SatellitePassId } from './models'
import type { StraightRadarTrajectory } from './calculations/buildStraightTrajectory'
import type { NormalizedRadarPoint } from './calculations/projectToRadarPoint'

export type RadarSatelliteDot = {
  passId: SatellitePassId
  satelliteId: string
  name: string
  position: NormalizedRadarPoint
  trajectory: StraightRadarTrajectory | null
  opacity: number
  azimuthDeg: number
  elevationDeg: number
}

export type RadarScene = {
  userPosition: NormalizedRadarPoint
  satellites: RadarSatelliteDot[]
}
