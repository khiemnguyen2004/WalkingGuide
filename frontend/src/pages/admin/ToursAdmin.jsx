import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext.jsx";

function ToursAdmin() {
  const { user } = useContext(AuthContext);
  const [tours, setTours] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    const res = await axios.get("http://localhost:3000/api/tours");
    setTours(res.data);
  };

  const handleCreate = async () => {
    if (!user || !user.id) {
      alert("Bạn cần đăng nhập để tạo tour.");
      return;
    }
    await axios.post("http://localhost:3000/api/tours", {
      name,
      description,
      user_id: user.id,
    });
    fetchTours();
    setName("");
    setDescription("");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa tour này?")) {
      await axios.delete(`http://localhost:3000/api/tours/${id}`);
      fetchTours();
    }
  };

  return (
    <div className="container py-4">
      <h2>Quản lý tour</h2>

      <div className="mb-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-control mb-2"
          placeholder="Tên tour"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-control mb-2"
          placeholder="Mô tả"
        />
        <button onClick={handleCreate} className="btn btn-success">Thêm</button>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên tour</th>
            <th>Mô tả</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {tours.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.name}</td>
              <td>{t.description}</td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ToursAdmin;
