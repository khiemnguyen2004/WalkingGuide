import React, { useState } from "react";
import axios from "axios";

function RegisterForm({ onSuccess, onSwitch }) {
  const [full_name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/auth/register", {
        full_name,
        email,
        password,
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi đăng ký");
    }
  };

  return (
    <form onSubmit={handleRegister} className="w-100">
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-3">
        <label className="form-label">Họ và tên:</label>
        <input
          type="text"
          className="form-control"
          value={full_name}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Email:</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Mật khẩu:</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-success w-100">Đăng ký</button>
      <p className="mt-3 text-center">
        Đã có tài khoản? <button type="button" className="btn btn-link p-0" onClick={onSwitch}>Đăng nhập</button>
      </p>
    </form>
  );
}

export default RegisterForm;
