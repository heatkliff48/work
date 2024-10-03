require('dotenv').config();
const express = require('express');
const session = require('express-session');
const WebSocket = require('ws');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const redis = require('redis');
const redisClient = redis.createClient();
redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});
const RedisStore = require('connect-redis')(session);
const Fingerprint = require('express-fingerprint');
const cookieParser = require('cookie-parser');
const registerWsEmitter = require('./src/ws/wsEmitter');

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
const productionBatchLogRouter = require('./router/productionBatchLog.js');

const app = express();
const map = new Map();

const sessionParser = session({
  name: 'sesid',
  store: new RedisStore({ client: redisClient }),
  saveUninitialized: false,
  secret: process.env.SECRET,
  resave: false,
  cookie: {
    expires: 24 * 60 * 60e3,
    httpOnly: true,
  },
});

app.use(cors({ credentials: true, origin: process.env.ORIGIN }));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionParser);

app.use(
  Fingerprint({
    parameters: [Fingerprint.useragent, Fingerprint.acceptHeaders],
  })
);

// app.use(async (req, res, next) => {
//   await TokenService.checkAccess(req, res, next);
// });
app.use((req, res, next) => {
  // res.locals.token = process.env.API;
  if (req.session.user) {
    res.locals.user = req.session.user;
  }
  next();
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ clientTracking: false, noServer: true });

app.use('/auth', AuthRootRouter);
app.use('/products', ProductRootRouter);
app.use('/roles', RolesRootRouter);
app.use('/orders', OrdersRootRouter);
app.use('/clients', clientsRouter);
app.use('/clientsAddress', clientsAddress);
app.use('/deliveryAddress', deliveryAddress);
app.use('/clientsContactInfo', clientsContactInfo);
app.use('/warehouse', WarehouseRootRouter);
app.use('/usersInfo', usersInfoRouter);
app.use('/usersMainInfo', usersMainInfoRouter);
app.use('/productionBatchLog', productionBatchLogRouter);

// Обработка WebSocket соединений
server.on('upgrade', function (req, socket, head) {
  sessionParser(req, {}, () => {
    if (!req?.session?.user?.id) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    console.log('Session is parsed!');

    wss.handleUpgrade(req, socket, head, function (ws) {
      wss.emit('connection', ws, req);
    });
  });
});

registerWsEmitter(map);

// Обработка соединения WebSocket
wss.on('connection', function (ws, request) {
  const userId = request.session.user.id;
  console.log('>>>>>>>>>>>>>>>>>>request.session.user', request.session.user);
  map.set(userId, ws);

  ws.on('close', function () {
    map.delete(userId);
  });
});

server.listen(process.env.PORT, () => {
  console.log('Server start on port ', process.env.PORT);
});
