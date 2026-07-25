import type { SatellitePass } from '../models'
import type { RadarScene } from '../sceneModels'
import { buildStraightTrajectory } from './buildStraightTrajectory'
import { interpolateSatelliteTrack } from './interpolateSatelliteTrack'
import { projectToRadarPoint } from './projectToRadarPoint'

export function buildRadarScene(
  passes: SatellitePass[],
  timestampMs: number,
): RadarScene {
  const satellites = passes.flatMap((pass) => {
    const position = interpolateSatelliteTrack(pass.track, timestampMs)

    if (!position) {
      return []
    }

    return [
      {
        passId: pass.passId,
        satelliteId: pass.satelliteId,
        name: pass.name,
        position: projectToRadarPoint(
          position.azimuthDeg,
          position.elevationDeg,
        ),
        trajectory: buildStraightTrajectory(pass.track),
        azimuthDeg: position.azimuthDeg,
        elevationDeg: position.elevationDeg,
      },
    ]
  })

  return {
    userPosition: { x: 0, y: 0 },
    satellites,
  }
}
