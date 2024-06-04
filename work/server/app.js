const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const Fingerprint = require('express-fingerprint');
const AuthRootRouter = require('./router/Auth.js');
const ProductRootRouter = require('./router/Product.js');
const TokenService = require('./services/Token.js');
const cookieParser = require('cookie-parser');
const { Products } = require('./db/models');

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
//app.use('/products', TokenService.checkAccess, ProductRootRouter);

app.post('/products', async(req, res) => {
  const { 
    version,
    density,
    form,
    certificate,
    width,
    lengths,
    height,
    tradingMark,
    m3,
    m2,
    m,
    widthInArray,
    m3InArray,
    densityInDryMax,
    dinsityInDryDef,
    humidity,
    densityHumidityMax,
    densityHuminityDef,
    weightMax,
    weightDef,
    normOfBrack,
    coefficientOfFree
  } = req.body;

  try {
    const product = await Products.create({
      version,
      density,
      form,
      certificate,
      width,
      lengths,
      height,
      tradingMark,
      m3,
      m2,
      m,
      widthInArray,
      m3InArray,
      densityInDryMax,
      dinsityInDryDef,
      humidity,
      densityHumidityMax,
      densityHuminityDef,
      weightMax,
      weightDef,
      normOfBrack,
      coefficientOfFree
    })

    return res.json(product)
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
})

// app.post('/products', async(req, res) => {
//   const { 
//     version,
//     density,
//     form,
//     certificate,
//     width,
//     lengths,
//     height,
//     tradingMark,
//     m3,
//     m2,
//     m,
//     widthInArray,
//     m3InArray,
//     densityInDryMax,
//     dinsityInDryDef,
//     humidity,
//     densityHumidityMax,
//     densityHuminityDef,
//     weightMax,
//     weightDef,
//     normOfBrack,
//     coefficientOfFree
//   } = req.body;

//   try {
//     const product = await Products.create({
//       version,
//       density,
//       form,
//       certificate,
//       width,
//       lengths,
//       height,
//       tradingMark,
//       m3,
//       m2,
//       m,
//       widthInArray,
//       m3InArray,
//       densityInDryMax,
//       dinsityInDryDef,
//       humidity,
//       densityHumidityMax,
//       densityHuminityDef,
//       weightMax,
//       weightDef,
//       normOfBrack,
//       coefficientOfFree
//     })

//     return res.json(product)
//   } catch (err) {
//     console.log(err)
//     return res.status(500).json(err)
//   }
// })

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
