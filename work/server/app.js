const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const Fingerprint = require('express-fingerprint');
const AuthRootRouter = require('./router/Auth.js');
const ProductRootRouter = require('./router/Product.js');
const RolesRootRouter = require('./router/Roles.js');
const TokenService = require('./services/Token.js');
const cookieParser = require('cookie-parser');
const clientsRouter = require("./router/clients");
const clientsAddress = require("./router/clientsAddress");
const deliveryAddress = require("./router/deliveryAddress");
const clientsContactInfo = require("./router/clientsContactInfo");

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
app.use('/products', TokenService.checkAccess, ProductRootRouter);
// app.use('/products', ProductRootRouter);
app.use('/roles', TokenService.checkAccess, RolesRootRouter);
// app.use('/roles', RolesRootRouter);
// app.use('/clients', ClientsRootRouter);
app.use("/clients", TokenService.checkAccess, clientsRouter)
app.use("/clientsAddress", TokenService.checkAccess, clientsAddress)
app.use("/clientsAddress/:c_id", TokenService.checkAccess, clientsAddress)
app.use("/deliveryAddress", TokenService.checkAccess, deliveryAddress)
app.use("/clientsContactInfo", TokenService.checkAccess, clientsContactInfo)


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
