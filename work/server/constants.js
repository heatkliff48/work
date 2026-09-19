const isProduction = process.env.NODE_ENV === 'production';

const ACCESS_TOKEN_EXPIRATION = 30 * 60 * 1000; // 30 минут
const REFRESH_TOKEN_EXPIRATION = 7 * 24 * 60 * 60 * 1000; // 7 дней
const SESSION_EXPIRATION = 24 * 60 * 60 * 1000; // 24 часа

const COOKIE_SETTINGS = {
  REFRESH_TOKEN: {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: REFRESH_TOKEN_EXPIRATION,
    path: '/',
  },

  SESSION: {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: SESSION_EXPIRATION,
    path: '/',
  },
};

module.exports = {
  ACCESS_TOKEN_EXPIRATION,
  REFRESH_TOKEN_EXPIRATION,
  SESSION_EXPIRATION,
  COOKIE_SETTINGS,
};
