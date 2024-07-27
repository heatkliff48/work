const clientsContactInfo = require("express").Router()
const { ContactInfos } = require('../db/models')
const TokenService = require('../services/Token.js');
const { ACCESS_TOKEN_EXPIRATION } = require('../constants.js');
const RefreshSessionsRepository = require('../repositories/RefreshSession.js');
const { COOKIE_SETTINGS } = require('../constants.js');

clientsContactInfo.post('/', async(req,res) => {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.user;

    try {
        const {
            currentClientID,
            first_name, 
            last_name, 
            address,
            formal_position,
            role_in_the_org,
            phone_number_office,
            phone_number_mobile,
            phone_number_messenger,
            email,
            linkedin,
            social
        } = req.body.contactInfo;
        const contactInfo = await ContactInfos.create({
            client_id: currentClientID,
            first_name, 
            last_name, 
            address,
            formal_position,
            role_in_the_org,
            phone_number_office,
            phone_number_mobile,
            phone_number_messenger,
            email,
            linkedin,
            social
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
        .json({ contactInfo, accessToken, accessTokenExpiration: ACCESS_TOKEN_EXPIRATION});

    } catch (err) {
        console.error(err.message);
    }
})

//get all

clientsContactInfo.get('/', async(req,res) => {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.user;

    try {
        const clientsContactInfo = await ContactInfos.findAll();
        res.json(clientsContactInfo);
    } catch (err) {
        console.error(err.message);
    }
})

clientsContactInfo.get('/:c_id', async(req,res) => {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.user;
    
    try {
        const {c_id} = req.params;
        const contactInfo = await ContactInfos.findAll({
            where: {
                id: c_id,
            },
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
        .json({ contactInfo, accessToken, accessTokenExpiration: ACCESS_TOKEN_EXPIRATION});
    } catch (err) {
        console.error(err.message);
    }
})

module.exports = clientsContactInfo