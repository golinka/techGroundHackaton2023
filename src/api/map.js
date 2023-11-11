const apiOrigin = `${import.meta.env.VITE_API_ORIGIN}/api/v1`
const mapApiOrigin = `https://api.mapbox.com/directions/v5/mapbox`

export const getMapDirection = async ({ profile, coordinates, params }) => {
  const url = new URL(`${mapApiOrigin}/${profile}/${coordinates}`)

  Object.keys(params).forEach((key) => {
    const value = params[key]
    if (value) {
      url.searchParams.append(key, value)
    }
  })

  const query = await fetch(url.toString(), { method: 'GET' })

  return query.json()
}

export const getMapObjects = async (params) => {
  const url = new URL(`${apiOrigin}/map-object`)

  if (params && Object.keys(params).length) {
    Object.keys(params).forEach((key) => {
      const value = params[key]
      if (value) {
        url.searchParams.append(key, value)
      }
    })
  }
  const query = await fetch(url.toString(), { method: 'GET' })

  return query.json()
}
