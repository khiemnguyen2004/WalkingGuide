import React, { useEffect, useState } from "react";
import AdminHeader from "../../components/AdminHeader.jsx";
import AdminSidebar from "../../components/AdminSidebar.jsx";
import axios from "axios";
import CKEditorField from "../../components/CKEditorField";
import "../../css/AdminLayout.css";

function PlacesAdmin() {
  const [places, setPlaces] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    const res = await axios.get("http://localhost:3000/api/places");
    setPlaces(res.data);
  };

  const handleCreate = async () => {
    let uploadedImageUrl = imageUrl;
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      const uploadRes = await axios.post("http://localhost:3000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      uploadedImageUrl = uploadRes.data.url;
    }
    await axios.post("http://localhost:3000/api/places", {
      name,
      description,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      image_url: uploadedImageUrl,
    });
    fetchPlaces();
    setName("");
    setDescription("");
    setLatitude("");
    setLongitude("");
    setImageUrl("");
    setImageFile(null);
  };

  const handleEdit = (place) => {
    setEditId(place.id);
    setName(place.name);
    setDescription(place.description);
    setLatitude(place.latitude);
    setLongitude(place.longitude);
    setImageUrl(place.image_url);
  };

  const handleUpdate = async () => {
    let uploadedImageUrl = imageUrl;
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      const uploadRes = await axios.post("http://localhost:3000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      uploadedImageUrl = uploadRes.data.url;
    }
    await axios.put(`http://localhost:3000/api/places/${editId}`, {
      name,
      description,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      image_url: uploadedImageUrl,
    });
    fetchPlaces();
    setEditId(null);
    setName("");
    setDescription("");
    setLatitude("");
    setLongitude("");
    setImageUrl("");
    setImageFile(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa địa điểm này?")) {
      await axios.delete(`http://localhost:3000/api/places/${id}`);
      fetchPlaces();
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
              <h2>Quản lý địa điểm</h2>

              <div className="mb-3">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-control mb-2"
                  placeholder="Tên địa điểm"
                />
                <CKEditorField
                  value={description}
                  onChange={setDescription}
                  placeholder="Mô tả"
                />
                <input
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="form-control mb-2"
                  placeholder="Vĩ độ (latitude)"
                  type="number"
                />
                <input
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="form-control mb-2"
                  placeholder="Kinh độ (longitude)"
                  type="number"
                />
                <input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="form-control mb-2"
                  placeholder="Link ảnh (image_url)"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="form-control mb-2"
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
                        setLatitude("");
                        setLongitude("");
                        setImageUrl("");
                        setImageFile(null);
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
                    <th>Tên địa điểm</th>
                    <th>Mô tả</th>
                    <th>Vĩ độ</th>
                    <th>Kinh độ</th>
                    <th>Ảnh</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {places.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.name}</td>
                      <td>
                        <div style={{maxWidth: 300, maxHeight: 120, overflow: 'auto'}} dangerouslySetInnerHTML={{ __html: p.description }} />
                      </td>
                      <td>{p.latitude}</td>
                      <td>{p.longitude}</td>
                      <td>
                        {p.image_url ? (
                          <img
                            src={
                              p.image_url.startsWith("http")
                                ? p.image_url
                                : `http://localhost:3000${p.image_url}`
                            }
                            alt="Ảnh"
                            style={{ maxWidth: 80, maxHeight: 60 }}
                          />
                        ) : (
                          ""
                        )}
                      </td>
                      <td>
                        <button
                          className="btn admin-main-btn btn-sm me-2"
                          onClick={() => handleEdit(p)}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn admin-btn-danger btn-sm"
                          onClick={() => handleDelete(p.id)}
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

export default PlacesAdmin;
