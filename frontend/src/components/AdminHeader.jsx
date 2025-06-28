import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "../css/luxury-home.css";
import { AuthContext } from "../contexts/AuthContext.jsx";

const AdminHeader = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <header className="luxury-header fixed-top" style={{zIndex: 1060, background: 'linear-gradient(90deg, #b6e0fe 0%, #5b9df9 100%)', minHeight: 50, left: 220, width: 'calc(100% - 220px)', padding: 0}}>
      <div className="container d-flex flex-row align-items-center justify-content-between py-1" style={{minHeight: 56}}>
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-speedometer2 text-primary" style={{fontSize: '1.3rem', marginRight: 8}} />
          <span className="fw-bold" style={{fontSize: '1.08rem', letterSpacing: '1px'}}>Quản trị trang</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <Link to="/" className="btn btn-sm btn-outline-primary me-2" style={{fontSize: '0.97rem', padding: '2px 12px'}}>
            <i className="bi bi-house-door me-1" /> Trang chủ
          </Link>
          <i className="bi bi-person-circle" style={{fontSize: '1.15rem'}} title="Admin" />
          <span className="d-none d-md-inline small" style={{fontSize: '0.97rem'}}>{user?.full_name || 'Admin'}</span>
          <button className="btn btn-sm btn-outline-light ms-2" style={{fontSize: '0.97rem', padding: '2px 12px'}} onClick={logout}>
            <i className="bi bi-box-arrow-right me-1" /> Đăng xuất
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
