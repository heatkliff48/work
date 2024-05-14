const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const Fingerprint = require('express-fingerprint');
const AuthRootRouter = require('./router/Auth.js');
const TokenService = require('./services/Token.js');
const cookieParser = require('cookie-parser');

dotenv.config();
const PORT = 3001;

const app = express();

// Подключаем middleware morgan с режимом логирования "dev", чтобы для каждого HTTP-запроса на сервер в консоль выводилась информация об этом запросе.
app.use(morgan('dev'));
// Подключаем middleware, которое позволяет читать содержимое body из HTTP-запросов типа POST, PUT и DELETE.
app.use(express.urlencoded({ extended: true }));
// Подключаем middleware, которое позволяет читать переменные JavaScript, сохранённые в формате JSON в body HTTP-запроса.
app.use(cookieParser());
app.use(express.json());
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
// CORS - это пакет node.js для предоставления промежуточного программного обеспечения Connect / Express, которое можно использовать для включения CORS с различными параметрами.

app.use(
  Fingerprint({
    parameters: [Fingerprint.useragent, Fingerprint.acceptHeaders],
  })
);

app.use('/auth', AuthRootRouter);

const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`server started PORT: ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
