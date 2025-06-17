import React, { useEffect, useState } from "react";
import axios from "axios";

function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("USER");

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
      password: "123456", // Mặc định, cần thay đổi UI sau
      role,
    });
    fetchUsers();
    setFullName("");
    setEmail("");
    setRole("USER");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      await axios.delete(`http://localhost:3000/api/users/${id}`);
      fetchUsers();
    }
  };

  return (
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
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="form-select mb-2"
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <button onClick={handleCreate} className="btn btn-success">Thêm</button>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.full_name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsersAdmin;
