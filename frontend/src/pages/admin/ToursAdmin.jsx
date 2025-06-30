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
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [editId, setEditId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    const res = await axios.get("http://localhost:3000/api/tours");
    setTours(res.data);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post('http://localhost:3000/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.url;
  };

  const handleCreate = async () => {
    if (!user || !user.id) {
      alert("Bạn cần đăng nhập để tạo tour.");
      return;
    }

    setIsUploading(true);
    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      await axios.post("http://localhost:3000/api/tours", {
        name,
        description,
        image_url: imageUrl,
        user_id: user.id,
      });
      fetchTours();
      setName("");
      setDescription("");
      setImageFile(null);
      setImagePreview("");
    } catch (error) {
      console.error("Error creating tour:", error);
      alert("Có lỗi xảy ra khi tạo tour");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (tour) => {
    setEditId(tour.id);
    setName(tour.name);
    setDescription(tour.description);
    setImageFile(null);
    setImagePreview(tour.image_url || "");
    
    // Scroll to top of the page to show the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdate = async () => {
    setIsUploading(true);
    try {
      let imageUrl = imagePreview;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      await axios.put(`http://localhost:3000/api/tours/${editId}`, {
        name,
        description,
        image_url: imageUrl,
      });
      fetchTours();
      setEditId(null);
      setName("");
      setDescription("");
      setImageFile(null);
      setImagePreview("");
    } catch (error) {
      console.error("Error updating tour:", error);
      alert("Có lỗi xảy ra khi cập nhật tour");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa tour này?")) {
      await axios.delete(`http://localhost:3000/api/tours/${id}`);
      fetchTours();
    }
  };

  const clearForm = () => {
    setEditId(null);
    setName("");
    setDescription("");
    setImageFile(null);
    setImagePreview("");
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
                
                <div className="mb-2">
                  <label className="form-label">Hình ảnh tour</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="form-control"
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img 
                        src={imagePreview.startsWith('data:') ? imagePreview : `http://localhost:3000${imagePreview}`} 
                        alt="Preview" 
                        style={{ 
                          maxWidth: '200px', 
                          maxHeight: '150px', 
                         objectFit: 'cover',
                          borderRadius: '8px',
                          border: '1px solid #ddd'
                        }} 
                      />
                    </div>
                  )}
                </div>

                <CKEditorField
                  value={description}
                  onChange={setDescription}
                  placeholder="Mô tả"
                />
                
                {editId ? (
                  <>
                    <button 
                      onClick={handleUpdate} 
                      className="btn admin-main-btn me-2"
                      disabled={isUploading}
                    >
                      {isUploading ? "Đang cập nhật..." : "Cập nhật"}
                    </button>
                    <button
                      onClick={clearForm}
                      className="btn admin-btn-secondary"
                      disabled={isUploading}
                    >
                      Hủy
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={handleCreate} 
                    className="btn admin-main-btn"
                    disabled={isUploading}
                  >
                    {isUploading ? "Đang tạo..." : "Thêm"}
                  </button>
                )}
              </div>

              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th style={{ width: 60 }}>ID</th>
                    <th style={{ width: 150 }}>Tên tour</th>
                    <th style={{ width: 120 }}>Hình ảnh</th>
                    <th style={{ width: 200 }}>Mô tả</th>
                    <th style={{ width: 70, textAlign: "center" }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {tours.map((t) => (
                    <tr key={t.id}>
                      <td>{t.id}</td>
                      <td>{t.name}</td>
                      <td>
                        {t.image_url ? (
                          <img 
                            src={`http://localhost:3000${t.image_url}`} 
                            alt={t.name}
                            style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'inline';
                            }}
                          />
                        ) : (
                          <span style={{ color: '#999', fontSize: '12px' }}>Không có ảnh</span>
                        )}
                      </td>
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
