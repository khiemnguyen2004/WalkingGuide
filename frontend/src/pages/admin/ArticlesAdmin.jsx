import React, { useEffect, useState } from "react";
import axios from "axios";

function ArticlesAdmin() {
  const [articles, setArticles] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    const res = await axios.get("http://localhost:3000/api/articles");
    setArticles(res.data);
  };

  const handleCreate = async () => {
    await axios.post("http://localhost:3000/api/articles", {
      title,
      content,
    });
    fetchArticles();
    setTitle("");
    setContent("");
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
        <button onClick={handleCreate} className="btn btn-success">Thêm</button>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tiêu đề</th>
            <th>Nội dung</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((a) => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.title}</td>
              <td>{a.content}</td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(a.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ArticlesAdmin;
