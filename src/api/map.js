const apiOrigin = `${import.meta.env.VITE_API_ORIGIN}/api/v1`
const mapApiOrigin = `https://api.mapbox.com`

const getUrlWithParams = (url, params) => {
  const urlObject = new URL(url)
  if (params && Object.keys(params).length) {
    Object.keys(params).forEach((key) => {
      const value = params[key]
      if (value) {
        urlObject.searchParams.append(key, value)
      }
    })
  }
  return urlObject.toString()
}

export const getMapDirection = async ({ profile, coordinates, params }) => {
  const response = await fetch(
    getUrlWithParams(
      `${mapApiOrigin}/directions/v5/mapbox/${profile}/${coordinates}`,
      params,
    ),
    {
      method: 'GET',
    },
  )

  return response.json()
}

export const getLocationBySearch = async ({ query, params }) => {
  const response = await fetch(
    getUrlWithParams(
      `${mapApiOrigin}/geocoding/v5/mapbox.places/${query}.json`,
      params,
    ),
    { method: 'GET' },
  )

  return response.json()
}

export const getMapObjects = async (params) => {
  const response = await fetch(
    getUrlWithParams(`${apiOrigin}/map-object`, params),
    { method: 'GET' },
  )

  return response.json()
}
