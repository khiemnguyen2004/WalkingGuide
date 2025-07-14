import React, { useContext, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ConfirmModal from "./ConfirmModal";
import NotificationIcon from "./NotificationIcon";
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import ForgotPasswordModal from "./ForgotPasswordModal";

function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const avatarRef = useRef();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    // Replace alert with modern notification
    const toastContainer = document.createElement('div');
    toastContainer.className = 'position-fixed top-0 end-0 p-3';
    toastContainer.style.zIndex = '9999';
    toastContainer.innerHTML = `
      <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header bg-success text-white">
          <i class="bi bi-check-circle-fill me-2"></i>
          <strong class="me-auto">Thành công</strong>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">
          Đăng xuất thành công!
        </div>
      </div>
    `;
    document.body.appendChild(toastContainer);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
      if (toastContainer.parentNode) {
        toastContainer.parentNode.removeChild(toastContainer);
      }
    }, 3000);
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
            <img src="/src/images/banner.png" alt="Walking Guide Banner" style={{ height: 180, marginRight: 28, borderRadius: 12 }} />
          </Link>
        </div>
        <div className="d-flex align-items-center gap-2 position-relative" ref={avatarRef}>
          <LanguageSwitcher />
          {user && (
            <Link to="/my-tours" className="btn d-flex align-items-center me-2 text-decoration-none" style={{gap: 8}}>
              <i className="bi bi-person-walking" style={{fontSize: 20, color: '#1a5bb8'}}></i>
              <span style={{color: '#1a5bb8'}}>{t('Your Bookings')}</span>
            </Link>
          )}
          {user && <NotificationIcon />}
          
          <div className="dropdown">
            <button
              className="btn rounded-circle p-0 d-flex align-items-center justify-content-center border-0"
              style={{ width: 48, height: 48, background: 'none', boxShadow: 'none' }}
              onClick={() => setDropdownOpen((v) => !v)}
              aria-label="User menu"
            >
              {user && user.image_url ? (
                <img 
                  src={user.image_url.startsWith("http") ? user.image_url : `http://localhost:3000${user.image_url}`} 
                  alt="User Avatar" 
                  style={{ 
                    width: 40, 
                    height: 40, 
                    objectFit: 'cover', 
                    borderRadius: '50%',
                    border: '2px solid #fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                />
              ) : (
                <i className="bi bi-person-circle" style={{ fontSize: 32, color: '#1a5bb8', padding: 0, background: 'none' }}></i>
              )}
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu dropdown-menu-end show mt-2 p-3 shadow" style={{ minWidth: 220, right: 0, left: 'auto' }}>
                {user ? (
                  <>
                    <div className="mb-3 text-center">
                      {user.image_url && (
                        <div className="mb-2">
                          <img 
                            src={user.image_url.startsWith("http") ? user.image_url : `http://localhost:3000${user.image_url}`} 
                            alt="User Avatar" 
                            style={{ 
                              width: 60, 
                              height: 60, 
                              objectFit: 'cover', 
                              borderRadius: '50%',
                              border: '3px solid #fff',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                            }}
                          />
                        </div>
                      )}
                      <div className="fw-bold" style={{fontSize: '1.1rem'}}>{user.full_name}</div>
                      <div className="text-muted" style={{fontSize: '0.95rem'}}>{user.email}</div>
                    </div>
                    <hr className="my-2" />
                    {user.role === "ADMIN" && (
                      <Link to="/admin" className="dropdown-item text-decoration-none" onClick={()=>setDropdownOpen(false)}>
                        <i className="bi bi-gear-wide-connected me-2"></i>{t('Admin Dashboard')}
                      </Link>
                    )}
                    <Link to="/users" className="dropdown-item text-decoration-none me-2" onClick={()=>setDropdownOpen(false)}>
                      <i className="bi bi-person-circle me-2"></i>{t('Profile')}
                    </Link>
                    <Link to="/notifications" className="dropdown-item text-decoration-none me-2" onClick={()=>setDropdownOpen(false)}>
                      <i className="bi bi-bell me-2"></i>{t('Notifications')}
                    </Link>
                    <button className="dropdown-item text-danger mt-2" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>{t('Logout')}
                    </button>
                  </>
                ) : (
                  <>
                    <button className="dropdown-item" onClick={openLogin}>
                      <i className="bi bi-box-arrow-in-right me-2"></i>{t('Login')}
                    </button>
                    <button className="dropdown-item" onClick={openRegister}>
                      <i className="bi bi-person-plus me-2"></i>{t('Register')}
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
          <LoginForm onSuccess={closeAuth} onSwitch={() => setAuthMode("register")} onForgotPassword={() => setShowForgot(true)} />
        ) : (
          <RegisterForm onSuccess={closeAuth} onSwitch={() => setAuthMode("login")} />
        )}
      </AuthModal>
      <ForgotPasswordModal show={showForgot} onClose={() => setShowForgot(false)} />
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
