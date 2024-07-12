const clientsRouter = require("express").Router()
//const pool = require("../db");
const { Client } = require('../db/models');
const TokenService = require('../services/Token.js');
const { ACCESS_TOKEN_EXPIRATION } = require('../constants.js');
const RefreshSessionsRepository = require('../repositories/RefreshSession.js');
const { COOKIE_SETTINGS } = require('../constants.js');

clientsRouter.post('/', async(req, res) => {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.user;

    const { 
        c_name, 
        tin, 
        category 
    } = req.body.client
    console.log('posos', req.body.client)
    try {
        const client = await Client.create({ 
            c_name, 
            tin, 
            category
        })

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
        .json({ client, accessToken, accessTokenExpiration: ACCESS_TOKEN_EXPIRATION});

    } catch (err) {
        console.log(err)
        return res. status(500).json(err)
    }

    
})

clientsRouter.get('/', async(req,res) => {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.user;

    try {
        const allClients = await Client.findAll({
            order: [
                ['id', 'ASC']
            ] 
        });
        
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
        .json({ allClients, accessToken, accessTokenExpiration: ACCESS_TOKEN_EXPIRATION});

        //res.json(allClients);
    } catch (err) {
        console.error(err.message);
    }
})

clientsRouter.get('/:id', async(req,res) => {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.user;

    try {
        const lastID = await Client.findOne({ 
            attributes: ['id'],
            order: [
                ['id', 'DESC']
            ] 
        });
        
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
        .json({ lastID, accessToken, accessTokenExpiration: ACCESS_TOKEN_EXPIRATION});

        // res.json(lastID);
    } catch (err) {
        console.error(err.message);
    }
})

clientsRouter.post('/update/:c_id', async(req, res) => {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.user;

    const {
        c_id,
        c_name, 
        tin, 
        category 
    } = req.body.client
    console.log('BACK END UPDATE CLIENT', req.body.client)
    try {
        //const {c_id} = req.params;
        const client = await Client.update({ 
            c_name, 
            tin, 
            category,
            },
            {where: {
                id: c_id,
            },}
        )

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
        .json({ client, accessToken, accessTokenExpiration: ACCESS_TOKEN_EXPIRATION});

    } catch (err) {
        console.log(err)
        return res. status(500).json(err)
    }
})

module.exports = clientsRouter