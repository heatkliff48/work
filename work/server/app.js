const morgan = require('morgan');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const Fingerprint = require('express-fingerprint');
const TokenService = require('./services/Token.js');
const cookieParser = require('cookie-parser');
const AuthRootRouter = require('./router/Auth.js');
const ProductRootRouter = require('./router/Product.js');
const OrdersRootRouter = require('./router/Orders.js');
const RolesRootRouter = require('./router/Roles.js');
const clientsRouter = require('./router/clients.js');
const clientsAddress = require('./router/clientsAddress');
const deliveryAddress = require('./router/deliveryAddress');
const clientsContactInfo = require('./router/clientsContactInfo');
const WarehouseRootRouter = require('./router/Warehouse.js');
const usersInfoRouter = require('./router/usersInfo.js');
const usersMainInfoRouter = require('./router/usersMainInfo.js');

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
app.get('/checkServerStatus', (req, res) => {
  console.log('<<<<<<<<<<<<<<<<<<CHECK>>>>>>>>>>>>>>>>>>');
  res.sendStatus(200);
});

app.use('/auth', TokenService.checkAccess, AuthRootRouter);
app.use('/products', TokenService.checkAccess, ProductRootRouter);
app.use('/roles', TokenService.checkAccess, RolesRootRouter);
app.use('/orders', TokenService.checkAccess, OrdersRootRouter);
app.use('/clients', TokenService.checkAccess, clientsRouter);
app.use('/clientsAddress', TokenService.checkAccess, clientsAddress);
app.use('/deliveryAddress', TokenService.checkAccess, deliveryAddress);
app.use('/clientsContactInfo', TokenService.checkAccess, clientsContactInfo);
app.use('/warehouse', TokenService.checkAccess, WarehouseRootRouter);
app.use('/usersInfo', TokenService.checkAccess, usersInfoRouter);
app.use('/usersMainInfo', TokenService.checkAccess, usersMainInfoRouter);

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
