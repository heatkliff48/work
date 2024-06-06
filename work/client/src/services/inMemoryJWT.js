// import axios from 'axios';

// const url = axios.create({
//   baseURL: process.env.REACT_APP_URL,
//   withCredentials: true,
// });

// const inMemoryJWTservices = () => {
//   let inMemoryJWT = null;
//   let refreshTimeoutId = null;

//   const refreshToken = (expiration) => {
//     const timeoutTrigger = expiration - 10000;

//     refreshTimeoutId = setTimeout(() => {
//       url
//         .post('/auth/refresh')
//         .then((res) => {
//           const { accessToken, accessTokenExpiration } = res.data;
//           setToken(accessToken, accessTokenExpiration);
//         })
//         .catch(console.error);
//     }, timeoutTrigger);
//   };

//   const abortRefreshToken = () => {
//     if (refreshTimeoutId) clearInterval(refreshTimeoutId);
//   };

//   const getToken = () => inMemoryJWT;
//   const setToken = (token, tokenExpiration) => {
//     inMemoryJWT = token;
//     refreshToken(tokenExpiration);
//   };
//   const deleteToken = () => {
//     inMemoryJWT = null;
//     abortRefreshToken();
//   };
//   return { getToken, setToken, deleteToken };
// };

// export default inMemoryJWTservices();
