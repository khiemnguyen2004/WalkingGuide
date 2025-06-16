const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Đăng ký
exports.register = async (req, res) => {
  const { email, full_name, password } = req.body;

  if (!email || !password || !full_name) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (email, password_hash, full_name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, full_name, role',
      [email, hashedPassword, full_name, 'USER']
    );

    res.status(201).json({ message: 'Đăng ký thành công', user: result.rows[0] });
  } catch (err) {
    console.error('Lỗi đăng ký:', err);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) return res.status(401).json({ message: 'Email không tồn tại' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ message: 'Sai mật khẩu' });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ message: 'Đăng nhập thành công', token });
  } catch (err) {
    console.error('Lỗi đăng nhập:', err);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};
