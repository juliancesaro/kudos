export const getAuthTokenFromUrl = () => {
  let token = window.location.search
    ? window.location.search.split("code=")[1].split("&")[0]
    : null;
  return token;
};

export const getCurrentTime = () => {
  // Fetch activies before current time
  const now = new Date();
  const utcMilllisecondsSinceEpoch =
    now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  return Math.round(utcMilllisecondsSinceEpoch / 1000);
};
