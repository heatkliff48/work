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

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: process.env.ORIGIN }));
app.use(morgan('dev'));

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
