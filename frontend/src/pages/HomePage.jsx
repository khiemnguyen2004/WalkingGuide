import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import ErrorBoundary from "../components/ErrorBoundary.jsx";
import Map from "../components/Map.jsx";
import ManualPlanner from "../components/ManualPlanner.jsx";
import AutoPlanner from "../components/AutoPlanner.jsx";
import "../css/HomePage.css";
import "../css/luxury-home.css";

// Helper to chunk array into groups of 3
function chunkArray(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

function HomePage() {
  const [places, setPlaces] = useState([]);
  const [tours, setTours] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showManual, setShowManual] = useState(false);
  const [showAuto, setShowAuto] = useState(false);
  const [placeQuery, setPlaceQuery] = useState("");
  const [placeSuggestions, setPlaceSuggestions] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const mapRef = useRef();

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

  // Sort places by createdAt descending if not already sorted (assume createdAt exists)
  const sortedPlaces = Array.isArray(places)
    ? [...places].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    : [];

  // Extract unique cities from places
  const cities = Array.from(new Set(places.map(p => p.city).filter(Boolean)));

  // Handle search input for places
  const handlePlaceInput = (e) => {
    const value = e.target.value;
    setPlaceQuery(value);
    setPlaceSuggestions(
      value
        ? places.filter(place => place.name.toLowerCase().includes(value.toLowerCase()))
        : []
    );
    setHighlightedIndex(-1);
  };

  // Handle place selection
  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
    setPlaceQuery(place.name);
    setPlaceSuggestions([]);
    setHighlightedIndex(-1);
  };

  // Keyboard navigation for suggestions
  const handlePlaceKeyDown = (e) => {
    if (placeSuggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      setHighlightedIndex((prev) => (prev + 1) % placeSuggestions.length);
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prev) => (prev - 1 + placeSuggestions.length) % placeSuggestions.length);
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      handlePlaceSelect(placeSuggestions[highlightedIndex]);
    }
  };

  // Clear search
  const clearSearch = () => {
    setPlaceQuery("");
    setPlaceSuggestions([]);
    setSelectedPlace(null);
    setHighlightedIndex(-1);
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-gradient-to-br from-gray-100 to-white luxury-home-container">
      <Header />
      <main className="container px-4 py-4 flex-grow-1">
        <div className="container">
          <div className="bg-planner-map">
          <div className={`row mb-5 g-4 luxury-planner-row${onlyOneOpen ? ' justify-content-center' : ''}`}> 
            <div className={`col-12 ${onlyOneOpen ? 'col-lg-10' : 'col-lg-6'}`} style={{ display: showManual || !onlyOneOpen ? 'block' : 'none' }}>
              <div className={`luxury-card luxury-planner-card manual-homepage p-4 mb-4 d-flex flex-column h-100 justify-content-center align-items-stretch${showManual && onlyOneOpen ? ' full-width' : ''}`}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <h2 className="h5 fw-bold mb-0">Tự tạo lộ trình</h2>
                    <i className="bi bi-car-front" style={{fontSize: 20, marginLeft: 6, color: '#1a2a47'}} aria-label="manual icon"></i>
                  </div>
                  <button className="btn btn-link p-0" onClick={() => { setShowManual(v => !v); if (!showManual) setShowAuto(false); }} aria-label="Toggle Manual Planner">
                    <i className={`bi ${showManual ? "bi-chevron-up" : "bi-chevron-down"}`} style={{fontSize: 22}}></i>
                  </button>
                </div>
                <p className="text-center text-muted mb-3">Bạn muốn tự lên kế hoạch chuyến đi? Hãy sử dụng chế độ <b>thủ công</b> để tự tạo tour theo ý thích của mình.</p>
                {showManual && <ManualPlanner noLayout />}
              </div>
            </div>
            <div className={`col-12 ${onlyOneOpen ? 'col-lg-10' : 'col-lg-6'}`} style={{ display: showAuto || !onlyOneOpen ? 'block' : 'none' }}>
              <div className={`luxury-card luxury-planner-card p-4 mb-4 d-flex flex-column h-100 justify-content-center align-items-stretch${showAuto && onlyOneOpen ? ' full-width' : ''}`}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <h2 className="h5 fw-bold mb-0">Tạo lộ trình tự động</h2>
                    <i className="bi bi-robot" style={{fontSize: 20, marginLeft: 6, color: '#1a2a47'}} aria-label="autopilot icon"></i>
                  </div>
                  <button className="btn btn-link p-0" onClick={() => { setShowAuto(v => !v); if (!showAuto) setShowManual(false); }} aria-label="Toggle Auto Planner">
                    <i className={`bi ${showAuto ? "bi-chevron-up" : "bi-chevron-down"}`} style={{fontSize: 22}}></i>
                  </button>
                </div>
                <p className="text-center text-muted mb-3">Bạn muốn chúng tôi tạo lộ trình phù hợp? Hãy thử chế độ <b>tự động</b> để chúng tôi đề xuất tour cho bạn!</p>
                {showAuto && <AutoPlanner noLayout />}
              </div>
            </div>
            <section className="mb-6">
            <h2 className="h4 mb-3 fw-bold text-center text-light">
              Bạn chưa có dự định? Hãy cùng khám phá bản đồ du lịch!{' '}
              <a href="#map-section" className="arrow-link ms-2" style={{textDecoration: 'none'}}>
                <i className="bi bi-arrow-right" style={{fontSize: 24, verticalAlign: 'middle', color: '#fff'}}></i>
              </a>
            </h2>
            {/* Search bar for place */}
            <div className="mb-3 position-relative" style={{maxWidth: 400, margin: '0 auto'}}>
              <div className="input-group shadow rounded-pill">
                <span className="input-group-text bg-white border-0 rounded-start-pill" style={{paddingRight: 0}}>
                  <i className="bi bi-search text-primary" style={{fontSize: 20}}></i>
                </span>
                <input
                  type="text"
                  className="form-control border-0 rounded-end-pill"
                  placeholder="Tìm địa điểm..."
                  value={placeQuery}
                  onChange={handlePlaceInput}
                  onKeyDown={handlePlaceKeyDown}
                  style={{boxShadow: 'none', background: 'white'}}
                />
                {placeQuery && (
                  <button className="btn btn-link px-2" style={{color: '#fff'}} onClick={clearSearch} tabIndex={-1}>
                    <i className="bi bi-x-circle" style={{fontSize: 20}}></i>
                  </button>
                )}
              </div>
              {placeSuggestions.length > 0 && (
                <ul className="list-group position-absolute shadow-lg rounded-4 mt-1" style={{zIndex: 10, width: '100%', overflow: 'hidden'}}>
                  {placeSuggestions.map((place, idx) => (
                    <li
                      key={place.id}
                      className={`list-group-item list-group-item-action d-flex align-items-center gap-2 py-2 px-3 border-0 ${idx === highlightedIndex ? 'bg-primary text-white' : ''}`}
                      onClick={() => handlePlaceSelect(place)}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      style={{cursor: 'pointer', fontWeight: 500, fontSize: '1rem', borderBottom: idx !== placeSuggestions.length - 1 ? '1px solid #f1f3f4' : 'none', background: idx === highlightedIndex ? '#3498db' : 'white'}}
                    >
                      <i className="bi bi-geo-alt-fill text-primary" style={{fontSize: 18, color: idx === highlightedIndex ? 'white' : '#3498db'}}></i>
                      <span>{place.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div id="map-section" className="card shadow-lg border-0 rounded-4">
              <div className="card-body" style={{ height: "24rem" }}>
                <ErrorBoundary>
                  <Map
                    ref={mapRef}
                    locations={selectedPlace ? [{
                      id: selectedPlace.id,
                      name: selectedPlace.name,
                      lat: selectedPlace.latitude,
                      lng: selectedPlace.longitude,
                    }] : places.map((p) => ({
                      id: p.id,
                      name: p.name,
                      lat: p.latitude,
                      lng: p.longitude,
                    }))}
                    className="w-100 h-100"
                    selectedPlace={selectedPlace}
                  />
                </ErrorBoundary>
              </div>
            </div>
          </section>
          </div>
        </div>
        
        </div>
        {/* <hr className="my-5 luxury-divider" /> */}
        {loading ? (
          <p className="text-muted text-center">Đang tải dữ liệu...</p>
        ) : error ? (
          <p className="text-danger text-center">{error}</p>
        ) : (
          <>
            <section className="cards-section mb-6">
              {/* <h2 className="h4 mb-4 fw-bold luxury-section-title">
                Điểm đến nổi bật
              </h2>
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-5">
                {sortedPlaces.slice(0, 3).map((p) => (
                  <div className="col" key={p.id || p._id || p.name}>
                    <div className="card h-100 shadow border-0 rounded-4 luxury-card">
                      <Link
                        to={`/places/${p.id || p._id}`}
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
                            className="card-title mb-2"
                            style={{ fontWeight: 600 }}
                          >
                            {p.name}
                          </h3>
                          <p className="card-text text-muted mb-2 luxury-desc">
                            {p.description
                              ? `${p.description.replace(/<[^>]+>/g, '').substring(0, 100)}...`
                              : "Chưa có mô tả"}
                          </p>
                          <p className="card-text text-muted small mb-0 luxury-rating">
                            <span className="luxury-star">★</span>{" "}
                            {p.rating?.toFixed ? p.rating.toFixed(1) : p.rating}/5
                          </p>
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
              </div> */}
              {/* Bootstrap Carousel for remaining places, 3 per slide */}
              {sortedPlaces.length > 3 && (
                <div id="placesCarousel" className="carousel slide mt-5" data-bs-ride="carousel">
                  <div className="carousel-inner">
                    {chunkArray(sortedPlaces.slice(3), 3).map((group, idx) => (
                      <div className={`carousel-item${idx === 0 ? ' active' : ''}`} key={group.map(p => p.id || p._id || p.name).join('-')}>
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-5 justify-content-center">
                          {group.map((p) => (
                            <div className="col" key={p.id || p._id || p.name}>
                              <div className="card h-100 shadow border-0 rounded-4 luxury-card">
                                <Link to={`/places/${p.id || p._id}`} className="text-decoration-none">
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
                                    <h3 className="card-title mb-2" style={{ fontWeight: 600 }}>{p.name}</h3>
                                    <p className="card-text text-muted mb-2 luxury-desc">
                                      {p.description
                                        ? `${p.description.replace(/<[^>]+>/g, '').substring(0, 100)}...`
                                        : "Chưa có mô tả"}
                                    </p>
                                    <p className="card-text text-muted small mb-0 luxury-rating">
                                      <span className="luxury-star">★</span>{" "}
                                      {p.rating?.toFixed ? p.rating.toFixed(1) : p.rating}/5
                                    </p>
                                  </div>
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="carousel-control-prev" type="button" data-bs-target="#placesCarousel" data-bs-slide="prev"
                    style={{ width: '5rem', height: '5rem', top: '50%', left: '-4rem', transform: 'translateY(-50%)', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="carousel-control-prev-icon" aria-hidden="true" style={{ width: '2.5rem', height: '2.5rem' }}></span>
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button className="carousel-control-next" type="button" data-bs-target="#placesCarousel" data-bs-slide="next"
                    style={{ width: '5rem', height: '5rem', top: '50%', right: '-4rem', left: 'auto', transform: 'translateY(-50%)', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="carousel-control-next-icon" aria-hidden="true" style={{ width: '2.5rem', height: '2.5rem' }}></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </div>
              )}
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
                              className="card-title mb-2"
                              style={{ fontWeight: 600 }}
                            >
                              {t.name}
                            </h3>
                            <p className="card-text text-muted mb-2 luxury-desc">
                              {t.description
                                ? `${t.description.replace(/<[^>]+>/g, '').substring(0, 100)}...`
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
                              className="card-title mb-2"
                              style={{ fontWeight: 600 }}
                            >
                              {a.title}
                            </h3>
                            <p className="card-text text-muted mb-2 luxury-desc">
                              {a.content
                                ? `${a.content.replace(/<[^>]+>/g, '').substring(0, 100)}...`
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