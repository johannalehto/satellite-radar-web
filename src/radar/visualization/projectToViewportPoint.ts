import type { NormalizedRadarPoint } from '../../domain/radar/calculations/projectToRadarPoint'
import type { RadarViewport } from './types'

export const RADAR_RADIUS_RATIO = 0.392

export type RadarViewportPoint = {
  x: number
  y: number
}

export function projectToViewportPoint(
  point: NormalizedRadarPoint,
  viewport: RadarViewport,
  deviceHeadingDeg = 0,
): RadarViewportPoint {
  const centerX = viewport.width / 2
  const centerY = viewport.height / 2
  const radarRadius =
    Math.min(viewport.width, viewport.height) * RADAR_RADIUS_RATIO
  const headingRad = (deviceHeadingDeg * Math.PI) / 180
  const headingCos = Math.cos(headingRad)
  const headingSin = Math.sin(headingRad)
  const rotatedX = point.x * headingCos + point.y * headingSin
  const rotatedY = -point.x * headingSin + point.y * headingCos

  return {
    x: centerX + rotatedX * radarRadius,
    y: centerY + rotatedY * radarRadius,
  }
}
