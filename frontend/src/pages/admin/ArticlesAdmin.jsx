import React, { useEffect, useState, useContext } from "react";
import AdminHeader from "../../components/AdminHeader.jsx";
import AdminSidebar from "../../components/AdminSidebar.jsx";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext.jsx";
import CKEditorField from "../../components/CKEditorField";
import { Modal, Button } from "react-bootstrap";
import "../../css/AdminLayout.css";

function ArticlesAdmin() {
  const { user } = useContext(AuthContext);
  const [articles, setArticles] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editImageUrl, setEditImageUrl] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [reports, setReports] = useState([]);
  const [reportActionStatus, setReportActionStatus] = useState(null);

  useEffect(() => {
    fetchArticles();
    fetchReports();
  }, []);

  const fetchArticles = async () => {
    const res = await axios.get("http://localhost:3000/api/articles");
    setArticles(res.data);
  };

  const fetchReports = async () => {
    try {
      console.log('Admin fetching reports with token:', user?.token);
      const res = await axios.get('http://localhost:3000/api/article-reports', {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setReports(res.data);
    } catch (e) {
      setReports([]);
    }
  };

  const handleCreate = async () => {
    if (!user || !user.id) {
      setAlertMessage('Bạn cần đăng nhập để tạo bài viết.');
      setShowAlert(true);
      return;
    }
    let uploadedImageUrl = "";
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      // You need to have an endpoint to handle this upload, e.g. /api/upload
      const uploadRes = await axios.post("http://localhost:3000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      uploadedImageUrl = uploadRes.data.url;
    }
    await axios.post("http://localhost:3000/api/articles", {
      title,
      content,
      image_url: uploadedImageUrl,
      admin_id: user.id,
    });
    fetchArticles();
    resetForm();
  };

  const handleEdit = (article) => {
    setEditId(article.article_id);
    setTitle(article.title);
    setContent(article.content);
    setEditImageUrl(article.image_url);
    setImageFile(null);
    
    // Scroll to top of the page to show the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdate = async () => {
    let uploadedImageUrl = editImageUrl;
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      const uploadRes = await axios.post("http://localhost:3000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      uploadedImageUrl = uploadRes.data.url;
    }
    await axios.put(`http://localhost:3000/api/articles/${editId}`, {
      title,
      content,
      image_url: uploadedImageUrl,
    });
    fetchArticles();
    setEditId(null);
    resetForm();
  };

  const handleDelete = async (id) => {
    setArticleToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!articleToDelete) return;
    
    try {
      await axios.delete(`http://localhost:3000/api/articles/${articleToDelete}`);
      fetchArticles();
      setShowDeleteModal(false);
      setArticleToDelete(null);
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setArticleToDelete(null);
  };

  const handleReportStatus = async (reportId, status) => {
    try {
      console.log('Admin updating report with token:', user?.token, 'role:', user?.role);
      await axios.patch(`http://localhost:3000/api/article-reports/${reportId}`, { status }, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setReportActionStatus('success');
      fetchReports();
    } catch (e) {
      setReportActionStatus('error');
    }
  };

  const handleDeleteReportedArticle = async (articleId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.')) return;
    try {
      await axios.delete(`http://localhost:3000/api/articles/${articleId}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      fetchArticles();
      fetchReports();
      setReportActionStatus('success');
    } catch (e) {
      setReportActionStatus('error');
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setImageFile(null);
    setEditImageUrl("");
  };

  return (
    <div className="admin-layout">
      <AdminHeader />
      <div className="admin-container">
        <AdminSidebar />
        <div className="admin-content">
          <div className="container-fluid">
            {/* Alert Component */}
            {showAlert && (
              <div className="alert alert-warning alert-dismissible fade show" role="alert">
                <i className="bi bi-exclamation-circle-fill me-2"></i>
                {alertMessage}
                <button type="button" className="btn-close" onClick={() => setShowAlert(false)}></button>
              </div>
            )}

            {/* Create/Edit Form */}
            <div className="card mb-4">
              <div className="card-header">
                <h5>{editId ? "Chỉnh sửa Bài viết" : "Tạo Bài viết Mới"}</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Tiêu đề *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Nhập tiêu đề bài viết"
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Nội dung</label>
                  <CKEditorField
                    value={content}
                    onChange={setContent}
                    placeholder="Nhập nội dung bài viết"
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Hình ảnh</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setImageFile(e.target.files[0])}
                    className="form-control"
                  />
                  {editImageUrl && !imageFile && (
                    <div className="mt-2">
                      <img 
                        src={editImageUrl.startsWith('http') ? editImageUrl : `http://localhost:3000${editImageUrl}`}
                        alt="Ảnh hiện tại" 
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

                <div className="d-flex gap-2">
                  {editId ? (
                    <>
                      <Button variant="primary" className="admin-main-btn" onClick={handleUpdate}>
                        Cập nhật Bài viết
                      </Button>
                      <Button variant="secondary" onClick={() => { setEditId(null); resetForm(); }}>
                        Hủy
                      </Button>
                    </>
                  ) : (
                    <Button variant="primary" className="admin-main-btn" onClick={handleCreate}>
                      Tạo Bài viết
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Articles List */}
            <div className="card">
              <div className="card-header">
                <h5>Tất cả Bài viết</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Tiêu đề</th>
                        <th>Nội dung</th>
                        <th>Hình ảnh</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {articles.map((a) => (
                        <tr key={a.article_id}>
                          <td>{a.article_id}</td>
                          <td>{a.title}</td>
                          <td>
                            <div 
                              style={{ 
                                maxHeight: '60px', 
                                overflow: 'hidden',
                                fontSize: '0.9rem'
                              }}
                              dangerouslySetInnerHTML={{ __html: a.content ? (a.content.length > 60 ? a.content.substring(0, 60) + "..." : a.content) : "" }}
                            />
                          </td>
                          <td>
                            {a.image_url ? (
                              <img
                                src={a.image_url.startsWith('http') ? a.image_url : `http://localhost:3000${a.image_url}`}
                                alt="Ảnh bài viết"
                                style={{ 
                                  width: '80px', 
                                  height: '60px', 
                                  objectFit: 'cover',
                                  borderRadius: '4px'
                                }}
                              />
                            ) : (
                              <div 
                                style={{ 
                                  width: '80px', 
                                  height: '60px', 
                                  backgroundColor: '#e9ecef',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#6c757d',
                                  borderRadius: '4px'
                                }}
                              >
                                <i className="bi bi-image"></i>
                              </div>
                            )}
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleEdit(a)}
                              >
                                Sửa
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(a.article_id)}
                              >
                                Xóa
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Article Reports Section */}
            <div className="card mt-5">
              <div className="card-header">
                <h5>Báo cáo bài viết</h5>
              </div>
              <div className="card-body">
                {reportActionStatus === 'success' && <div className="alert alert-success">Cập nhật trạng thái thành công!</div>}
                {reportActionStatus === 'error' && <div className="alert alert-danger">Có lỗi khi cập nhật trạng thái.</div>}
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Bài viết</th>
                        <th>Người báo cáo</th>
                        <th>Lý do</th>
                        <th>Trạng thái</th>
                        <th>Ngày tạo</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports
                        .filter(report => report.status === 'pending')
                        .filter(report => articles.some(a => a.article_id === report.article_id))
                        .length === 0 && (
                        <tr><td colSpan="7" className="text-center">Không có báo cáo nào.</td></tr>
                      )}
                      {reports
                        .filter(report => report.status === 'pending')
                        .filter(report => articles.some(a => a.article_id === report.article_id))
                        .map(report => (
                        <tr key={report.id}>
                          <td>{report.id}</td>
                          <td>
                            <a href={`/articles/${report.article_id}`} target="_blank" rel="noopener noreferrer">Xem bài viết</a>
                          </td>
                          <td>{report.user_id}</td>
                          <td>{report.reason}</td>
                          <td>{report.status}</td>
                          <td>{new Date(report.created_at).toLocaleString()}</td>
                          <td>
                            <button className="btn btn-success btn-sm me-2" onClick={() => handleReportStatus(report.id, 'resolved')}>Đã xử lý</button>
                            <button className="btn btn-secondary btn-sm me-2" onClick={() => handleReportStatus(report.id, 'dismissed')}>Bỏ qua</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteReportedArticle(report.article_id)}>Xóa bài viết</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={cancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>
            Hủy
          </Button>
          <Button variant="danger" className="admin-btn-danger" onClick={confirmDelete}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ArticlesAdmin;
