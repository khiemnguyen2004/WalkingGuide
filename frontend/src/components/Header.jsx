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
    <header className="luxury-header">
      <div className="container text-center">
        <span role="img" aria-label="logo" style={{marginRight: 12, fontSize: 32}}>🚶‍♂️</span>
        <h1 className="h3 fw-bold">Walking Guide</h1>
        <p className="mt-2">Khám phá địa điểm, chuyến đi và bài viết hấp dẫn</p>
        {user?.role === "ADMIN" && (
          <Link to="/admin" className="btn btn-warning btn-sm me-2">
            Trang quản trị
          </Link>
        )}
        {user && (
          <Link to="/my-tours" className="btn btn-success btn-sm me-2">
            Tour của tôi
          </Link>
        )}
        {user ? (
          <>
            <span>Xin chào, {user.full_name}</span>
            <button onClick={handleLogout} className="btn btn-light btn-sm ms-2">
              Đăng xuất
            </button>
          </>
        ) : (
          <Link to="/login" className="btn btn-light btn-sm mt-2">Đăng nhập</Link>
        )}
      </div>
    </header>
  );
}

export default Header;
