import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import '../css/index.css';



function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();         
    navigate("/login");
  };
  return (
    <header className="bg-primary text-white py-3 shadow d-flex">
      <div className="container d-flex align-items-center ms-5">
        <i className="bi bi-shield-lock me-2 fs-3"></i>
        <h1 className="h3 mb-0">Bảng Quản Trị</h1>
      </div>
      <div className="d-flex me-5 w-100 justify-content-end align-items-center">
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

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="list-group-item d-flex align-items-center gap-2">
            <i className="bi bi-person fs-5"></i>
            <Link to="/admin/users" className="text-decoration-none">Quản lý người dùng</Link>
            </li>
            <li className="list-group-item d-flex align-items-center gap-2">
            <i className="bi bi-geo-alt fs-5"></i>
            <Link to="/admin/places" className="text-decoration-none">Quản lý địa điểm</Link>
            </li>
            <li className="list-group-item d-flex align-items-center gap-2">
            <i className="bi bi-newspaper fs-5"></i>
            <Link to="/admin/articles" className="text-decoration-none">Quản lý bài viết</Link>
            </li>
            <li className="list-group-item d-flex align-items-center gap-2">
            <i className="bi bi-map fs-5"></i>
            <Link to="/admin/tours" className="text-decoration-none">Quản lý lộ trình</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

function AdminDashboard() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <Navbar />
      <main className="container py-5 flex-grow-1">
        <p className="lead">Chào mừng bạn đến với bảng điều khiển quản trị viên.</p>
        <div className="card shadow mt-4">
          <ul className="list-group list-group-flush">
            <li className="list-group-item d-flex align-items-center gap-2">
              <i className="bi bi-person fs-5"></i> Quản lý người dùng
            </li>
            <li className="list-group-item d-flex align-items-center gap-2">
              <i className="bi bi-geo-alt fs-5"></i> Quản lý địa điểm
            </li>
            <li className="list-group-item d-flex align-items-center gap-2">
              <i className="bi bi-newspaper fs-5"></i> Quản lý bài viết
            </li>
            <li className="list-group-item d-flex align-items-center gap-2">
              <i className="bi bi-map fs-5"></i> Quản lý lộ trình
            </li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default AdminDashboard;