export type RadarOwnerResponse = {
  code: string
  name: string
}

export type RadarLaunchSiteResponse = {
  code: string
  name: string
}

export type SatelliteLaunchResponse = {
  date: string
  site: RadarLaunchSiteResponse
}

export type SatelliteInfoResponse = {
  satellite_id: string
  satellite_name: string
  owner: RadarOwnerResponse
  object_type: string
  launch: SatelliteLaunchResponse
}

export type VisibilityWindowResponse = {
  visible_from: string
  visible_until: string
  max_elevation_deg: number
}

export type PassPositionResponse = {
  azimuth_deg: number
  direction: string
}

export type TrackPointResponse = {
  timestamp: string
  azimuth_deg: number
  elevation_deg: number
  distance_km: number
}

export type SatellitePassResponse = {
  info: SatelliteInfoResponse
  visibility: VisibilityWindowResponse
  start: PassPositionResponse
  end: PassPositionResponse
  track: TrackPointResponse[]
}

export type VisibleSatellitesResponse = SatellitePassResponse[]
