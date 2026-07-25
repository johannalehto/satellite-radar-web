export type SatellitePassId = string

export type SatelliteOwner = {
  code: string
  name: string
}

export type LaunchSite = {
  code: string
  name: string
}

export type SatelliteLaunch = {
  date: string
  site: LaunchSite
}

export type SatellitePassPosition = {
  azimuthDeg: number
  direction: string
}

export type SatelliteTrackPoint = {
  timestampMs: number
  azimuthDeg: number
  elevationDeg: number
  distanceKm: number
}

export type SatellitePass = {
  passId: SatellitePassId
  satelliteId: string
  name: string
  owner: SatelliteOwner
  objectType: string
  launch: SatelliteLaunch
  visibleFromMs: number
  visibleUntilMs: number
  maxElevationDeg: number
  start: SatellitePassPosition
  end: SatellitePassPosition
  track: SatelliteTrackPoint[]
}
