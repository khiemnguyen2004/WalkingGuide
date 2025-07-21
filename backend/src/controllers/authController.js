const AppDataSource = require("../data-source");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendVerificationEmail, isEmailConfigured } = require("../utils/email");
const { isValidEmailFormat } = require("../utils/emailValidator");

function getUserRepository() {
  return AppDataSource.getRepository("User");
}

exports.register = async (req, res) => {
  try {
    const { full_name, email, password, confirmPassword } = req.body;

    // Basic validation
    if (!full_name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Mật khẩu xác nhận không khớp." });
    }

    // Basic email format validation only
    if (!isValidEmailFormat(email)) {
      return res.status(400).json({ message: "Email format không hợp lệ." });
    }

    const userRepository = getUserRepository();
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ 
        message: "Email này đã được sử dụng. Vui lòng sử dụng email khác hoặc đăng nhập nếu đã có tài khoản.",
        emailExists: true
      });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = userRepository.create({
      full_name,
      email,
      password_hash,
      role: "USER",
      isEmailVerified: false,
      emailVerificationToken,
    });

    await userRepository.save(newUser);

    // Send verification email
    const verifyLink = `${process.env.FRONTEND_URL || "https://khiemnguyen2004.github.io/walking-guide"}/verify-email?token=${emailVerificationToken}`;
    await sendVerificationEmail(email, verifyLink);

    const message = isEmailConfigured() 
      ? "Đăng ký thành công! Vui lòng kiểm tra email của bạn và nhấp vào liên kết xác thực để kích hoạt tài khoản."
      : "Đăng ký thành công! Lưu ý! Email xác thực không được gửi do cấu hình email chưa hoàn tất.";
    
    res.status(201).json({ 
      message,
      success: true,
      email: email,
      needsVerification: true
    });
  } catch (err) {
    console.error("Đăng ký lỗi:", err);
    res.status(500).json({ message: "Lỗi máy chủ." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userRepository = getUserRepository();
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Sai email hoặc mật khẩu." });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Sai email hoặc mật khẩu." });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(403).json({ 
        message: "Vui lòng xác thực email trước khi đăng nhập. Kiểm tra hộp thư của bạn và nhấp vào liên kết xác thực.",
        needsVerification: true,
        email: user.email
      });
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
        image_url: user.image_url,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (err) {
    console.error("Đăng nhập lỗi:", err);
    res.status(500).json({ message: "Lỗi máy chủ." });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or missing token." });
    }
    const userRepository = getUserRepository();
    const user = await userRepository.findOne({
      where: { emailVerificationToken: token },
    });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired verification link." });
    }
    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    await userRepository.save(user);
    return res.json({ success: true, message: "Email verified successfully." });
  } catch (err) {
    console.error("Email verification error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error during verification." });
  }
};

exports.resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email là bắt buộc." });
    }
    const userRepository = getUserRepository();
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Email không tồn tại trong hệ thống." });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email đã được xác thực." });
    }

    // Generate new verification token
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");
    user.emailVerificationToken = emailVerificationToken;
    await userRepository.save(user);

    // Send new verification email
    const verifyLink = `${process.env.FRONTEND_URL || "https://khiemnguyen2004.github.io/walking-guide"}/verify-email?token=${emailVerificationToken}`;
    await sendVerificationEmail(email, verifyLink);

    res.json({ message: "Email xác thực đã được gửi lại. Vui lòng kiểm tra hộp thư của bạn." });
  } catch (err) {
    console.error("Resend verification email error:", err);
    res.status(500).json({ message: "Lỗi máy chủ." });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !isValidEmailFormat(email)) {
      return res.status(400).json({ message: "Email không hợp lệ." });
    }
    const userRepository = getUserRepository();
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      // For security, always respond with success
      return res.json({ message: "Kiểm tra email của bạn để đặt lại mật khẩu!" });
    }
    // Generate token and expiry (1 hour)
    const token = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = token;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
    await userRepository.save(user);
    // Send email
    const resetLink = `${process.env.FRONTEND_URL || "https://khiemnguyen2004.github.io/walking-guide"}/reset-password?token=${token}`;
    await sendVerificationEmail(email, resetLink, true);
    return res.json({ message: "Kiểm tra email của bạn để đặt lại mật khẩu!" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Lỗi máy chủ." });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;
    if (!token || !password || !confirmPassword) {
      return res.status(400).json({ message: "Thiếu thông tin." });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự." });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Mật khẩu xác nhận không khớp." });
    }
    const userRepository = getUserRepository();
    const user = await userRepository.findOne({ where: { passwordResetToken: token } });
    if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      return res.status(400).json({ message: "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn." });
    }
    user.password_hash = await bcrypt.hash(password, 10);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await userRepository.save(user);
    return res.json({ message: "Đặt lại mật khẩu thành công. Bạn có thể đăng nhập với mật khẩu mới." });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Lỗi máy chủ." });
  }
};
