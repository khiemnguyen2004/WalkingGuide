import React, { useEffect, useState, useContext } from "react";
import AdminHeader from "../../components/AdminHeader.jsx";
import AdminSidebar from "../../components/AdminSidebar.jsx";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext.jsx";
import CKEditorField from "../../components/CKEditorField";

function ToursAdmin() {
  const { user } = useContext(AuthContext);
  const [tours, setTours] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);

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

  const handleEdit = (tour) => {
    setEditId(tour.id);
    setName(tour.name);
    setDescription(tour.description);
  };

  const handleUpdate = async () => {
    await axios.put(`http://localhost:3000/api/tours/${editId}`, {
      name,
      description,
    });
    fetchTours();
    setEditId(null);
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
              <h2>Quản lý tour</h2>

              <div className="mb-3">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-control mb-2"
                  placeholder="Tên tour"
                />
                <CKEditorField
                  value={description}
                  onChange={setDescription}
                  placeholder="Mô tả"
                />
                {editId ? (
                  <>
                    <button onClick={handleUpdate} className="btn admin-main-btn me-2">
                      Cập nhật
                    </button>
                    <button
                      onClick={() => {
                        setEditId(null);
                        setName("");
                        setDescription("");
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
                    <th style={{ width: 60 }}>ID</th>
                    <th style={{ width: 180 }}>Tên tour</th>
                    <th style={{ width: 220 }}>Mô tả</th>
                    <th style={{ width: 70, textAlign: "center" }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {tours.map((t) => (
                    <tr key={t.id}>
                      <td>{t.id}</td>
                      <td>{t.name}</td>
                      <td title={t.description}>
                        {t.description
                          ? t.description.length > 60
                            ? t.description.substring(0, 60) + "..."
                            : t.description
                          : ""}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <button
                          className="btn admin-main-btn btn-sm me-2"
                          onClick={() => handleEdit(t)}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn admin-btn-danger btn-sm"
                          onClick={() => handleDelete(t.id)}
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

export default ToursAdmin;
