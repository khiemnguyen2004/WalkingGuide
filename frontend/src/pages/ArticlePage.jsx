import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import "../css/HomePage.css";

function ArticlePage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3000/api/articles");
        setArticles(res.data);
      } catch (err) {
        console.error("Lỗi khi tải bài viết:", err);
        setError("Không thể tải danh sách bài viết. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="min-vh-100 d-flex flex-column bg-light home-container">
      <Header />
      <Navbar activePage="articles" />
      <main className="container px-4 py-5 flex-grow-1">
        <h2 className="h4 mb-3 fw-bold">Danh sách bài viết</h2>
        {loading ? (
          <p className="text-muted">Đang tải dữ liệu...</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : articles.length === 0 ? (
          <p className="text-muted">Không có bài viết nào để hiển thị.</p>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 cards-wrapper">
            {articles.map((article) => (
              <Link
                key={article.id}
                to={`/articles/${article.id}`}
                className="card text-decoration-none"
              >
                <div className="card-body card-info">
                  <h3 className="card-title text-primary">{article.title}</h3>
                  <p className="card-text text-muted">
                    {article.content ? `${article.content.substring(0, 100)}...` : "Chưa có nội dung"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default ArticlePage;