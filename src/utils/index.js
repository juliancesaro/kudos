export const getAccessToken = () => {
  let token = window.location.search
    ? window.location.search.split('code=')[1].split('&')[0]
    : null
  return token
}
