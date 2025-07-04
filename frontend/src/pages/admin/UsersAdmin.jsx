import React, { useEffect, useState } from "react";
import AdminHeader from "../../components/AdminHeader.jsx";
import AdminSidebar from "../../components/AdminSidebar.jsx";
import axios from "axios";

function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [role, setRole] = useState("USER");
  const [password, setPassword] = useState("");
  const [editId, setEditId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('danger');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:3000/api/users");
    setUsers(res.data);
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
    setIsUploading(true);
    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

    await axios.post("http://localhost:3000/api/users", {
      full_name: fullName,
      email,
        image_url: imageUrl,
      password, // required
      role,
    });
    fetchUsers();
    setFullName("");
    setEmail("");
      setImageFile(null);
      setImagePreview("");
    setPassword("");
    setRole("USER");
    } catch (error) {
      console.error('Error creating user:', error);
      setAlertMessage('Có lỗi xảy ra khi tạo người dùng');
      setAlertType('danger');
      setShowAlert(true);
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (user) => {
    setEditId(user.id);
    setFullName(user.full_name);
    setEmail(user.email);
    setImageFile(null);
    setImagePreview(user.image_url || "");
    setRole(user.role);
    setPassword(user.password_hash);
    
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

    await axios.put(`http://localhost:3000/api/users/${editId}`, {
      full_name: fullName,
      email,
        image_url: imageUrl,
      password_hash: password || undefined,
      role,
    });
    fetchUsers();
    setEditId(null);
    setFullName("");
    setEmail("");
      setImageFile(null);
      setImagePreview("");
    setPassword("");
    setRole("USER");
    } catch (error) {
      console.error('Error updating user:', error);
      setAlertMessage('Có lỗi xảy ra khi cập nhật người dùng');
      setAlertType('danger');
      setShowAlert(true);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    setUserToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    
    try {
      await axios.delete(`http://localhost:3000/api/users/${userToDelete}`);
      fetchUsers();
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      setAlertMessage('Có lỗi xảy ra khi xóa người dùng');
      setAlertType('danger');
      setShowAlert(true);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const clearForm = () => {
    setEditId(null);
    setFullName("");
    setEmail("");
    setImageFile(null);
    setImagePreview("");
    setPassword("");
    setRole("USER");
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

              {/* Alert Component */}
              {showAlert && (
                <div className={`alert alert-${alertType} alert-dismissible fade show`} role="alert">
                  <i className={`bi ${alertType === 'danger' ? 'bi-exclamation-triangle-fill' : 'bi-exclamation-circle-fill'} me-2`}></i>
                  {alertMessage}
                  <button type="button" className="btn-close" onClick={() => setShowAlert(false)}></button>
                </div>
              )}

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
                
                <div className="mb-2">
                  <label className="form-label">Hình ảnh đại diện</label>
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
                          width: '80px', 
                          height: '80px', 
                          objectFit: 'cover',
                          borderRadius: '50%',
                          border: '2px solid #ddd'
                        }} 
                      />
                    </div>
                  )}
                </div>

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
                    <th>ID</th>
                    <th>Hình ảnh</th>
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
                      <td>
                        {u.image_url ? (
                          <img 
                            src={`http://localhost:3000${u.image_url}`} 
                            alt={u.full_name}
                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%' }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : (
                          <div 
                            style={{ 
                              width: '50px', 
                              height: '50px', 
                              borderRadius: '50%', 
                              backgroundColor: '#e9ecef',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#6c757d',
                              fontSize: '18px',
                              fontWeight: 'bold'
                            }}
                          >
                            {u.full_name ? u.full_name.charAt(0).toUpperCase() : 'U'}
                          </div>
                        )}
                      </td>
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

      {/* Delete Confirmation Modal */}
      <div className={`modal fade ${showDeleteModal ? 'show' : ''}`} 
           style={{ display: showDeleteModal ? 'block' : 'none' }} 
           tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title">
                <i className="bi bi-exclamation-triangle me-2"></i>
                Xác nhận xóa
              </h5>
              <button type="button" className="btn-close btn-close-white" onClick={cancelDelete}></button>
            </div>
            <div className="modal-body">
              <p className="mb-0">Bạn có chắc muốn xóa người dùng này? Hành động này không thể hoàn tác.</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={cancelDelete}>
                <i className="bi bi-x-circle me-1"></i>
                Hủy
              </button>
              <button type="button" className="btn btn-danger" onClick={confirmDelete}>
                <i className="bi bi-trash me-1"></i>
                Xóa
              </button>
            </div>
          </div>
        </div>
      </div>
      {showDeleteModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}

export default UsersAdmin;
