const { Router } = require('express');
const AuthController = require('../controllers/Auth.js');
const AuthValidator = require('../validators/Auth.js');

const router = Router();
router.post('/sign-in', AuthValidator.signIn, AuthController.signIn);
router.post('/sign-up', AuthValidator.signUp, AuthController.signUp);
router.post('/logout', AuthValidator.logOut, AuthController.logOut);
router.post('/refresh', AuthValidator.refresh, AuthController.refresh);

module.exports = router;

// const router = require('express').Router();
// const bcrypt = require('bcrypt');

// const { Users } = require('../db/models');

// function validateEmail(email) {
//   var re = /\S+@\S+\.\S+/;
//   return re.test(email);
// }

// router.route('/reg').post(async (req, res) => {

//   const { username, password } = req.body.user;

//   if (username && password) {
//     const hashPass = await bcrypt.hash(password, 10);

//     try {
//       const newUser = await Users.create({
//         username,
//         password: hashPass,
//       });
//       req.session.user = {
//         id: newUser.id,
//         name: newUser.name,
//       };
//       return res.json({ id: newUser.id, username: newUser.name });
//     } catch (error) {
//       console.error(error);
//       return res.sendStatus(405);
//     }
//   } else {
//     return res.sendStatus(403);
//   }
// });

// router.route('/login').post(async (req, res) => {
//   const { email, password } = req.body.loginForm;

//   if (email && password) {
//     try {
//       const currentUser = await Users.findOne({ where: { email } });
//       if (currentUser && (await bcrypt.compare(password, currentUser.password))) {
//         req.session.user = {
//           id: currentUser.id,
//           name: currentUser.name,
//           telegram: currentUser.telegram,
//         };
//         return res.json({ user: req.session.user });
//       }
//       return res.sendStatus(401);
//     } catch (err) {
//       return res.sendStatus(401);
//     }
//   } else {
//     return res.sendStatus(401);
//   }
// });

// router.get('/check', (req, res) => {
//   console.log('TRY>>>>>>>>>');
//   try {
//     console.log('TRY>>>>>>>>>');
//     if (req.session?.user) {
//       return res.json({ id: req.session.user.id, name: req.session.user.name });
//     }
//   } catch (error) {
//     console.log('ERROR>>>>>>>>>>>>>>>');
//     console.log(error);
//     console.log('ERROR>>>>>>>>>>>>>>>');
//     res.status(err.status || 500);
//     res.json({
//       message: err.message,
//       error: err,
//     });
//   }
// });

// router.get('/logout', (req, res) => {
//   req.session.destroy();
//   res.clearCookie('sesid').redirect('/');
// });

// module.exports = router;
