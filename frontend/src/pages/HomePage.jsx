import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import ErrorBoundary from "../components/ErrorBoundary.jsx";
import Map from "../components/Map.jsx";
import ManualPlanner from "../components/ManualPlanner.jsx";
import AutoPlanner from "../components/AutoPlanner.jsx";
import "../css/HomePage.css";
import "../css/luxury-home.css";

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
        setPlaces(placesRes.data);
        setTours(toursRes.data);
        setArticles(articlesRes.data);
      } catch (err) {
        setError("Không thể tải dữ liệu. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-vh-100 d-flex flex-column bg-gradient-to-br from-gray-100 to-white luxury-home-container">
      <Header />
      <Navbar activePage="home" />
      <main className="container px-4 py-5 flex-grow-1">
        <div className="mb-8">
          <h1 className="display-4 fw-bold text-center mb-2 text-dark" style={{letterSpacing: 1}}>WALKING GUIDE</h1>
          <p className="lead text-center text-secondary mb-5">Khám phá, trải nghiệm, và tận hưởng những hành trình tuyệt vời nhất.</p>
        </div>
        <div className="row mb-5 g-4 luxury-planner-row">
          <div className="col-12 col-lg-6">
            <div className="luxury-card luxury-planner-card p-4 mb-4 animate__animated animate__fadeInLeft">
              <ManualPlanner />
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="luxury-card luxury-planner-card p-4 mb-4 animate__animated animate__fadeInRight">
              <AutoPlanner />
            </div>
          </div>
        </div>
        <section className="mb-6">
          <h2 className="h4 mb-3 fw-bold luxury-section-title">Bản đồ địa điểm</h2>
          <div className="card shadow-lg border-0 rounded-4">
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
        <hr className="my-5 luxury-divider" />
        {loading ? (
          <p className="text-muted text-center">Đang tải dữ liệu...</p>
        ) : error ? (
          <p className="text-danger text-center">{error}</p>
        ) : (
          <>
            <section className="cards-section mb-6">
              <h2 className="h4 mb-4 fw-bold luxury-section-title">Điểm đến nổi bật</h2>
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-5">
                {places.map((p) => (
                  <div className="col" key={p.id}>
                    <div className="card h-100 shadow border-0 rounded-4 luxury-card">
                      <Link
                        to={`/places/${p.id}`}
                        className="text-decoration-none"
                      >
                        <img
                          src={p.image_url || "/default-place.jpg"}
                          alt={p.name}
                          className="card-img-top luxury-img-top"
                          style={{height: 220, objectFit: 'cover', borderTopLeftRadius: '1.5rem', borderTopRightRadius: '1.5rem'}}
                        />
                        <div className="card-body luxury-card-body">
                          <h3 className="card-title text-primary mb-2" style={{fontWeight: 600}}>{p.name}</h3>
                          <p className="card-text text-muted mb-2 luxury-desc">
                            {p.description
                              ? `${p.description.substring(0, 100)}...`
                              : "Chưa có mô tả"}
                          </p>
                          <p className="card-text text-muted small mb-0 luxury-rating">
                            <span className="luxury-star">★</span> {p.rating.toFixed(1)}/5
                          </p>
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <hr className="my-5 luxury-divider" />
            <section className="cards-section mb-6">
              <h2 className="h4 mb-4 fw-bold luxury-section-title">Chuyến đi & Lịch trình</h2>
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-5">
                {tours.length === 0 ? (
                  <p className="text-muted">Không có tour nào để hiển thị.</p>
                ) : (
                  tours.map((t) => (
                    <div className="col" key={t.id}>
                      <div className="card h-100 shadow border-0 rounded-4 luxury-card">
                        <Link
                          to={`/tours/${t.id}`}
                          className="text-decoration-none"
                        >
                          <div className="card-body luxury-card-body">
                            <h3 className="card-title text-primary mb-2" style={{fontWeight: 600}}>{t.name}</h3>
                            <p className="card-text text-muted mb-2 luxury-desc">
                              {t.description
                                ? `${t.description.substring(0, 100)}...`
                                : "Chưa có mô tả"}
                            </p>
                            <p className="card-text text-muted small mb-0 luxury-rating">
                              <span className="luxury-money">💰</span> {t.total_cost} VND
                            </p>
                          </div>
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
            <hr className="my-5 luxury-divider" />
            <section className="cards-section mb-6">
              <h2 className="h4 mb-4 fw-bold luxury-section-title">Bài viết mới nhất</h2>
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-5">
                {articles.length === 0 ? (
                  <p className="text-muted">Không có bài viết nào để hiển thị.</p>
                ) : (
                  articles.map((a) => (
                    <div className="col" key={a.article_id}>
                      <div className="card h-100 shadow border-0 rounded-4 luxury-card">
                        <Link
                          to={`/articles/${a.article_id}`}
                          className="text-decoration-none"
                        >
                          {a.image_url ? (
                            <img
                              src={
                                a.image_url.startsWith("http")
                                  ? a.image_url
                                  : `http://localhost:3000${a.image_url}`
                              }
                              alt="Ảnh"
                              className="card-img-top luxury-img-top"
                              style={{height: 220, objectFit: 'cover', borderTopLeftRadius: '1.5rem', borderTopRightRadius: '1.5rem'}}
                            />
                          ) : (
                            ""
                          )}
                          <div className="card-body luxury-card-body">
                            <h3 className="card-title text-primary mb-2" style={{fontWeight: 600}}>{a.title}</h3>
                            <p className="card-text text-muted mb-2 luxury-desc">
                              {a.content
                                ? `${a.content.substring(0, 100)}...`
                                : "Chưa có nội dung"}
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