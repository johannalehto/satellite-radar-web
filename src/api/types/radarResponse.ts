export type SatelliteOwnerResponse = {
  code: string
  name: string
}

export type LaunchSiteResponse = {
  code: string
  name: string
}

export type SatelliteLaunchResponse = {
  date?: string | null
  site?: LaunchSiteResponse | null
}

export type SatelliteObjectTypeResponse =
  | 'payload'
  | 'rocket_body'
  | 'debris'
  | 'unknown'

export type SatelliteInfoResponse = {
  satellite_id: string
  satellite_name: string
  owner?: SatelliteOwnerResponse | null
  object_type?: SatelliteObjectTypeResponse | null
  launch?: SatelliteLaunchResponse | null
}

export type SatellitePassVisibilityResponse = {
  visible_from: string
  visible_until: string
  max_elevation_deg: number
}

export type SatellitePassPositionResponse = {
  azimuth_deg: number
  direction: string
}

export type SatelliteTrackPointResponse = {
  timestamp: string
  azimuth_deg: number
  elevation_deg: number
  distance_km: number
}

export type SatellitePassResponse = {
  info: SatelliteInfoResponse
  visibility: SatellitePassVisibilityResponse
  start: SatellitePassPositionResponse
  end: SatellitePassPositionResponse
  track: SatelliteTrackPointResponse[]
}

export type VisibleSatellitesResponse = SatellitePassResponse[]
