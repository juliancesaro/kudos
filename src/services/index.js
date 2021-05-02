import axios from 'axios'
import { getAuthTokenFromUrl } from '../utils'
const { VUE_APP_CLIENT_ID, VUE_APP_CLIENT_SECRET } = process.env

const getLocalAccessToken = () =>
  window.localStorage.getItem('strava_access_token')
const getLocalRefreshToken = () =>
  window.localStorage.getItem('strava_refresh_token')
const getLocalTokenExpiry = () =>
  window.localStorage.getItem('strava_token_expiry')

const setLocalAccessToken = (token) =>
  window.localStorage.setItem('strava_access_token', token)
const setLocalRefreshToken = (token) =>
  window.localStorage.setItem('strava_refresh_token', token)
const setLocalTokenExpiry = (token) =>
  window.localStorage.setItem('strava_token_expiry', token)

const removeLocalAccessToken = () =>
  window.localStorage.removeItem('strava_access_token')
const removeLocalRefreshToken = () =>
  window.localStorage.removeItem('strava_refresh_token')
const removeLocalTokenExpiry = () =>
  window.localStorage.removeItem('strava_token_expiry')

const refreshAccessToken = async () => {
  try {
    const authReponse = await axios.post(
      `https://www.strava.com/api/v3/oauth/token`,
      null,
      {
        params: {
          client_id: VUE_APP_CLIENT_ID,
          client_secret: VUE_APP_CLIENT_SECRET,
          grant_type: 'refresh_token',
          refresh_token: getLocalRefreshToken(),
        },
      }
    )
    const responseData = authReponse.data
    setLocalAccessToken(responseData.access_token)
    setLocalRefreshToken(responseData.refresh_token)
    setLocalTokenExpiry(responseData.expires_at)
    window.location.reload()
    return
  } catch (error) {
    console.log(error)
  }
}

export const getAccessToken = async () => {
  let token = getAuthTokenFromUrl()
  const localTokenExpiry = getLocalTokenExpiry()

  if (localTokenExpiry && Number(localTokenExpiry * 1000) - Date.now() <= 0) {
    refreshAccessToken()
  }

  const localAccessToken = getLocalAccessToken()

  if (!localAccessToken && token) {
    try {
      const authReponse = await axios.post(
        `https://www.strava.com/api/v3/oauth/token`,
        null,
        {
          params: {
            client_id: VUE_APP_CLIENT_ID,
            client_secret: VUE_APP_CLIENT_SECRET,
            code: token,
            grant_type: 'authorization_code',
          },
        }
      )
      const responseData = authReponse.data
      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${responseData.access_token}`
      setLocalAccessToken(responseData.access_token)
      setLocalRefreshToken(responseData.refresh_token)
      setLocalTokenExpiry(responseData.expires_at)
      window.location =
        process.env.NODE_ENV === 'production'
          ? 'https://kudos-web.herokuapp.com/'
          : `http://localhost:8080/`
      return responseData.access_token
    } catch (error) {
      console.log(error)
    }
  }
  axios.defaults.headers.common['Authorization'] = `Bearer ${localAccessToken}`
  return localAccessToken
}

export const logout = () => {
  axios.defaults.headers.common['Authorization'] = null
  removeLocalAccessToken()
  removeLocalRefreshToken()
  removeLocalTokenExpiry()
  window.location =
    process.env.NODE_ENV === 'production'
      ? 'https://kudos-web.herokuapp.com'
      : `http://localhost:8080`
}

export const getUserInfo = async () => {
  try {
    const userInfoResponse = await axios.get(
      'https://www.strava.com/api/v3/athlete'
    )
    return userInfoResponse.data
  } catch (error) {
    console.log(error)
  }
}

export const getActivities = async (page, beforeDate, num) => {
  try {
    const userInfoResponse = await axios.get(
      'https://www.strava.com/api/v3/athlete/activities',
      {
        params: {
          before: beforeDate,
          per_page: num,
          page: page,
        },
      }
    )
    return userInfoResponse.data
  } catch (error) {
    console.log(error)
  }
}

export const getUserStats = async (id) => {
  try {
    const userStatsResponse = await axios.get(
      `https://www.strava.com/api/v3/athletes/${id}/stats`
    )
    return userStatsResponse.data
  } catch (error) {
    console.log(error)
  }
}
