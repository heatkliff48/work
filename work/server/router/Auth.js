const { Router } = require('express');
const AuthController = require('../controllers/Auth.js');

const router = Router();

router.post('/sign-in', AuthController.signIn);
router.post('/refresh', AuthController.refresh);
router.post('/check/user', AuthController.checkUser);
router.post('/logout', AuthController.logOut);

// Регистрация отключена.
// В будущем можно вернуть с requireRole(3).
// router.post('/sign-up', requireRole(3), AuthController.signUp);

module.exports = router;
