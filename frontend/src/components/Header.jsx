import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="luxury-navbar luxury-header navbar navbar-expand-lg" style={{borderBottomLeftRadius: '1.5rem', borderBottomRightRadius: '1.5rem', marginBottom: 0}}>
      <div className="container d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <img src="/src/images/banner.png" alt="Walking Guide Banner" style={{ height: 100, marginRight: 28, borderRadius: 12 }} />
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
            <Link to="/login" className="btn btn-main mt-2">Đăng nhập</Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
