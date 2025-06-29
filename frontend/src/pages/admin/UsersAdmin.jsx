import React, { useEffect, useState } from "react";
import AdminHeader from "../../components/AdminHeader.jsx";
import AdminSidebar from "../../components/AdminSidebar.jsx";
import axios from "axios";

function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("USER");
  const [password, setPassword] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:3000/api/users");
    setUsers(res.data);
  };

  const handleCreate = async () => {
    await axios.post("http://localhost:3000/api/users", {
      full_name: fullName,
      email,
      password, // required
      role,
    });
    fetchUsers();
    setFullName("");
    setEmail("");
    setPassword("");
    setRole("USER");
  };

  const handleEdit = (user) => {
    setEditId(user.id);
    setFullName(user.full_name);
    setEmail(user.email);
    setRole(user.role);
    setPassword(user.password_hash);
    
    // Scroll to top of the page to show the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdate = async () => {
    await axios.put(`http://localhost:3000/api/users/${editId}`, {
      full_name: fullName,
      email,
      password_hash: password || undefined,
      role,
    });
    fetchUsers();
    setEditId(null);
    setFullName("");
    setEmail("");
    setPassword("");
    setRole("USER");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      await axios.delete(`http://localhost:3000/api/users/${id}`);
      fetchUsers();
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-row" style={{ background: "#f6f8fa" }}>
      <AdminSidebar alwaysExpanded />
      <div
        className="flex-grow-1 d-flex flex-column admin-dashboard"
        style={{
          marginLeft: 220,
          minHeight: "100vh",
          padding: 0,
          background: "#f6f8fa",
        }}
      >
        <AdminHeader />
        <main
          className="flex-grow-1"
          style={{
            padding: 0,
            maxWidth: "100%",
            width: "100%",
            margin: 0,
          }}
        >
          <div className="admin-dashboard-cards-row">
            <div className="container py-4">
              <h2>Quản lý người dùng</h2>

              <div className="mb-3">
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="form-control mb-2"
                  placeholder="Họ tên"
                />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control mb-2"
                  placeholder="Email"
                />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control mb-2"
                  placeholder="Mật khẩu"
                  type="password"
                />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="form-select mb-2"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
                {editId ? (
                  <>
                    <button onClick={handleUpdate} className="btn admin-main-btn me-2">
                      Cập nhật
                    </button>
                    <button
                      onClick={() => {
                        setEditId(null);
                        setFullName("");
                        setEmail("");
                        setPassword("");
                        setRole("USER");
                      }}
                      className="btn admin-btn-secondary"
                    >
                      Hủy
                    </button>
                  </>
                ) : (
                  <button onClick={handleCreate} className="btn admin-main-btn">
                    Thêm
                  </button>
                )}
              </div>

              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Họ tên</th>
                    <th>Email</th>
                    <th>Vai trò</th>
                    <th style={{textAlign: 'center'}}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.full_name}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td style={{textAlign: 'center'}}>
                        <button
                          className="btn admin-main-btn btn-sm me-2"
                          onClick={() => handleEdit(u)}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn admin-btn-danger btn-sm"
                          onClick={() => handleDelete(u.id)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default UsersAdmin;
