import React, { useContext, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ConfirmModal from "./ConfirmModal";

function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const avatarRef = useRef();

  const handleLogout = () => {
    setShowConfirm(true);
  };
  const confirmLogout = () => {
    logout();
    setDropdownOpen(false);
    setShowConfirm(false);
    alert("Đăng xuất thành công!");
  };
  const cancelLogout = () => setShowConfirm(false);

  const openLogin = () => {
    setAuthMode("login");
    setAuthOpen(true);
    setDropdownOpen(false);
  };
  const openRegister = () => {
    setAuthMode("register");
    setAuthOpen(true);
    setDropdownOpen(false);
  };
  const closeAuth = () => setAuthOpen(false);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (avatarRef.current && !avatarRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  return (
    <header className="luxury-navbar luxury-header navbar navbar-expand-lg fixed-top" style={{marginBottom: 0}}>
      <div className="container d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <Link to ="/">
            <img src="/src/images/banner.png" alt="Walking Guide Banner" style={{ height: 100, marginRight: 28, borderRadius: 12 }} />
          </Link>
        </div>
        <div className="d-flex align-items-center gap-2 position-relative" ref={avatarRef}>
          {user && (
            <Link to="/my-tours" className="btn btn-main d-flex align-items-center me-2" style={{gap: 8}}>
              <i className="bi bi-person-walking" style={{fontSize: 20}}></i>
              <span>Tour của tôi</span>
            </Link>
          )}
          <div className="dropdown">
            <button
              className="btn rounded-circle p-0 d-flex align-items-center justify-content-center border-0"
              style={{ width: 48, height: 48, background: 'none', boxShadow: 'none' }}
              onClick={() => setDropdownOpen((v) => !v)}
              aria-label="User menu"
            >
              <i className="bi bi-person-circle" style={{ fontSize: 32, color: '#1a5bb8', padding: 0, background: 'none' }}></i>
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu dropdown-menu-end show mt-2 p-3 shadow" style={{ minWidth: 220, right: 0, left: 'auto' }}>
                {user ? (
                  <>
                    <div className="mb-2 text-center">
                      <div className="fw-bold" style={{fontSize: '1.1rem'}}>{user.full_name}</div>
                      <div className="text-muted" style={{fontSize: '0.95rem'}}>{user.email}</div>
                    </div>
                    <hr className="my-2" />
                    {user.role === "ADMIN" && (
                      <Link to="/admin" className="dropdown-item text-decoration-none" onClick={()=>setDropdownOpen(false)}>
                        <i className="bi bi-gear-wide-connected me-2"></i>Trang quản trị
                      </Link>
                    )}
                    <button className="dropdown-item text-danger mt-2" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <button className="dropdown-item" onClick={openLogin}>
                      <i className="bi bi-box-arrow-in-right me-2"></i>Đăng nhập
                    </button>
                    <button className="dropdown-item" onClick={openRegister}>
                      <i className="bi bi-person-plus me-2"></i>Đăng ký
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <AuthModal open={authOpen} onClose={closeAuth}>
        {authMode === "login" ? (
          <LoginForm onSuccess={closeAuth} onSwitch={() => setAuthMode("register")} />
        ) : (
          <RegisterForm onSuccess={closeAuth} onSwitch={() => setAuthMode("login")} />
        )}
      </AuthModal>
      <ConfirmModal
        open={showConfirm}
        title="Xác nhận đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất?"
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </header>
  );
}

export default Header;
