import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import ErrorBoundary from "../components/ErrorBoundary.jsx";
import Map from "../components/Map.jsx";
import "../css/HomePage.css";

function HomePage() {
  const [places, setPlaces] = useState([]);
  const [tours, setTours] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [placesRes, toursRes, articlesRes] = await Promise.all([
          axios.get("http://localhost:3000/api/places"),
          axios.get("http://localhost:3000/api/tours"),
          axios.get("http://localhost:3000/api/articles"),
        ]);
        console.log("Places:", placesRes.data); // Kiểm tra dữ liệu
        setPlaces(placesRes.data);
        setTours(toursRes.data);
        setArticles(articlesRes.data);
      } catch (err) {
        console.error("Error:", err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-vh-100 d-flex flex-column bg-light home-container">
      <Header />
      <Navbar activePage="home" />
      <main className="container px-4 py-5 flex-grow-1">
            <section className="mb-5">
              <h2 className="h4 mb-3 fw-bold">Bản đồ địa điểm</h2>
              <div className="card">
                <div className="card-body p-4" style={{ height: "24rem" }}>
                  <ErrorBoundary>
                    <Map
                      locations={places.map((p) => ({
                        id: p.id,
                        name: p.name,
                        lat: p.latitude,
                        lng: p.longitude,
                      }))}
                      className="w-100 h-100"
                    />
                  </ErrorBoundary>
                </div>
              </div>
            </section>
        {loading ? (
          <p className="text-muted text-center">Đang tải dữ liệu...</p>
        ) : error ? (
          <p className="text-danger text-center">{error}</p>
        ) : (
          <>
            <section className="cards-section mb-5">
              <h2 className="h4 mb-3 fw-bold">Điểm đến nổi bật</h2>
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 cards-wrapper">
                {places.length === 0 ? (
                  <p className="text-muted">Không có địa điểm nào để hiển thị.</p>
                ) : (
                  places.map((p) => (
                    <Link
                      key={p.id}
                      to={`/places/${p.id}`}
                      className="card text-decoration-none"
                    >
                      <img
                        src={p.image_url || "/default-place.jpg"}
                        alt={p.name}
                        className="card-img-top"
                      />
                      <div className="card-body card-info">
                        <h3 className="card-title text-primary">{p.name}</h3>
                        <p className="card-text text-muted">
                          {p.description ? `${p.description.substring(0, 100)}...` : "Chưa có mô tả"}
                        </p>
                        <p className="card-text text-muted small">Đánh giá: {p.rating.toFixed(1)}/5</p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </section>
            <section className="cards-section mb-5">
              <h2 className="h4 mb-3 fw-bold">Chuyến đi & Lịch trình</h2>
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 cards-wrapper">
                {tours.length === 0 ? (
                  <p className="text-muted">Không có tour nào để hiển thị.</p>
                ) : (
                  tours.map((t) => (
                    <Link
                      key={t.id}
                      to={`/tours/${t.id}`}
                      className="card text-decoration-none"
                    >
                      <div className="card-body card-info">
                        <h3 className="card-title text-primary">{t.name}</h3>
                        <p className="card-text text-muted">
                          {t.description ? `${t.description.substring(0, 100)}...` : "Chưa có mô tả"}
                        </p>
                        <p className="card-text text-muted small">Chi phí: {t.total_cost} USD</p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </section>

            <section className="cards-section mb-5">
              <h2 className="h4 mb-3 fw-bold">Bài viết mới nhất</h2>
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 cards-wrapper">
                {articles.length === 0 ? (
                  <p className="text-muted">Không có bài viết nào để hiển thị.</p>
                ) : (
                  articles.map((a) => (
                    <Link
                      key={a.article_id}
                      to={`/articles/${a.article_id}`}
                      className="card text-decoration-none"
                    >
                      <img
                        src={a.image_url || "/default-article.jpg"}
                        alt={a.title}
                        className="card-img-top"
                      />
                      <div className="card-body card-info">
                        <h3 className="card-title text-primary">{a.title}</h3>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;