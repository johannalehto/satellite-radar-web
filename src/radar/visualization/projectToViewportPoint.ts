import type { NormalizedRadarPoint } from '../../domain/radar/calculations/projectToRadarPoint'
import type { RadarViewport } from './types'

export const RADAR_RADIUS_RATIO = 0.4

export type RadarViewportPoint = {
  x: number
  y: number
}

export function projectToViewportPoint(
  point: NormalizedRadarPoint,
  viewport: RadarViewport,
): RadarViewportPoint {
  const centerX = viewport.width / 2
  const centerY = viewport.height / 2
  const radarRadius =
    Math.min(viewport.width, viewport.height) * RADAR_RADIUS_RATIO

  return {
    x: centerX + point.x * radarRadius,
    y: centerY + point.y * radarRadius,
  }
}
