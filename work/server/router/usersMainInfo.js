const usersMainInfoRouter = require('express').Router();
const bcrypt = require('bcryptjs');

usersMainInfoRouter.get('/', async (req, res) => {
  try {
    const allUsersMainInfo = await Users.findAll({
      order: [['id', 'ASC']],
    });
    return res.status(200).json({ allUsersMainInfo });
    // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
    // .json({
    //   allUsersMainInfo,
    //   accessToken,
    //   accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    // });
  } catch (err) {
    console.error(err.message);
  }
});

usersMainInfoRouter.post('/', async (req, res) => {
  try {
    const { u_username, u_email, password, role } = req.body.usersMainInfo;

    const hashedPassword = bcrypt.hashSync(password, 8);

    const usersMainInfo = await Users.create({
      username: u_username,
      email: u_email,
      password: hashedPassword,
      role,
    });

    return res.status(200).json({ usersMainInfo });
    // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
    // .json({
    //   usersMainInfo,
    //   accessToken,
    //   accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    // });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

usersMainInfoRouter.post('/update/:u_id', async (req, res) => {
  const { u_id, password } = req.body.usersMainInfo;

  const hashedPassword = bcrypt.hashSync(password, 8);

  try {
    const usersMainInfo = await Users.update(
      {
        password: hashedPassword,
      },
      {
        where: {
          id: u_id,
        },
        returning: true,
        plain: true,
      }
    );

    return res.status(200).json({ usersMainInfo });
    // .cookie('freshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
    // .json({
    //   usersMainInfo,
    //   accessToken,
    //   accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    // });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json(err);
  }
});

module.exports = usersMainInfoRouter;
