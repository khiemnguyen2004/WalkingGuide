import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import ErrorBoundary from "../components/ErrorBoundary.jsx";
import Map from "../components/Map.jsx";
import ManualPlanner from "../components/ManualPlanner.jsx";
import AutoPlanner from "../components/AutoPlanner.jsx";
import PlaceDetailMap from "../components/PlaceDetailMap";
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
  const [showPlaceDetailMap, setShowPlaceDetailMap] = useState(false);
  const [placeForDetailMap, setPlaceForDetailMap] = useState(null);
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

  // Sort places by updated_at descending to show recently updated places first
  const sortedPlaces = Array.isArray(places)
    ? [...places].sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0))
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

  // Handler for the special link
  const handleExploreMapClick = (e) => {
    e.preventDefault();
    setPlaceForDetailMap(null); // Show map with no specific place
    setShowPlaceDetailMap(true);
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-gradient-to-br from-gray-100 to-white luxury-home-container">
      <Header />
      <main className="container px-4 py-4 flex-grow-1">
        <div className="container">
          <div className="bg-planner-map" id="planner-section">
            {/* Hero Section with shared background */}
            <section className="hero-with-bg">
              <h1>Khám phá & Lên Kế Hoạch Du Lịch Thông Minh</h1>
              <p>Tìm kiếm địa điểm, tạo lộ trình cá nhân hoặc để chúng tôi gợi ý chuyến đi hoàn hảo cho bạn!</p>
              <a href="#planner-section" className="btn btn-main">Bắt đầu lên kế hoạch</a>
            </section>
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
                <a href="#" onClick={handleExploreMapClick} className="arrow-link ms-2" style={{textDecoration: 'none'}}>
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
                        image_url: selectedPlace.image_url,
                      }] : places.map((p) => ({
                        id: p.id,
                        name: p.name,
                        lat: p.latitude,
                        lng: p.longitude,
                        image_url: p.image_url,
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
              <h2 className="h4 mb-4 fw-bold luxury-section-title">
                Điểm đến nổi bật
              </h2>
              {/* Bootstrap Carousel for all places, 3 per slide */}
              {sortedPlaces.length === 0 ? (
                <p className="text-muted text-center">Không có địa điểm nào để hiển thị.</p>
              ) : (
                <div id="placesCarousel" className="carousel slide" data-bs-ride="carousel">
                  <div className="carousel-inner">
                    {chunkArray(sortedPlaces, 3).map((group, idx) => (
                      <div className={`carousel-item${idx === 0 ? ' active' : ''}`} key={group.map(p => p.id || p._id || p.name).join('-')}>
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-5 justify-content-center">
                          {group.map((p) => (
                            <div className="col" key={p.id || p._id || p.name}>
                              <div className="card h-100 shadow border-0 rounded-4 luxury-card">
                                <Link to={`/places/${p.id || p._id}`} className="text-decoration-none">
                                  <img
                                    src={p.image_url ? (p.image_url.startsWith("http") ? p.image_url : `http://localhost:3000${p.image_url}`) : "/default-place.jpg"}
                                    alt={p.name}
                                    className="card-img-top luxury-img-top"
                                    style={{
                                      height: 220,
                                      objectFit: "cover",
                                      borderTopLeftRadius: "1.5rem",
                                      borderTopRightRadius: "1.5rem",
                                    }}
                                    onError={(e) => {
                                      e.target.src = "/default-place.jpg";
                                    }}
                                  />
                                  <div className="card-body luxury-card-body">
                                    <h3 className="card-title mb-2" style={{ fontWeight: 600 }}>{p.name}</h3>
                                    {p.city && (
                                      <p className="card-text text-primary mb-1 small">
                                        <i className="bi bi-geo-alt-fill me-1"></i>
                                        {p.city}
                                      </p>
                                    )}
                                    <p className="card-text text-muted mb-2 luxury-desc">
                                      {p.description
                                        ? `${p.description.replace(/<[^>]+>/g, '').substring(0, 100)}...`
                                        : "Chưa có mô tả"}
                                    </p>
                                    {p.service && (
                                      <p className="card-text text-muted mb-2 small">
                                        <i className="bi bi-activity me-1"></i>
                                        {p.service.length > 80 ? `${p.service.substring(0, 80)}...` : p.service}
                                      </p>
                                    )}
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
                  {sortedPlaces.length > 3 && (
                    <>
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
                    </>
                  )}
                </div>
              )}
            </section>
            <hr className="my-5 luxury-divider" />
            <section className="cards-section mb-6">
              <h2 className="h4 mb-4 fw-bold luxury-section-title">
                Chuyến đi & Lịch trình
              </h2>
              {/* Bootstrap Carousel for all tours, 3 per slide */}
                {tours.length === 0 ? (
                  <p className="text-muted">Không có tour nào để hiển thị.</p>
                ) : (
                <div id="toursCarousel" className="carousel slide" data-bs-ride="carousel">
                  <div className="carousel-inner">
                    {chunkArray(tours, 3).map((group, idx) => (
                      <div className={`carousel-item${idx === 0 ? ' active' : ''}`} key={group.map(t => t.id).join('-')}>
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-5 justify-content-center">
                          {group.map((t) => (
                    <div className="col" key={t.id}>
                      <div className="card h-100 shadow border-0 rounded-4 luxury-card">
                                <Link to={`/tours/${t.id}`} className="text-decoration-none">
                                  {t.image_url ? (
                                    <img
                                      src={t.image_url.startsWith("http") ? t.image_url : `http://localhost:3000${t.image_url}`}
                                      alt={t.name}
                                      className="card-img-top luxury-img-top"
                                      style={{ height: 220, objectFit: "cover", borderTopLeftRadius: "1.5rem", borderTopRightRadius: "1.5rem" }}
                                      onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                  ) : (
                                    <div 
                                      className="card-img-top luxury-img-top d-flex align-items-center justify-content-center"
                                      style={{ height: 220, borderTopLeftRadius: "1.5rem", borderTopRightRadius: "1.5rem", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", fontSize: "3rem" }}
                                    >
                                      <i className="bi bi-map"></i>
                                    </div>
                                  )}
                          <div className="card-body luxury-card-body">
                                    <h3 className="card-title mb-2" style={{ fontWeight: 600 }}>{t.name}</h3>
                                    {t.description && (
                            <p className="card-text text-muted mb-2 luxury-desc">
                                        {`${t.description.replace(/<[^>]+>/g, '').substring(0, 100)}...`}
                            </p>
                                    )}
                                    {t.total_cost && (
                            <p className="card-text text-muted small mb-0 luxury-rating">
                                        <span className="luxury-money">💰</span> {t.total_cost} VND
                            </p>
                                    )}
                          </div>
                        </Link>
                      </div>
                    </div>
                          ))}
                        </div>
                      </div>
                    ))}
              </div>
                  {/* Always show controls for consistency */}
                  <button className="carousel-control-prev" type="button" data-bs-target="#toursCarousel" data-bs-slide="prev"
                    style={{ width: '5rem', height: '5rem', top: '50%', left: '-4rem', transform: 'translateY(-50%)', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="carousel-control-prev-icon" aria-hidden="true" style={{ width: '2.5rem', height: '2.5rem' }}></span>
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button className="carousel-control-next" type="button" data-bs-target="#toursCarousel" data-bs-slide="next"
                    style={{ width: '5rem', height: '5rem', top: '50%', right: '-4rem', left: 'auto', transform: 'translateY(-50%)', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="carousel-control-next-icon" aria-hidden="true" style={{ width: '2.5rem', height: '2.5rem' }}></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </div>
              )}
            </section>
            {/* Fast Plan Banner Section with Winding Route and Random Places */}
            <section className="autoplanner-banner-section my-5 py-5 text-center rounded-4 shadow-lg" style={{
              background: `url('/src/images/banner2.jpg') center/cover no-repeat`,
              position: 'relative',
              boxShadow: '0 8px 32px 0 rgba(125, 127, 167, 0.13)'
            }}>
              <div style={{position: 'absolute', inset: 0, background: 'rgba(23, 22, 22, 0.25)', borderRadius: '1.5rem', zIndex: 1}}></div>
              <div className="container py-4" style={{position: 'relative', zIndex: 2}}>
                <h2 className="display-6 fw-bold mb-4" style={{color: '#fff'}}>
                  Lên kế hoạch nhanh với <span style={{color: '#fff'}}>AutoPlanner</span>
                </h2>
                {/* Winding route line with random places */}
                <div className="route-banner position-relative mb-4" style={{minHeight: 140, width: '100%', maxWidth: 900, margin: '0 auto'}}>
                  {/* SVG winding path */}
                  <svg width="100%" height="100" viewBox="0 0 900 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{position: 'absolute', top: 30, left: 0, zIndex: 1}}>
                    <defs>
                      <linearGradient id="routeGradient" x1="0" y1="0" x2="900" y2="0" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#5b9df9" />
                        <stop offset="1" stopColor="#b6e0fe" />
                      </linearGradient>
                    </defs>
                    <path d="M 40 50 Q 180 10, 320 50 T 600 50 T 860 50" stroke="url(#routeGradient)" strokeWidth="6" fill="none" strokeLinecap="round"/>
                  </svg>
                  {/* Place stops positioned along the path */}
                  {(() => {
                    const shuffled = [...sortedPlaces].sort(() => 0.5 - Math.random());
                    const picks = shuffled.slice(0, Math.min(5, shuffled.length));
                    // Predefined positions for 5 stops along the SVG path
                    const stopPositions = [40, 220, 450, 680, 860];
                    return picks.map((place, idx) => (
                      <Link to={`/places/${place.id}`} key={place.id} className="route-stop d-flex flex-column align-items-center position-absolute text-decoration-none route-stop-link" style={{zIndex: 2, left: `calc(${stopPositions[idx] / 9}% - 32px)`, top: idx % 2 === 0 ? 0 : 60, minWidth: 80, cursor: 'pointer'}}>
                        <div className="route-img-wrapper mb-2 shadow-lg rounded-circle bg-white d-flex align-items-center justify-content-center" style={{width: 64, height: 64, overflow: 'hidden', border: '3px solid #fff', transition: 'box-shadow 0.2s, border-color 0.2s'}}>
                          {place.image_url ? (
                            <img src={place.image_url.startsWith('http') ? place.image_url : `http://localhost:3000${place.image_url}`} alt={place.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                          ) : (
                            <i className="bi bi-geo-alt-fill" style={{fontSize: 36, color: '#fff'}}></i>
                          )}
                        </div>
                        <span className="fw-semibold small" style={{color: '#fff', maxWidth: 80, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{place.name}</span>
                      </Link>
                    ));
                  })()}
                </div>
                <p className="lead mb-3" style={{color: '#fff', fontWeight: 500}}>
                  Hành trình của bạn sẽ được tối ưu chỉ với một cú nhấp chuột!
                </p>
                <a href="#planner-section" className="btn btn-main btn-lg mt-2 px-4 py-2" style={{fontSize: '1.2rem'}}>Bắt đầu với AutoPlanner</a>
              </div>
            </section>
            <hr className="my-5 luxury-divider" />
            <section className="cards-section mb-6">
              <h2 className="h4 mb-4 fw-bold luxury-section-title">
                Hãy tham khảo những chia sẻ thú vị từ các du khách
              </h2>
              {/* Bootstrap Carousel for all articles, 3 per slide */}
                {articles.length === 0 ? (
                  <p className="text-muted">Không có bài viết nào để hiển thị.</p>
                ) : (
                <div id="articlesCarousel" className="carousel slide" data-bs-ride="carousel">
                  <div className="carousel-inner">
                    {chunkArray(articles, 3).map((group, idx) => (
                      <div className={`carousel-item${idx === 0 ? ' active' : ''}`} key={group.map(a => a.article_id).join('-')}>
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-5 justify-content-center">
                          {group.map((a) => (
                    <div className="col" key={a.article_id}>
                      <div className="card h-100 shadow border-0 rounded-4 luxury-card">
                                <Link to={`/articles/${a.article_id}`} className="text-decoration-none">
                                  {a.image_url && (
                            <img
                                      src={a.image_url.startsWith("http") ? a.image_url : `http://localhost:3000${a.image_url}`}
                              alt="Ảnh"
                              className="card-img-top luxury-img-top"
                                      style={{ height: 220, objectFit: "cover", borderTopLeftRadius: "1.5rem", borderTopRightRadius: "1.5rem" }}
                            />
                          )}
                          <div className="card-body luxury-card-body">
                                    <h3 className="card-title mb-2" style={{ fontWeight: 600 }}>{a.title}</h3>
                                    {a.content && (
                            <p className="card-text text-muted mb-2 luxury-desc">
                                        {`${a.content.replace(/<[^>]+>/g, '').substring(0, 100)}...`}
                            </p>
                                    )}
                          </div>
                        </Link>
                      </div>
                    </div>
                          ))}
                        </div>
                      </div>
                    ))}
              </div>
                  {/* Always show controls for consistency */}
                  <button className="carousel-control-prev" type="button" data-bs-target="#articlesCarousel" data-bs-slide="prev"
                    style={{ width: '5rem', height: '5rem', top: '50%', left: '-4rem', transform: 'translateY(-50%)', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="carousel-control-prev-icon" aria-hidden="true" style={{ width: '2.5rem', height: '2.5rem' }}></span>
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button className="carousel-control-next" type="button" data-bs-target="#articlesCarousel" data-bs-slide="next"
                    style={{ width: '5rem', height: '5rem', top: '50%', right: '-4rem', left: 'auto', transform: 'translateY(-50%)', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="carousel-control-next-icon" aria-hidden="true" style={{ width: '2.5rem', height: '2.5rem' }}></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </div>
              )}
            </section>
          </>
        )}
      </main>
      <Footer />
      {showPlaceDetailMap && (
        <div style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 2000, background: 'rgba(0,0,0,0.15)'}}>
          <PlaceDetailMap place={placeForDetailMap} onClose={() => setShowPlaceDetailMap(false)} />
        </div>
      )}
    </div>
  );
}

export default HomePage;