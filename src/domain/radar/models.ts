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
  date: string | null
  site: LaunchSite | null
}

export type SatelliteObjectType =
  | 'payload'
  | 'rocket_body'
  | 'debris'
  | 'unknown'

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
  owner: SatelliteOwner | null
  objectType: SatelliteObjectType | null
  launch: SatelliteLaunch | null
  visibleFromMs: number
  visibleUntilMs: number
  maxElevationDeg: number
  start: SatellitePassPosition
  end: SatellitePassPosition
  track: SatelliteTrackPoint[]
}
