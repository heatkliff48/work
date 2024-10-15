const usersInfoRouter = require('express').Router();
const { UsersInfo } = require('../db/models/index.js');

usersInfoRouter.get('/', async (req, res) => {

  try {
    const allUsersInfo = await UsersInfo.findAll({
      order: [['id', 'ASC']],
    });

    return res.status(200).json({ allUsersInfo });
  } catch (err) {
    console.error(err.message);
  }
});

usersInfoRouter.post('/', async (req, res) => {

  try {
    const { fullName, group, shift, subdivision, phone } = req.body.usersInfo;

    const usersInfo = await UsersInfo.create({
      fullName,
      group,
      shift,
      subdivision,
      phone,
    });

    return res.status(200).json({ usersInfo });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

usersInfoRouter.post('/update/:u_id', async (req, res) => {
  const { u_id, fullName, group, shift, subdivision, phone } = req.body.usersInfo;

  try {
    const usersInfo = await UsersInfo.update(
      {
        fullName,
        group,
        shift,
        subdivision,
        phone,
      },
      {
        where: {
          id: u_id,
        },
        returning: true,
        plain: true,
      }
    );

    return res.status(200).json({ usersInfo });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

module.exports = usersInfoRouter;
