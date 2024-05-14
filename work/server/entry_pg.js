
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await pool.query('SELECT * FROM users WHERE login = $1', [username]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Пользователь с таким логином уже существует' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query('INSERT INTO users (login, password) VALUES ($1, $2) RETURNING *', [username, hashedPassword]);

    res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await pool.query('SELECT * FROM users WHERE login = $1', [username]);
    if (user.rows.length === 0) {
      return res.status(401).json({ message: 'Неверный логин или пароль' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.rows[0].password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Неверный логин или пароль' });
    }

    res.status(200).json({ message: 'Успешная аутентификация' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.listen(5000, () => {
  console.log('Сервер запущен на порту 5000');
});
