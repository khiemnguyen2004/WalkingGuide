const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  console.log('Authorization header:', req.headers.authorization);
  if (!token) {
    console.log('No token provided!');
    return res.status(401).json({ message: "Không có token." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.userId,
      role: decoded.role
    };
    next();
  } catch (err) {
    console.log('JWT verification error:', err.message);
    return res.status(403).json({ message: "Token không hợp lệ." });
  }
}

function isAdmin(req, res, next) {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ message: "Chỉ dành cho quản trị viên." });
  }
  next();
}

module.exports = { verifyToken, isAdmin };
