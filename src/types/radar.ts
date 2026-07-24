export type Owner = {
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

export type SatelliteInfo = {
  satellite_id: string
  satellite_name: string
  owner: Owner
  object_type: string
  launch: SatelliteLaunch
}

export type VisibilityWindow = {
  visible_from: string
  visible_until: string
  max_elevation_deg: number
}

export type PassPosition = {
  azimuth_deg: number
  direction: string
}

export type TrackPoint = {
  timestamp: string
  azimuth_deg: number
  elevation_deg: number
  distance_km: number
}

export type SatellitePass = {
  info: SatelliteInfo
  visibility: VisibilityWindow
  start: PassPosition
  end: PassPosition
  track: TrackPoint[]
}

export type RadarResponse = SatellitePass[]
