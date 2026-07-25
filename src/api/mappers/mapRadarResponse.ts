import type {
  SatellitePassResponse,
  SatellitePassPositionResponse,
  SatelliteTrackPointResponse,
  VisibleSatellitesResponse,
} from '../types/radarResponse'
import type {
  SatellitePass,
  SatellitePassPosition,
  SatelliteTrackPoint,
} from '../../domain/radar/models'
import { createSatellitePassId } from '../../domain/radar/satellitePassId'

function mapPassPosition(
  response: SatellitePassPositionResponse,
): SatellitePassPosition {
  return {
    azimuthDeg: response.azimuth_deg,
    direction: response.direction,
  }
}

function mapTrackPoint(
  response: SatelliteTrackPointResponse,
): SatelliteTrackPoint {
  return {
    timestampMs: Date.parse(response.timestamp),
    azimuthDeg: response.azimuth_deg,
    elevationDeg: response.elevation_deg,
    distanceKm: response.distance_km,
  }
}

export function mapSatellitePassResponse(
  response: SatellitePassResponse,
): SatellitePass {
  return {
    passId: createSatellitePassId(
      response.info.satellite_id,
      response.visibility.visible_from,
    ),
    satelliteId: response.info.satellite_id,
    name: response.info.satellite_name,
    owner: response.info.owner
      ? {
          code: response.info.owner.code,
          name: response.info.owner.name,
        }
      : null,
    objectType: response.info.object_type ?? null,
    launch: response.info.launch
      ? {
          date: response.info.launch.date ?? null,
          site: response.info.launch.site
            ? {
                code: response.info.launch.site.code,
                name: response.info.launch.site.name,
              }
            : null,
        }
      : null,
    visibleFromMs: Date.parse(response.visibility.visible_from),
    visibleUntilMs: Date.parse(response.visibility.visible_until),
    maxElevationDeg: response.visibility.max_elevation_deg,
    start: mapPassPosition(response.start),
    end: mapPassPosition(response.end),
    track: response.track.map(mapTrackPoint),
  }
}

export function mapVisibleSatellitesResponse(
  response: VisibleSatellitesResponse,
): SatellitePass[] {
  return response.map(mapSatellitePassResponse)
}
