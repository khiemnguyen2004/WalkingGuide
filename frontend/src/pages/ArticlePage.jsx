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
        {articles.map(article => (
          <li key={article.id}>
            {article.title} - {article.author}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ArticlePage;
