import axios from 'axios'
import { getAuthTokenFromUrl } from '../utils'

const localAccessToken = window.localStorage.getItem('strava_access_token')

const setLocalAccessToken = (token) =>
  window.localStorage.setItem('strava_access_token', token)
const removeLocalAccessToken = () =>
  window.localStorage.removeItem('strava_access_token')

const setLocalRefreshToken = (token) =>
  window.localStorage.setItem('strava_refresh_token', token)
const removeLocalRefreshToken = () =>
  window.localStorage.removeItem('strava_refresh_token')

const setLocalTokenExpiry = (token) =>
  window.localStorage.setItem('strava_token_expiry', token)
const removeLocalTokenExpiry = () =>
  window.localStorage.removeItem('strava_token_expiry')

export const getAccessToken = async () => {
  let token = getAuthTokenFromUrl()

  if (!localAccessToken && token) {
    const { VUE_APP_CLIENT_ID, VUE_APP_CLIENT_SECRET } = process.env
    try {
      const authReponse = await axios.post(
        `https://www.strava.com/api/v3/oauth/token?client_id=${VUE_APP_CLIENT_ID}&client_secret=${VUE_APP_CLIENT_SECRET}&code=${token}&grant_type=authorization_code`
      )
      const responseData = authReponse.data
      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${responseData.access_token}`
      setLocalAccessToken(responseData.access_token)
      setLocalRefreshToken(responseData.refresh_token)
      setLocalTokenExpiry(responseData.expires_at)
      window.location = `http://localhost:8080/`
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
  window.location = `http://localhost:8080/`
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

export const getActivities = async (num) => {
  try {
    const userInfoResponse = await axios.get(
      'https://www.strava.com/api/v3/athlete/activities',
      {
        params: {
            page: 1, 
            per_page: num, 
        }
      }
    )
    return userInfoResponse.data
  } catch (error) {
    console.log(error)
  }
}
