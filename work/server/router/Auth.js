const { Router } = require('express');
const AuthController = require('../controllers/Auth.js');

const router = Router();

router.post('/sign-in', AuthController.signIn);
router.post('/sign-up', AuthController.signUp);
router.post('/logout', AuthController.logOut);

module.exports = router;
