const { AppDataSource } = require("../data-source");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userRepository = AppDataSource.getRepository("User");

exports.register = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã được sử dụng." });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const newUser = userRepository.create({
      full_name,
      email,
      password_hash,
      role: "USER",
    });

    await userRepository.save(newUser);
    res.status(201).json({ message: "Đăng ký thành công." });
  } catch (err) {
    console.error("Đăng ký lỗi:", err);
    res.status(500).json({ message: "Lỗi máy chủ." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Sai email hoặc mật khẩu." });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Sai email hoặc mật khẩu." });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Đăng nhập lỗi:", err);
    res.status(500).json({ message: "Lỗi máy chủ." });
  }
};
