import React, { useContext } from "react";
import AdminHeader from "../components/AdminHeader.jsx";
import AdminSidebar from "../components/AdminSidebar.jsx";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { Link } from "react-router-dom";
import "../css/luxury-home.css";

function AdminDashboard() {
  const { user } = useContext(AuthContext);
  return (
    <div className="min-vh-100 d-flex flex-row" style={{background: '#f6f8fa'}}>
      <AdminSidebar alwaysExpanded />
      <div className="flex-grow-1 d-flex flex-column luxury-home-container admin-dashboard" style={{marginLeft: 220, minHeight: '100vh', padding: 0, background: '#f6f8fa'}}>
        <AdminHeader />
        <main className="flex-grow-1" style={{padding: 0, maxWidth: '100%', width: '100%', margin: 0}}>
          <h2 className="text-center fw-bold mb-3" style={{fontSize: '2rem', color: '#1a5bb8'}}>Bảng Quản Trị</h2>
          <p className="text-center mb-4" style={{color: '#223a5f'}}>Chào mừng, {user?.full_name || 'Admin'}!</p>
          <div className="admin-dashboard-cards-row">
            <div className="col">
              <Link to="/admin/users" className="text-decoration-none">
                <div className="card admin-dashboard-card h-100 shadow border-0 rounded-4 bg-white text-center hover-shadow">
                  <i className="bi bi-person fs-1 mb-2 text-primary"></i>
                  <div className="fw-bold mb-1">Quản lý người dùng</div>
                  <div className="text-muted small">Xem, chỉnh sửa, và xóa người dùng</div>
                </div>
              </Link>
            </div>
            <div className="col">
              <Link to="/admin/places" className="text-decoration-none">
                <div className="card admin-dashboard-card h-100 shadow border-0 rounded-4 bg-white text-center hover-shadow">
                  <i className="bi bi-geo-alt fs-1 mb-2 text-primary"></i>
                  <div className="fw-bold mb-1">Quản lý địa điểm</div>
                  <div className="text-muted small">Thêm, sửa, xóa địa điểm du lịch</div>
                </div>
              </Link>
            </div>
            <div className="col">
              <Link to="/admin/articles" className="text-decoration-none">
                <div className="card admin-dashboard-card h-100 shadow border-0 rounded-4 bg-white text-center hover-shadow">
                  <i className="bi bi-newspaper fs-1 mb-2 text-primary"></i>
                  <div className="fw-bold mb-1">Quản lý bài viết</div>
                  <div className="text-muted small">Kiểm duyệt và quản lý bài viết</div>
                </div>
              </Link>
            </div>
            <div className="col">
              <Link to="/admin/tours" className="text-decoration-none">
                <div className="card admin-dashboard-card h-100 shadow border-0 rounded-4 bg-white text-center hover-shadow">
                  <i className="bi bi-map fs-1 mb-2 text-primary"></i>
                  <div className="fw-bold mb-1">Quản lý lộ trình</div>
                  <div className="text-muted small">Xem, chỉnh sửa, và xóa lộ trình</div>
                </div>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;