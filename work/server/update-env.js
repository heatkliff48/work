const fs = require('fs');
const os = require('os');

(async () => {
  try {
    // Более надежный способ получения IP
    const networkInterfaces = os.networkInterfaces();
    let ip = '';

    // Ищем первый не-internal IPv4 адрес
    Object.values(networkInterfaces).forEach((iface) => {
      iface.forEach((alias) => {
        if (alias.family === 'IPv4' && !alias.internal && !ip) {
          ip = alias.address;
        }
      });
    });

    if (!ip) {
      throw new Error('Не удалось определить локальный IP!');
    }

    console.log('Найден IP:', ip);

    // Обновляем .env бэкенда
    const backendEnvPath = './.env';
    if (fs.existsSync(backendEnvPath)) {
      let backendEnv = fs.readFileSync(backendEnvPath, 'utf8');
      backendEnv = backendEnv.replace(
        /ORIGIN=.*/,
        `ORIGIN=http://localhost:3000,http://${ip}:3000,https://bx24.baublock.com,http://100.117.143.37:3000`,
      );
      fs.writeFileSync(backendEnvPath, backendEnv);
      console.log('✅ .env бэкенда обновлен');
    } else {
      console.warn('Файл .env бэкенда не найден');
    }

    // Обновляем .env фронтенда
    const frontendEnvPath = '../client/.env';
    if (fs.existsSync(frontendEnvPath)) {
      let frontendEnv = fs.readFileSync(frontendEnvPath, 'utf8');
      frontendEnv = frontendEnv
        .replace(/REACT_APP_URL=.*/, `REACT_APP_URL=http://${ip}:3001`)
        .replace(
          /REACT_APP_URL_SOCKET=.*/,
          `REACT_APP_URL_SOCKET=ws://${ip}:3001`,
        );
      fs.writeFileSync(frontendEnvPath, frontendEnv);
      console.log('✅ .env фронтенда обновлен');
    } else {
      console.warn('Файл .env фронтенда не найден');
    }
  } catch (err) {
    console.error('Ошибка:', err.message);
    process.exit(1);
  }
})();
