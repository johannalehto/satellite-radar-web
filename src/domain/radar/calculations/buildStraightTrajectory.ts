import type { SatelliteTrackPoint } from '../models'
import type { NormalizedRadarPoint } from './projectToRadarPoint'
import { projectToRadarPoint } from './projectToRadarPoint'

const TRAJECTORY_MARGIN = 0.3

export type StraightRadarTrajectory = {
  entryPosition: NormalizedRadarPoint
  exitPosition: NormalizedRadarPoint
  lineStart: NormalizedRadarPoint
  lineEnd: NormalizedRadarPoint
}

export function buildStraightTrajectory(
  track: SatelliteTrackPoint[],
): StraightRadarTrajectory | null {
  const firstTrackPoint = track[0]
  const lastTrackPoint = track.at(-1)

  if (!firstTrackPoint || !lastTrackPoint) {
    return null
  }

  const firstPoint = projectToRadarPoint(
    firstTrackPoint.azimuthDeg,
    firstTrackPoint.elevationDeg,
  )
  const lastPoint = projectToRadarPoint(
    lastTrackPoint.azimuthDeg,
    lastTrackPoint.elevationDeg,
  )
  const deltaX = lastPoint.x - firstPoint.x
  const deltaY = lastPoint.y - firstPoint.y

  if (deltaX === 0 && deltaY === 0) {
    return {
      entryPosition: firstPoint,
      exitPosition: lastPoint,
      lineStart: firstPoint,
      lineEnd: lastPoint,
    }
  }

  const squaredLength = deltaX ** 2 + deltaY ** 2
  const length = Math.sqrt(squaredLength)
  const projection =
    2 * (firstPoint.x * deltaX + firstPoint.y * deltaY)
  const distanceFromHorizon =
    firstPoint.x ** 2 + firstPoint.y ** 2 - 1
  const discriminant =
    projection ** 2 - 4 * squaredLength * distanceFromHorizon
  const discriminantRoot = Math.sqrt(Math.max(discriminant, 0))
  const firstIntersectionProgress =
    (-projection - discriminantRoot) / (2 * squaredLength)
  const secondIntersectionProgress =
    (-projection + discriminantRoot) / (2 * squaredLength)
  const directionX = deltaX / length
  const directionY = deltaY / length

  return {
    entryPosition: firstPoint,
    exitPosition: lastPoint,
    lineStart: {
      x:
        firstPoint.x +
        deltaX * firstIntersectionProgress -
        directionX * TRAJECTORY_MARGIN,
      y:
        firstPoint.y +
        deltaY * firstIntersectionProgress -
        directionY * TRAJECTORY_MARGIN,
    },
    lineEnd: {
      x:
        firstPoint.x +
        deltaX * secondIntersectionProgress +
        directionX * TRAJECTORY_MARGIN,
      y:
        firstPoint.y +
        deltaY * secondIntersectionProgress +
        directionY * TRAJECTORY_MARGIN,
    },
  }
}
