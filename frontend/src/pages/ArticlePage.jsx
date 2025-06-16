import { useEffect, useState } from "react";
import axios from "axios";

function ArticlePage() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/articles")
      .then(res => setArticles(res.data))
      .catch(err => console.error("Lỗi khi tải bài viết:", err));
  }, []);

  return (
    <div>
      <h1>Danh sách bài viết</h1>
      <ul>
        {articles.map((article) => (
        <div key={article.id} className="article-card">
            <h2>{article.title}</h2>
            <p>{article.content}</p>
        </div>
        ))}
      </ul>
    </div>
  );
}

export default ArticlePage;
