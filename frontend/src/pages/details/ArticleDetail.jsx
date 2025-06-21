import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header.jsx';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import userApi from '../../api/userApi';

const ArticleDetail = () => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [admin, setAdmin] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id || isNaN(id)) {
      setError('ID bài viết không hợp lệ');
      setLoading(false);
      return;
    }

    const fetchArticle = async () => {
      try {
        const apiUrl = `http://localhost:3000/api/articles/${id}`; // Cập nhật URL
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Lỗi ${response.status}: ${errorText || response.statusText}`);
        }

        const contentType = response.headers.get('Content-Type');
        if (!contentType || !contentType.includes('application/json')) {
          const errorText = await response.text();
          throw new Error(`Response không phải JSON: ${errorText.slice(0, 100)}...`);
        }

        const data = await response.json();
        setArticle(data);
        // Fetch admin info after article is loaded
        fetchAdmin(data.admin_id);
        setLoading(false);
      } catch (err) {
        setError(`Lỗi khi gọi API: ${err.message}`);
        setLoading(false);
      }
    };

    const fetchAdmin = async (adminId) => {
      try {
        const res = await userApi.getAll();
        const found = res.data.find(u => u.id === adminId || u.id === Number(adminId));
        setAdmin(found);
      } catch (e) {
        setAdmin(null);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600">Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex flex-column luxury-home-container">
      <Header />
      <Navbar />
      <main className="flex-grow-1">
        <div className="container mx-auto p-4 max-w-3xl">
          <div style={{ background: 'rgba(245, 250, 255, 0.95)', borderRadius: '1.5rem', boxShadow: '0 4px 24px 0 rgba(31, 38, 135, 0.10)', padding: '2.5rem 2rem', margin: '2rem 0' }}>
            <h1 className="text-3xl font-bold mb-2 text-gray-800 text-center">{article.title}</h1>
            {article.published_at && (
              <div className="text-center text-muted mb-2" style={{fontSize: '1rem'}}>
                Đăng ngày: {new Date(article.published_at).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
            {article.image_url && (
              <div className="d-flex justify-content-center mb-4">
                <img
                  src={article.image_url.startsWith('http') ? article.image_url : `http://localhost:3000${article.image_url}`}
                  alt={article.title}
                  style={{ maxWidth: '420px', maxHeight: '260px', width: '100%', objectFit: 'cover', borderRadius: '1rem', boxShadow: '0 2px 12px #b6e0fe55' }}
                />
              </div>
            )}
            <div className="text-gray-600 mb-4 d-flex flex-wrap gap-4 justify-content-center align-items-center" style={{ fontSize: '1.05rem' }}>
              <span className="d-flex align-items-center gap-2">
                Người đăng: <b>{admin ? admin.full_name : 'Admin'}</b>
              </span>
            </div>
            <div className="prose prose-lg mb-4" style={{ color: '#223a5f', fontSize: '1.15rem', lineHeight: 1.7 }}>
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>
            <div className="d-flex justify-content-center">
              <button
                onClick={() => navigate(-1)}
                className="mt-6 btn btn-main"
                style={{ minWidth: 140 }}
              >
                Quay lại
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ArticleDetail;