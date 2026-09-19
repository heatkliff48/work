const { Router } = require('express');
const AuthController = require('../controllers/Auth.js');

const router = Router();

router.post('/sign-in', AuthController.signIn);
router.post('/sign-up', AuthController.signUp);
router.post('/refresh', AuthController.refresh);
router.post('/check/user', AuthController.checkUser);
router.post('/logout', AuthController.logOut);

module.exports = router;
