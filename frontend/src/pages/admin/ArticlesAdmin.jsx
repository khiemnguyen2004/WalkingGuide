import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext.jsx";

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
    <div className="container py-4">
      <h2>Quản lý bài viết</h2>

      <div className="mb-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-control mb-2"
          placeholder="Tiêu đề"
        />
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="form-control mb-2"
          placeholder="Nội dung"
        />
        <input
          type="file"
          accept="image/*"
          onChange={e => setImageFile(e.target.files[0])}
          className="form-control mb-2"
        />
        {editId ? (
          <>
            <button onClick={handleUpdate} className="btn btn-warning me-2">Cập nhật</button>
            <button onClick={() => { setEditId(null); setTitle(""); setContent(""); setImageFile(null); setEditImageUrl(""); }} className="btn btn-secondary">Hủy</button>
          </>
        ) : (
          <button onClick={handleCreate} className="btn btn-success">Thêm</button>
        )}
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tiêu đề</th>
            <th>Nội dung</th>
            <th>Ảnh</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((a) => (
            <tr key={a.article_id}>
              <td>{a.article_id}</td>
              <td>{a.title}</td>
              <td>{a.content ? a.content.length > 100 ? a.content.substring(0, 100) + "..." : a.content : ""}</td>
              <td>
                {a.image_url ? (
                  <img
                    src={a.image_url.startsWith('http') ? a.image_url : `http://localhost:3000${a.image_url}`}
                    alt="Ảnh"
                    style={{ maxWidth: 80, maxHeight: 60 }}
                  />
                ) : ""}
              </td>
              <td>
                <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(a)}>Sửa</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(a.article_id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ArticlesAdmin;
