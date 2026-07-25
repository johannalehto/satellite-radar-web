export type NormalizedRadarPoint = {
  x: number
  y: number
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum)
}

export function projectToRadarPoint(
  azimuthDeg: number,
  elevationDeg: number,
): NormalizedRadarPoint {
  const elevation = clamp(elevationDeg, 0, 90)
  const radius = 1 - elevation / 90
  const azimuthRad = (azimuthDeg * Math.PI) / 180

  return {
    x: radius * Math.sin(azimuthRad),
    y: -radius * Math.cos(azimuthRad),
  }
}
