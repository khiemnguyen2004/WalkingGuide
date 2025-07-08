import React, { useState } from "react";
import axios from "axios";

function RegisterForm({ onSuccess, onSwitch }) {
  const [full_name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    // Client-side validation
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/auth/register", {
        full_name,
        email,
        password,
        confirmPassword,
      });

      if (response.data.success) {
        setSuccess(response.data.message);
        // Clear form
        setFullName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        
        // Close modal after a delay
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi đăng ký");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="w-100">
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <div className="mb-3">
        <label className="form-label">Họ và tên:</label>
        <input
          type="text"
          className="form-control"
          value={full_name}
          onChange={(e) => setFullName(e.target.value)}
          required
          disabled={isLoading}
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
          disabled={isLoading}
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
          disabled={isLoading}
          minLength={6}
        />
        <small className="text-muted">Mật khẩu phải có ít nhất 6 ký tự</small>
      </div>
      
      <div className="mb-3">
        <label className="form-label">Xác nhận mật khẩu:</label>
        <input
          type="password"
          className="form-control"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={isLoading}
          minLength={6}
        />
        {confirmPassword && password !== confirmPassword && (
          <small className="text-danger">Mật khẩu xác nhận không khớp</small>
        )}
        {confirmPassword && password === confirmPassword && (
          <small className="text-success">✓ Mật khẩu khớp</small>
        )}
      </div>
      
      <button 
        type="submit" 
        className="btn btn-success w-100"
        disabled={isLoading || !full_name || !email || !password || !confirmPassword}
      >
        {isLoading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Đang đăng ký...
          </>
        ) : (
          "Đăng ký"
        )}
      </button>
      
      <p className="mt-3 text-center">
        Đã có tài khoản? <button type="button" className="btn btn-link p-0" onClick={onSwitch}>Đăng nhập</button>
      </p>
    </form>
  );
}

export default RegisterForm;
