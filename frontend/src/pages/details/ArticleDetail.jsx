import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ArticleDetail = () => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        setLoading(false);
      } catch (err) {
        setError(`Lỗi khi gọi API: ${err.message}`);
        setLoading(false);
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
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">{article.title}</h1>
      {article.image_url && (
        <img
          src={article.image_url}
          alt={article.title}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
      )}
      <div className="text-gray-600 mb-4">
        <p>Người đăng: Admin {article.admin_id}</p>
      </div>
      <div className="prose prose-lg">
        <p>{article.content}</p>
      </div>
      <button
        onClick={() => navigate(-1)}
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Quay lại
      </button>
    </div>
  );
};

export default ArticleDetail;