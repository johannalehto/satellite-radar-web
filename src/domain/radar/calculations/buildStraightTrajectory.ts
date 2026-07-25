import type { SatelliteTrackPoint } from '../models'
import type { NormalizedRadarPoint } from './projectToRadarPoint'
import { projectToRadarPoint } from './projectToRadarPoint'

const TRAJECTORY_EXTENT = 1.25

export type StraightRadarTrajectory = {
  start: NormalizedRadarPoint
  end: NormalizedRadarPoint
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
      start: firstPoint,
      end: lastPoint,
    }
  }

  const intersections: Array<{
    point: NormalizedRadarPoint
    progress: number
  }> = []

  function addIntersection(progress: number) {
    const point = {
      x: firstPoint.x + deltaX * progress,
      y: firstPoint.y + deltaY * progress,
    }

    if (
      Math.abs(point.x) <= TRAJECTORY_EXTENT &&
      Math.abs(point.y) <= TRAJECTORY_EXTENT
    ) {
      intersections.push({ point, progress })
    }
  }

  if (deltaX !== 0) {
    addIntersection((-TRAJECTORY_EXTENT - firstPoint.x) / deltaX)
    addIntersection((TRAJECTORY_EXTENT - firstPoint.x) / deltaX)
  }

  if (deltaY !== 0) {
    addIntersection((-TRAJECTORY_EXTENT - firstPoint.y) / deltaY)
    addIntersection((TRAJECTORY_EXTENT - firstPoint.y) / deltaY)
  }

  intersections.sort((left, right) => left.progress - right.progress)

  return {
    start: intersections[0]?.point ?? firstPoint,
    end: intersections.at(-1)?.point ?? lastPoint,
  }
}
