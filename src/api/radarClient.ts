import type { VisibleSatellitesResponse } from './types/radarResponse'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export type VisibleSatellitesLoader = (
  latitude: number,
  longitude: number,
) => Promise<VisibleSatellitesResponse>

export async function getVisibleSatellites(
  latitude: number,
  longitude: number,
): Promise<VisibleSatellitesResponse> {
  const baseUrl = API_BASE_URL.replace(/\/$/, '')
  const url =
    `${baseUrl}/satellite_radar/get_visible_satellites/` +
    `${encodeURIComponent(latitude)}/${encodeURIComponent(longitude)}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(
      `Visible satellites request failed with status ${response.status}`,
    )
  }

  return (await response.json()) as VisibleSatellitesResponse
}
