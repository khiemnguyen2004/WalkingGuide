import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const handleLogout = () => {
    logout();
  };

  const openLogin = () => {
    setAuthMode("login");
    setAuthOpen(true);
  };
  const openRegister = () => {
    setAuthMode("register");
    setAuthOpen(true);
  };
  const closeAuth = () => setAuthOpen(false);

  return (
    <header className="luxury-navbar luxury-header navbar navbar-expand-lg fixed-top" style={{marginBottom: 0}}>
      <div className="container d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <Link to ="/">
            <img src="/src/images/banner.png" alt="Walking Guide Banner" style={{ height: 100, marginRight: 28, borderRadius: 12 }} />
          </Link>
        </div>
        <div className="d-flex align-items-center gap-2">
          {user && user.role === "ADMIN" && (
            <Link to="/admin" className="btn btn-main me-2">
              Trang quản trị
            </Link>
          )}
          {user && (
            <Link to="/my-tours" className="btn btn-main me-2">
              Tour của tôi
            </Link>
          )}
          {user ? (
            <>
              <span className="me-2">Xin chào, {user.full_name}</span>
              <button onClick={handleLogout} className="btn btn-main ms-2">
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-main mt-2" onClick={openLogin}>Đăng nhập</button>
              <button className="btn btn-outline-primary mt-2 ms-2" onClick={openRegister}>Đăng ký</button>
            </>
          )}
        </div>
      </div>
      <AuthModal open={authOpen} onClose={closeAuth}>
        {authMode === "login" ? (
          <LoginForm onSuccess={closeAuth} onSwitch={() => setAuthMode("register")} />
        ) : (
          <RegisterForm onSuccess={closeAuth} onSwitch={() => setAuthMode("login")} />
        )}
      </AuthModal>
    </header>
  );
}

export default Header;
