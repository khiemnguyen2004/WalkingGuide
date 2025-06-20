import React, { useEffect, useState, useContext } from "react";
import AdminHeader from "../../components/AdminHeader.jsx";
import AdminSidebar from "../../components/AdminSidebar.jsx";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext.jsx";
import LexicalEditor from "../../components/LexicalEditor";

function ArticlesAdmin() {
  const { user } = useContext(AuthContext);
  const [articles, setArticles] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editImageUrl, setEditImageUrl] = useState("");

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    const res = await axios.get("http://localhost:3000/api/articles");
    setArticles(res.data);
  };

  const handleCreate = async () => {
    if (!user || !user.id) {
      alert("Bạn cần đăng nhập để tạo bài viết.");
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
    setTitle("");
    setContent("");
    setImageFile(null);
  };

  const handleEdit = (article) => {
    setEditId(article.article_id);
    setTitle(article.title);
    setContent(article.content);
    setEditImageUrl(article.image_url);
    setImageFile(null);
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
    setTitle("");
    setContent("");
    setImageFile(null);
    setEditImageUrl("");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa bài viết này?")) {
      await axios.delete(`http://localhost:3000/api/articles/${id}`);
      fetchArticles();
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-row" style={{background: '#f6f8fa'}}>
      <AdminSidebar alwaysExpanded />
      <div className="flex-grow-1 d-flex flex-column admin-dashboard" style={{marginLeft: 220, minHeight: '100vh', padding: 0, background: '#f6f8fa'}}>
        <AdminHeader />
        <main className="flex-grow-1" style={{padding: 0, maxWidth: '100%', width: '100%', margin: 0}}>
          <div className="admin-dashboard-cards-row">
            <div className="container py-4">
              <h2>Quản lý bài viết</h2>

              <div className="mb-3">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-control mb-2"
                  placeholder="Tiêu đề"
                />
                <LexicalEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Nội dung"
                  className="mb-2"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setImageFile(e.target.files[0])}
                  className="form-control mb-2"
                />
                {editId ? (
                  <>
                    <button onClick={handleUpdate} className="btn admin-main-btn me-2">Cập nhật</button>
                    <button onClick={() => { setEditId(null); setTitle(""); setContent(""); setImageFile(null); setEditImageUrl(""); }} className="btn admin-btn-secondary">Hủy</button>
                  </>
                ) : (
                  <button onClick={handleCreate} className="btn admin-main-btn">Thêm</button>
                )}
              </div>

              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th style={{width: 60}}>ID</th>
                    <th style={{width: 180}}>Tiêu đề</th>
                    <th style={{width: 220}}>Nội dung</th>
                    <th style={{width: 100}}>Ảnh</th>
                    <th style={{width: 100, textAlign: 'center'}}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((a) => (
                    <tr key={a.article_id}>
                      <td>{a.article_id}</td>
                      <td>{a.title}</td>
                      <td title={a.content}>{a.content ? a.content.length > 60 ? a.content.substring(0, 60) + "..." : a.content : ""}</td>
                      <td>
                        {a.image_url ? (
                          <img
                            src={a.image_url.startsWith('http') ? a.image_url : `http://localhost:3000${a.image_url}`}
                            alt="Ảnh"
                            style={{ maxWidth: 80, maxHeight: 60 }}
                          />
                        ) : ""}
                      </td>
                      <td style={{textAlign: 'center'}}>
                        <button className="btn admin-main-btn btn-sm me-2" onClick={() => handleEdit(a)}>Sửa</button>
                        <button className="btn admin-btn-danger btn-sm" onClick={() => handleDelete(a.article_id)}>Xóa</button>
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

export default ArticlesAdmin;
