import type { SatelliteTrackPoint } from '../models'

export type InterpolatedSatellitePosition = {
  azimuthDeg: number
  elevationDeg: number
  distanceKm: number
}

function normalizeDegrees(angleDeg: number): number {
  return ((angleDeg % 360) + 360) % 360
}

function interpolateNumber(
  start: number,
  end: number,
  progress: number,
): number {
  return start + (end - start) * progress
}

function interpolateAzimuth(
  startDeg: number,
  endDeg: number,
  progress: number,
): number {
  const shortestChange = ((endDeg - startDeg + 540) % 360) - 180
  return normalizeDegrees(startDeg + shortestChange * progress)
}

export function interpolateSatelliteTrack(
  track: SatelliteTrackPoint[],
  timestampMs: number,
): InterpolatedSatellitePosition | null {
  const firstPoint = track[0]
  const lastPoint = track.at(-1)

  if (
    !firstPoint ||
    !lastPoint ||
    timestampMs < firstPoint.timestampMs ||
    timestampMs > lastPoint.timestampMs
  ) {
    return null
  }

  if (track.length === 1) {
    return {
      azimuthDeg: firstPoint.azimuthDeg,
      elevationDeg: firstPoint.elevationDeg,
      distanceKm: firstPoint.distanceKm,
    }
  }

  for (let index = 0; index < track.length - 1; index += 1) {
    const start = track[index]
    const end = track[index + 1]

    if (!start || !end || timestampMs > end.timestampMs) {
      continue
    }

    const durationMs = end.timestampMs - start.timestampMs
    const progress =
      durationMs === 0 ? 1 : (timestampMs - start.timestampMs) / durationMs

    return {
      azimuthDeg: interpolateAzimuth(
        start.azimuthDeg,
        end.azimuthDeg,
        progress,
      ),
      elevationDeg: interpolateNumber(
        start.elevationDeg,
        end.elevationDeg,
        progress,
      ),
      distanceKm: interpolateNumber(
        start.distanceKm,
        end.distanceKm,
        progress,
      ),
    }
  }

  return null
}
