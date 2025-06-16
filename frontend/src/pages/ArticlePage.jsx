import React, { useEffect, useState } from "react";
import articleApi from "../api/articleApi";

function ArticlePage() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    articleApi.getAll().then(res => setArticles(res.data)).catch(console.error);
  }, []);

  return (
    <div>
      <h1>Bài viết</h1>
      <ul>
        {articles.map(a => (
          <li key={a.id}>{a.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default ArticlePage;
