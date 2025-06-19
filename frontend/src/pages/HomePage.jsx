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
  const [showManual, setShowManual] = useState(false);
  const [showAuto, setShowAuto] = useState(false);

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

  const onlyOneOpen = showManual || showAuto;

  return (
    <div className="min-vh-100 d-flex flex-column bg-gradient-to-br from-gray-100 to-white luxury-home-container">
      <Header />
      <Navbar activePage="home" />
      <main className="container px-4 py-4 flex-grow-1">
        <div className="bg-planner-map">
          <div className={`row mb-5 g-4 luxury-planner-row${onlyOneOpen ? ' justify-content-center' : ''}`}> 
            <div className={`col-12 ${onlyOneOpen ? 'col-lg-10' : 'col-lg-6'}`} style={{ display: showManual || !onlyOneOpen ? 'block' : 'none' }}>
              <div className={`luxury-card luxury-planner-card p-4 mb-4 d-flex flex-column h-100 justify-content-center align-items-stretch${showManual && onlyOneOpen ? ' full-width' : ''}`}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h2 className="h5 fw-bold mb-0">Tự tạo lộ trình</h2>
                  <button className="btn btn-link p-0" onClick={() => { setShowManual(v => !v); if (!showManual) setShowAuto(false); }} aria-label="Toggle Manual Planner">
                    <i className={`bi ${showManual ? "bi-chevron-up" : "bi-chevron-down"}`} style={{fontSize: 22}}></i>
                  </button>
                </div>
                <p className="text-center text-muted mb-3">Bạn muốn tự lên kế hoạch chuyến đi? Hãy sử dụng chế độ <b>thủ công</b> để tự tạo tour theo ý thích của mình.</p>
                {showManual && <ManualPlanner />}
              </div>
            </div>
            <div className={`col-12 ${onlyOneOpen ? 'col-lg-10' : 'col-lg-6'}`} style={{ display: showAuto || !onlyOneOpen ? 'block' : 'none' }}>
              <div className={`luxury-card luxury-planner-card p-4 mb-4 d-flex flex-column h-100 justify-content-center align-items-stretch${showAuto && onlyOneOpen ? ' full-width' : ''}`}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h2 className="h5 fw-bold mb-0">Tạo lộ trình tự động</h2>
                  <button className="btn btn-link p-0" onClick={() => { setShowAuto(v => !v); if (!showAuto) setShowManual(false); }} aria-label="Toggle Auto Planner">
                    <i className={`bi ${showAuto ? "bi-chevron-up" : "bi-chevron-down"}`} style={{fontSize: 22}}></i>
                  </button>
                </div>
                <p className="text-center text-muted mb-3">Bạn muốn chúng tôi tạo lộ trình phù hợp? Hãy thử chế độ <b>tự động</b> để chúng tôi đề xuất tour cho bạn!</p>
                {showAuto && <AutoPlanner />}
              </div>
            </div>
          </div>
          <section className="mb-6">
            <h2 className="h4 mb-3 fw-bold luxury-section-title">
              Bạn chưa có dự định? Hãy cùng khám phá bản đồ du lịch!{' '}
              <a href="#map-section" className="arrow-link ms-2" style={{textDecoration: 'none'}}>
                <i className="bi bi-arrow-right" style={{fontSize: 24, verticalAlign: 'middle'}}></i>
              </a>
            </h2>
            <div id="map-section" className="card shadow-lg border-0 rounded-4">
              <div className="card-body" style={{ height: "24rem" }}>
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
        </div>
        {/* <hr className="my-5 luxury-divider" /> */}
        {loading ? (
          <p className="text-muted text-center">Đang tải dữ liệu...</p>
        ) : error ? (
          <p className="text-danger text-center">{error}</p>
        ) : (
          <>
            <section className="cards-section mb-6">
              <h2 className="h4 mb-4 fw-bold luxury-section-title">
                Điểm đến nổi bật
              </h2>
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
                          style={{
                            height: 220,
                            objectFit: "cover",
                            borderTopLeftRadius: "1.5rem",
                            borderTopRightRadius: "1.5rem",
                          }}
                        />
                        <div className="card-body luxury-card-body">
                          <h3
                            className="card-title text-primary mb-2"
                            style={{ fontWeight: 600 }}
                          >
                            {p.name}
                          </h3>
                          <p className="card-text text-muted mb-2 luxury-desc">
                            {p.description
                              ? `${p.description.substring(0, 100)}...`
                              : "Chưa có mô tả"}
                          </p>
                          <p className="card-text text-muted small mb-0 luxury-rating">
                            <span className="luxury-star">★</span>{" "}
                            {p.rating.toFixed(1)}/5
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
              <h2 className="h4 mb-4 fw-bold luxury-section-title">
                Chuyến đi & Lịch trình
              </h2>
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
                            <h3
                              className="card-title text-primary mb-2"
                              style={{ fontWeight: 600 }}
                            >
                              {t.name}
                            </h3>
                            <p className="card-text text-muted mb-2 luxury-desc">
                              {t.description
                                ? `${t.description.substring(0, 100)}...`
                                : "Chưa có mô tả"}
                            </p>
                            <p className="card-text text-muted small mb-0 luxury-rating">
                              <span className="luxury-money">💰</span> {t.total_cost}{" "}
                              VND
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
              <h2 className="h4 mb-4 fw-bold luxury-section-title">
                Bài viết mới nhất
              </h2>
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
                              style={{
                                height: 220,
                                objectFit: "cover",
                                borderTopLeftRadius: "1.5rem",
                                borderTopRightRadius: "1.5rem",
                              }}
                            />
                          ) : (
                            ""
                          )}
                          <div className="card-body luxury-card-body">
                            <h3
                              className="card-title text-primary mb-2"
                              style={{ fontWeight: 600 }}
                            >
                              {a.title}
                            </h3>
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