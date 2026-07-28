type NominatimAddress = {
  suburb?: string
  neighbourhood?: string
  city_district?: string
  city?: string
  town?: string
  country?: string
}

type NominatimReverseResponse = {
  address?: NominatimAddress
  display_name?: string
}

export async function getLocationName(
  latitude: number,
  longitude: number,
): Promise<string | null> {
  const url = new URL('https://nominatim.openstreetmap.org/reverse')
  url.searchParams.set('lat', String(latitude))
  url.searchParams.set('lon', String(longitude))
  url.searchParams.set('format', 'json')

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(
      `Location name request failed with status ${response.status}`,
    )
  }

  const data = (await response.json()) as NominatimReverseResponse
  const address = data.address ?? {}
  const area =
    address.suburb ??
    address.neighbourhood ??
    address.city_district
  const city = address.city ?? address.town

  if (area && city) {
    return `${area}, ${city}`
  }

  if (city && address.country) {
    return `${city}, ${address.country}`
  }

  return data.display_name ?? null
}
