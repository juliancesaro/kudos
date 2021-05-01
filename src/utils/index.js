export const getAccessToken = () => {
  let token = window.location.search.split('code=')[1].split('&')[0]
  return token
}
