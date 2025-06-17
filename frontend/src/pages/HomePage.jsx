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
        console.log("Places:", placesRes.data);
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
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {places.map((p) => (
                  <div className="col" key={p.id}>
                    <div className="card h-100">
                      <Link to={`/places/${p.id}`} className="text-decoration-none">
                        <img
                          src={p.image_url || "/default-place.jpg"}
                          alt={p.name}
                          className="card-img-top"
                        />
                        <div className="card-body">
                          <h3 className="card-title text-primary">{p.name}</h3>
                          <p className="card-text text-muted">
                            {p.description ? `${p.description.substring(0, 100)}...` : "Chưa có mô tả"}
                          </p>
                          <p className="card-text text-muted small">Đánh giá: {p.rating.toFixed(1)}/5</p>
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <section className="cards-section mb-5">
              <h2 className="h4 mb-3 fw-bold">Chuyến đi & Lịch trình</h2>
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {tours.length === 0 ? (
                  <p className="text-muted">Không có tour nào để hiển thị.</p>
                ) : (
                  tours.map((t) => (
                    <div className="col" key={t.id}>
                      <div className="card h-100">
                        <Link to={`/tours/${t.id}`} className="text-decoration-none">
                          <div className="card-body card-info">
                            <h3 className="card-title text-primary">{t.name}</h3>
                            <p className="card-text text-muted">
                              {t.description ? `${t.description.substring(0, 100)}...` : "Chưa có mô tả"}
                            </p>
                            <p className="card-text text-muted small">Chi phí: {t.total_cost} USD</p>
                          </div>
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="cards-section mb-5">
              <h2 className="h4 mb-3 fw-bold">Bài viết mới nhất</h2>
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {articles.length === 0 ? (
                  <p className="text-muted">Không có bài viết nào để hiển thị.</p>
                ) : (
                  articles.map((a) => (
                    <div className="col" key={a.article_id}>
                      <div className="card h-100">
                        <Link to={`/articles/${a.article_id}`} className="text-decoration-none">
                          {a.image_url ? (
                            <img
                              src={a.image_url.startsWith('http') ? a.image_url : `http://localhost:3000${a.image_url}`}
                              alt="Ảnh"
                              className="card-img-top"
                            />
                          ) : ""}
                          <div className="card-body card-info">
                            <h3 className="card-title text-primary">{a.title}</h3>
                            <p className="card-text text-muted">
                            {a.content ? `${a.content.substring(0, 100)}...` : "Chưa có nội dung"}
                          </p>
                          </div>
                        </Link>
                      </div>
                    </div>
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