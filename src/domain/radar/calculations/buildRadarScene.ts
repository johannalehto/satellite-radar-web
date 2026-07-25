import type { SatellitePass } from '../models'
import type { RadarScene } from '../sceneModels'
import { buildStraightTrajectory } from './buildStraightTrajectory'
import { interpolateSatelliteTrack } from './interpolateSatelliteTrack'

const FADE_DURATION_MS = 2_000

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum)
}

export function buildRadarScene(
  passes: SatellitePass[],
  timestampMs: number,
): RadarScene {
  const satellites = passes.flatMap((pass) => {
    const position = interpolateSatelliteTrack(pass.track, timestampMs)
    const trajectory = buildStraightTrajectory(pass.track)
    const firstTrackPoint = pass.track[0]
    const lastTrackPoint = pass.track.at(-1)

    if (!position || !trajectory || !firstTrackPoint || !lastTrackPoint) {
      return []
    }

    const passDurationMs =
      lastTrackPoint.timestampMs - firstTrackPoint.timestampMs
    const progress =
      passDurationMs === 0
        ? 1
        : clamp(
            (timestampMs - firstTrackPoint.timestampMs) / passDurationMs,
            0,
            1,
          )
    const displayPosition = {
      x:
        trajectory.entryPosition.x +
        (trajectory.exitPosition.x - trajectory.entryPosition.x) *
          progress,
      y:
        trajectory.entryPosition.y +
        (trajectory.exitPosition.y - trajectory.entryPosition.y) *
          progress,
    }
    const fadeInProgress = clamp(
      (timestampMs - firstTrackPoint.timestampMs) / FADE_DURATION_MS,
      0,
      1,
    )
    const fadeOutProgress = clamp(
      (lastTrackPoint.timestampMs - timestampMs) / FADE_DURATION_MS,
      0,
      1,
    )

    return [
      {
        passId: pass.passId,
        satelliteId: pass.satelliteId,
        name: pass.name,
        position: displayPosition,
        trajectory,
        opacity: Math.min(fadeInProgress, fadeOutProgress),
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
