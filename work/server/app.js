require('dotenv').config();
const express = require('express');
const session = require('express-session');
const WebSocket = require('ws');
const { randomUUID } = require('crypto');
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

const AldabaranRootRouter = require('./router/aldabaran.js');
const AuthRootRouter = require('./router/Auth.js');
const ProductionQualitiesRootRouter = require('./router/ProductionQuality.js');
const ProductRootRouter = require('./router/Product.js');
const OrdersRootRouter = require('./router/Orders.js');
const RolesRootRouter = require('./router/Roles.js');
const StockBalanceRootRouter = require('./router/StockBalance.js');
const clientsRouter = require('./router/clients.js');
const clientsAddress = require('./router/clientsAddress');
const deliveryAddress = require('./router/deliveryAddress');
const clientsContactInfo = require('./router/clientsContactInfo');
const clientsPriceInfo = require('./router/ClientsOldRoute.js');
const WarehouseRootRouter = require('./router/Warehouse.js');
const usersInfoRouter = require('./router/usersInfo.js');
const usersMainInfoRouter = require('./router/usersMainInfo.js');
const productionBatchLogRouter = require('./router/productionBatchLog.js');
const batchOutsideRouter = require('./router/batchoutside.js');
const recipeRouter = require('./router/RecipeRoute.js');
const recipeOrdersRouter = require('./router/RecipeOrders.js');
const fileUpload = require('./router/fileUpload.js');
const filesWarehouseRouter = require('./router/FilesWarehouse.js');
const filesOrderRouter = require('./router/FilesOrder.js');
const filesProductRouter = require('./router/FilesProduct.js');
const files = require('./router/Files.js');
const dryMixesJournalRouter = require('./router/drymixesjournal.js');
const relatedMaterialsJournalRouter = require('./router/relatedmaterialsjournal.js');
const anchorRouter = require('./router/anchor.js');
const toolRouter = require('./router/tool.js');
const qualityManagementRouter = require('./router/qualitymanagement.js');
const dryMixesWarehouseRouter = require('./router/drymixeswarehouse.js');
const relatedMaterialsWarehouseRouter = require('./router/relatedmaterialswarehouse.js');
const anchorsWarehouseRouter = require('./router/anchorswarehouse.js');
const toolsWarehouseRouter = require('./router/toolswarehouse.js');
const rawMaterialsWarehouseRouter = require('./router/rawmaterialswarehouse.js');
const relatedMaterialsBackorderListRouter = require('./router/relatedmaterialsbackorderlist.js');
const productCodeRouter = require('./router/productCode.js');
const orderRandomProductsRouter = require('./router/orderRandom.js');
const lotesListRouter = require('./router/loteslist.js');
const orderToWarehouseRouter = require('./router/orderToWarehouse.js');
const greenLineMonitoringRouter = require('./router/greenLineMonitoring.js');
const temperatureDataMonitoringRouter = require('./router/temperatureDataMonitoring.js');

const app = express();
const map = new Map();

const sessionParser = session({
  name: 'sesid',
  store: new RedisStore({ client: redisClient }),
  saveUninitialized: false,
  secret: process.env.SECRET,
  resave: false,
  // Скользящая сессия: каждый HTTP-запрос продлевает её ещё на 12 часов,
  // выход происходит только после 12 часов бездействия.
  rolling: true,
  cookie: {
    maxAge: 12 * 60 * 60e3,
    httpOnly: true,
  },
});

app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      const allowedOrigins = process.env.ORIGIN.split(',');

      // Добавляем проверку для Tailscale
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        /\.ts\.net:\d+$/.test(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  }),
);
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionParser);

app.use(
  Fingerprint({
    parameters: [Fingerprint.useragent, Fingerprint.acceptHeaders],
  }),
);

// app.use(async (req, res, next) => {
//   await TokenService.checkAccess(req, res, next);
// });
app.use((req, res, next) => {
  console.log('Запрос пришел с Origin:', req.headers.origin);
  // res.locals.token = process.env.API;
  if (req.session.user) {
    res.locals.user = req.session.user;
  }
  next();
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ clientTracking: false, noServer: true });

// Код закрытия WS «сессия недействительна». HTTP-статус ответа на upgrade
// браузер клиенту не показывает, поэтому используем код из диапазона
// 4000–4999, отведённого под приложение (по аналогии с HTTP 401).
const WS_UNAUTHORIZED_CLOSE_CODE = 4401;
const WS_HEARTBEAT_INTERVAL = 30e3;

app.use('/aldabaran', AldabaranRootRouter);
app.use('/auth', AuthRootRouter);
app.use('/products', ProductRootRouter);
app.use('/productionQuality', ProductionQualitiesRootRouter);
app.use('/roles', RolesRootRouter);
app.use('/orders', OrdersRootRouter);
app.use('/clients', clientsRouter);
app.use('/clientsAddress', clientsAddress);
app.use('/deliveryAddress', deliveryAddress);
app.use('/clientsContactInfo', clientsContactInfo);
app.use('/clientsPriceInfo', clientsPriceInfo);
app.use('/warehouse', WarehouseRootRouter);
app.use('/usersInfo', usersInfoRouter);
app.use('/usersMainInfo', usersMainInfoRouter);
app.use('/productionBatchLog', productionBatchLogRouter);
app.use('/batchOutside', batchOutsideRouter); //???
app.use('/recipe', recipeRouter);
app.use('/recipe_orders', recipeOrdersRouter);
app.use('/allfiles', files);
app.use('/files', fileUpload);
app.use('/filesWarehouse', filesWarehouseRouter);
app.use('/filesOrder', filesOrderRouter);
app.use('/filesProduct', filesProductRouter);
app.use('/stockBalance', StockBalanceRootRouter);
app.use('/dryMixesJournal', dryMixesJournalRouter);
app.use('/relatedMaterialsJournal', relatedMaterialsJournalRouter);
app.use('/anchor', anchorRouter);
app.use('/tool', toolRouter);
app.use('/dryMixesWarehouse', dryMixesWarehouseRouter);
app.use('/relatedMaterialsWarehouse', relatedMaterialsWarehouseRouter);
app.use('/anchorsWarehouse', anchorsWarehouseRouter);
app.use('/toolsWarehouse', toolsWarehouseRouter);
app.use('/rawMaterialsWarehouse', rawMaterialsWarehouseRouter);
app.use('/qualityManagement', qualityManagementRouter);
app.use('/relatedMaterialsBackorderList', relatedMaterialsBackorderListRouter);
app.use('/productCode', productCodeRouter);
app.use('/orderRandom', orderRandomProductsRouter);
app.use('/lotesList', lotesListRouter);
app.use('/orderToWarehouse', orderToWarehouseRouter);
app.use('/greenLineMonitoring', greenLineMonitoringRouter);
app.use('/temperatureDataMonitoring', temperatureDataMonitoringRouter);

// Обработка WebSocket соединений
server.on('upgrade', function (req, socket, head) {
  sessionParser(req, {}, () => {
    if (!req?.session?.user?.id) {
      wss.handleUpgrade(req, socket, head, function (ws) {
        ws.close(WS_UNAUTHORIZED_CLOSE_CODE, 'Unauthorized');
      });
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
  // Keyed by connection, not by user: the same user may have several tabs open.
  const connectionId = `${userId}:${randomUUID()}`;
  map.set(connectionId, ws);

  ws.isAlive = true;
  ws.on('pong', function () {
    ws.isAlive = true;
  });

  // Клиент сам проверяет, живо ли соединение (после сна, смены сети и т.п.)
  ws.on('message', function (data) {
    if (data.toString() === 'ping') ws.send('pong');
  });

  ws.on('close', function () {
    map.delete(connectionId);
  });
});

// Соединения, оборванные без закрытия (сон ноутбука, пропала сеть),
// не присылают pong — закрываем их, чтобы не слать сообщения в пустоту.
setInterval(function () {
  for (const ws of map.values()) {
    if (!ws.isAlive) {
      ws.terminate();
      continue;
    }
    ws.isAlive = false;
    ws.ping();
  }
}, WS_HEARTBEAT_INTERVAL);

server.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`Server start on http://ваш_локальный_IP:${process.env.PORT}`);
});
