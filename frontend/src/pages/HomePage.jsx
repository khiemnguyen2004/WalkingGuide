import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import "../css/HomePage.css";

function HomePage() {
  const [places, setPlaces] = useState([]);
  const [tours, setTours] = useState([]);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/places").then(res => setPlaces(res.data));
    axios.get("http://localhost:3000/api/tours").then(res => setTours(res.data));
    axios.get("http://localhost:3000/api/articles").then(res => setArticles(res.data));
  }, []);

  return (
    <div className="home-container">
      <header>
        <h1>🌍 Walking Guide</h1>
        <p>Khám phá địa điểm, chuyến đi và bài viết hấp dẫn</p>
      </header>

      <section className="cards-section">
        <h2>Điểm đến nổi bật</h2>
        <div className="cards-wrapper">
          {places.map(p => (
            <Link key={p.id} to={`/places/${p.id}`} className="card">
              <img src={p.image_url || "/default-place.jpg"} alt={p.name} />
              <div className="card-info">
                <h3>{p.name}</h3>
                <p>{p.rating.toFixed(1)}/5</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="cards-section">
        <h2>Chuyến đi & Lịch trình</h2>
        <div className="cards-wrapper">
          {tours.map(t => (
            <Link key={t.id} to={`/tours/${t.id}`} className="card">
              <div className="card-info">
                <h3>{t.name}</h3>
                <p>{t.total_cost} USD</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="cards-section">
        <h2>Bài viết mới nhất</h2>
        <div className="cards-wrapper">
          {articles.map(a => (
            <Link key={a.article_id} to={`/articles/${a.article_id}`} className="card">
              <img src={a.image_url || "/default-article.jpg"} alt={a.title} />
              <div className="card-info">
                <h3>{a.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
