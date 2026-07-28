import type { SatellitePass } from '../models'

export type SatellitePassStatus =
  | 'approaching'
  | 'visible-now'
  | 'passed'

export type SatellitePassGroups = {
  approaching: SatellitePass[]
  visibleNow: SatellitePass[]
  passed: SatellitePass[]
}

export function getSatellitePassStatus(
  pass: SatellitePass,
  timestampMs: number,
): SatellitePassStatus {
  if (timestampMs < pass.visibleFromMs) {
    return 'approaching'
  }

  if (timestampMs < pass.visibleUntilMs) {
    return 'visible-now'
  }

  return 'passed'
}

export function groupSatellitePasses(
  passes: SatellitePass[],
  timestampMs: number,
): SatellitePassGroups {
  const groups: SatellitePassGroups = {
    approaching: [],
    visibleNow: [],
    passed: [],
  }

  for (const pass of passes) {
    const status = getSatellitePassStatus(pass, timestampMs)

    if (status === 'approaching') {
      groups.approaching.push(pass)
    } else if (status === 'visible-now') {
      groups.visibleNow.push(pass)
    } else {
      groups.passed.push(pass)
    }
  }

  groups.visibleNow.sort(
    (first, second) =>
      first.visibleUntilMs - second.visibleUntilMs,
  )
  groups.approaching.sort(
    (first, second) =>
      first.visibleFromMs - second.visibleFromMs,
  )
  groups.passed.sort(
    (first, second) =>
      second.visibleUntilMs - first.visibleUntilMs,
  )

  return groups
}
