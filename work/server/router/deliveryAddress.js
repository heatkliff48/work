const deliveryAddress = require("express").Router()
const { DeliveryAddresses } = require('../db/models')
const TokenService = require('../services/Token.js');
const { ACCESS_TOKEN_EXPIRATION } = require('../constants.js');
const RefreshSessionsRepository = require('../repositories/RefreshSession.js');
const { COOKIE_SETTINGS } = require('../constants.js');

deliveryAddress.post('/', async(req,res) => {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.user;

    try {
        const {
            currentClientID,
            street, 
            additional_info, 
            city,
            zip_code,
            province,
            country,
            phone_number,
            email
        } = req.body.deliveryAddress;
        const deliveryAddress = await DeliveryAddresses.create({
            client_id: currentClientID,
            street, 
            additional_info, 
            city,
            zip_code,
            province,
            country,
            phone_number,
            email
        }
        );
    
        const payload = { id, username, email };
        const accessToken = await TokenService.generateAccessToken(payload);
        const refreshToken = await TokenService.generateRefreshToken(payload);

        await RefreshSessionsRepository.createRefreshSession({
        user_id: id,
        refresh_token: refreshToken,
        finger_print: fingerprint,
        });

        return res
        .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
        .status(200)
        .json({ deliveryAddress, accessToken, accessTokenExpiration: ACCESS_TOKEN_EXPIRATION});

        //res.json(newDeliveryAddress);
    } catch (err) {
        console.error(err.message);
    }
})

//get all

// deliveryAddress.get('/', async(req,res) => {
//     try {
//         const clientsDeliveryAddresses = await DeliveryAddresses.findAll();
//         res.json(clientsDeliveryAddresses);
//     } catch (err) {
//         console.error(err.message);
//     }
// })

// deliveryAddress.get('/:c_id', async(req,res) => {
//     const fingerprint = req.fingerprint.hash;
//     const { id, username, email } = req.user;

//     try {
//         const {c_id} = req.params;
//         const deliveryAddresses = await DeliveryAddresses.findAll({
//             where: {
//                 id: c_id,
//             },
//         });
//         const payload = { id, username, email };
//         const accessToken = await TokenService.generateAccessToken(payload);
//         const refreshToken = await TokenService.generateRefreshToken(payload);

//         await RefreshSessionsRepository.createRefreshSession({
//         user_id: id,
//         refresh_token: refreshToken,
//         finger_print: fingerprint,
//         });

//         return res
//         .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
//         .status(200)
//         .json({ deliveryAddresses, accessToken, accessTokenExpiration: ACCESS_TOKEN_EXPIRATION});

//         //res.json(clientsDeliveryAddress);
//     } catch (err) {
//         console.error(err.message);
//     }
// })

deliveryAddress.get('/', async(req,res) => {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.user;

    try {
        const deliveryAddresses = await DeliveryAddresses.findAll();
        const payload = { id, username, email };
        const accessToken = await TokenService.generateAccessToken(payload);
        const refreshToken = await TokenService.generateRefreshToken(payload);

        await RefreshSessionsRepository.createRefreshSession({
        user_id: id,
        refresh_token: refreshToken,
        finger_print: fingerprint,
        });

        return res
        .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
        .status(200)
        .json({ deliveryAddresses, accessToken, accessTokenExpiration: ACCESS_TOKEN_EXPIRATION});

        //res.json(clientsDeliveryAddress);
    } catch (err) {
        console.error(err.message);
    }
})

module.exports = deliveryAddress