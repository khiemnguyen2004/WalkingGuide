import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header.jsx';
import Footer from '../../components/Footer.jsx';
import tourApi from '../../api/tourApi';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { FaClock, FaMapMarkerAlt } from 'react-icons/fa';

const createCustomIcon = (place) => {
  const iconSize = 40;
  const iconAnchor = iconSize / 2;
  if (place.image_url) {
    const imageUrl = place.image_url.startsWith('http') ? place.image_url : `http://localhost:3000${place.image_url}`;
    return new L.DivIcon({
      className: 'custom-marker',
      html: `
        <div style="
          width: ${iconSize}px;
          height: ${iconSize}px;
          border-radius: 50%;
          border: 2px solid #3498db;
          overflow: hidden;
          background: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <img 
            src="${imageUrl}" 
            alt="${place.name}"
            style="
              width: 100%;
              height: 100%;
              margin-left: 11px;
              object-fit: cover;
            "
            onerror="this.style.display='none'; this.parentElement.innerHTML='<i class=\\"bi bi-geo-alt-fill\\" style=\\"font-size: 20px; color: #3498db;\\"></i>';"
          />
        </div>
      `,
      iconSize: [iconSize, iconSize],
      iconAnchor: [iconAnchor, iconAnchor],
      popupAnchor: [0, -iconAnchor - 5],
    });
  } else {
    return new L.DivIcon({
      className: 'custom-marker',
      html: `
        <div style="
          width: ${iconSize}px;
          height: ${iconSize}px;
          border-radius: 50%;
          border: 2px solid #3498db;
          background: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <i class=\"bi bi-geo-alt-fill\" style=\"font-size: 24px; color: #3498db;\"></i>
        </div>
      `,
      iconSize: [iconSize, iconSize],
      iconAnchor: [iconAnchor, iconAnchor],
      popupAnchor: [0, -iconAnchor - 5],
    });
  }
};

const TourDetail = () => {
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [newestTours, setNewestTours] = useState([]);
  const [routePlaces, setRoutePlaces] = useState([]);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/tours/${id}`);
        if (!response.ok) {
          throw new Error('Không tìm thấy lộ trình');
        }
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Server trả về dữ liệu không hợp lệ");
        }
        const data = await response.json();
        setTour(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchTour();

    // Fetch newest tours (excluding current)
    const fetchNewest = async () => {
      try {
        const res = await tourApi.getAll();
        let tours = res.data || [];
        tours = tours.filter(t => t.id !== Number(id));
        tours.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setNewestTours(tours);
      } catch (e) {
        setNewestTours([]);
      }
    };
    fetchNewest();
  }, [id]);

  useEffect(() => {
    if (!tour || !tour.steps || tour.steps.length === 0) {
      setRoutePlaces([]);
      return;
    }
    // Fetch all places for the steps in order
    const fetchPlaces = async () => {
      const places = await Promise.all(
        tour.steps.sort((a, b) => a.step_order - b.step_order).map(s => axios.get(`http://localhost:3000/api/places/${s.place_id}`).then(r => r.data))
      );
      setRoutePlaces(places);
    };
    fetchPlaces();
  }, [tour]);

  useEffect(() => {
    if (!tour || !tour.steps || tour.steps.length === 0) return;
    // Attach place object to each step if missing
    const fetchStepPlaces = async () => {
      const stepsWithPlace = await Promise.all(
        tour.steps.map(async (step) => {
          if (step.place) return step;
          try {
            const res = await axios.get(`http://localhost:3000/api/places/${step.place_id}`);
            return { ...step, place: res.data };
          } catch {
            return step;
          }
        })
      );
      setTour((prev) => ({ ...prev, steps: stepsWithPlace }));
    };
    fetchStepPlaces();
  }, [tour]);

  // Helper to chunk array into groups of 3
  function chunkArray(arr, size) {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600">Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex flex-column luxury-home-container">
      <Header />
      <main className="flex-grow-1">
        <div className="container mx-auto p-4 max-w-3xl">
          <div style={{ background: 'rgba(245, 250, 255, 0.95)', borderRadius: '1.5rem', boxShadow: '0 4px 24px 0 rgba(31, 38, 135, 0.10)', padding: '2.5rem 2rem', margin: '2rem 0' }}>            {/* HERO SECTION: Tour image as background with overlay and title */}
            <div style={{
              position: 'relative',
              width: '100%',
              minHeight: 380,
              maxHeight: 520,
              borderRadius: '1.5rem',
              overflow: 'hidden',
              marginBottom: 40,
              boxShadow: '0 4px 32px 0 rgba(177, 178, 189, 0.13)'
            }}>
              <img
                src={tour.image_url.startsWith('http') ? tour.image_url : `http://localhost:3000${tour.image_url}`}
                alt={tour.name}
                style={{
                  width: '100%',
                  height: 520,
                  objectFit: 'cover',
                  objectPosition: 'center',
                  filter: 'brightness(0.6)',
                  borderRadius: '1.5rem',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  zIndex: 1
                }}
              />
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.18) 60%, rgba(0,0,0,0.65) 100%)',
                zIndex: 2
              }} />
              <div style={{
                position: 'relative',
                zIndex: 3,
                height: 520,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 2.5rem',
                textAlign: 'center',
              }}>
                <h1 className="display-3 fw-bold mb-3" style={{ color: '#fff', textShadow: '0 2px 24px #000a', letterSpacing: '-1.5px', fontSize: '3.2rem' }}>{tour.name}</h1>
              </div>
            </div>
            {/* DESCRIPTION SECTION */}
            <div className="mb-5 p-4" style={{ background: '#fafdff', borderRadius: '1.25rem', boxShadow: '0 2px 12px #b6e0fe22' }}>
              <h2 className="h5 fw-bold mb-3" style={{ color: '#3c69b0', letterSpacing: '-0.5px' }}>Giới thiệu về tour</h2>
              <hr style={{ margin: '0 0 1.5rem 0', borderColor: '#e3f0ff' }} />
              <div className="prose prose-lg" style={{ color: '#223a5f', fontSize: '1.15rem', lineHeight: 1.7 }}>
                <div dangerouslySetInnerHTML={{ __html: tour.description }} />
              </div>
            </div>
            <div style={{ width: '100%', maxWidth: '100%', height: 340, borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 4px 24px #b6e0fe55', border: '1px solid #e3f0ff', flex: '1 1 400px', background: '#fafdff' }}>
                <MapContainer
                  center={routePlaces.length > 0 ? [
                    routePlaces.reduce((sum, p) => sum + parseFloat(p.latitude), 0) / routePlaces.length,
                    routePlaces.reduce((sum, p) => sum + parseFloat(p.longitude), 0) / routePlaces.length
                  ] : [0, 0]}
                  zoom={13}
                  style={{ width: '100%', height: '100%' }}
                  scrollWheelZoom={false}
                  dragging={false}
                  doubleClickZoom={false}
                  boxZoom={false}
                  keyboard={false}
                  zoomControl={false}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Polyline positions={routePlaces.map(p => [parseFloat(p.latitude), parseFloat(p.longitude)])} pathOptions={{ color: '#1a5bb8', weight: 4, opacity: 0.8 }} />
                  {routePlaces.map((p, idx) => (
                    <Marker key={p.id} position={[parseFloat(p.latitude), parseFloat(p.longitude)]} icon={createCustomIcon(p)}>
                      <Popup>
                        <div className="text-center">
                          <h5 className="text-primary mb-2">{p.name}</h5>
                          {p.address && <p className="mb-1 small">{p.address}</p>}
                          {p.city && <p className="mb-0 text-muted small">{p.city}</p>}
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            {tour.steps && tour.steps.length > 0 && (
              <div>
                <h2 className="text-xl fw-bold mb-3 mt-4" style={{ color: '#3c69b0' }}>Các điểm đến:</h2>
                {(() => {
                  const stepsByDay = tour.steps.reduce((acc, step) => {
                    const day = step.day || 1;
                    if (!acc[day]) acc[day] = [];
                    acc[day].push(step);
                    return acc;
                  }, {});
                  const sortedDays = Object.keys(stepsByDay).sort((a, b) => a - b);
                  return (
                    <div>
                      {sortedDays.map(dayNum => (
                        <div key={dayNum} className="mb-3">
                          <h4 className="fw-bold mb-2" style={{ color: '#3c69b0' }}>Ngày {dayNum}</h4>
                          <div>
                            {stepsByDay[dayNum].sort((a, b) => a.step_order - b.step_order).map((step, idx) => (
                              <div key={idx} className="mb-4" style={{ position: 'relative', paddingLeft: 0 }}>
                                <div style={{ fontWeight: 700, color: '#3c69b0', fontSize: '1.12rem', marginBottom: 4 }}>
                                  {step.place_name || (step.place && step.place.name)}
                                </div>
                                {step.place && step.place.description && (
                                  <div style={{ color: '#223a5f', fontSize: '1.01rem', background: '#fafdff', borderRadius: 8, padding: '10px 14px', boxShadow: '0 1px 6px #e3f0ff33' }}>
                                    {step.place.description.replace(/<[^>]+>/g, '').slice(0, 180)}{step.place.description.length > 180 ? '...' : ''}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}
            <div className="d-flex justify-content-center">
              <button
                onClick={() => navigate(-1)}
                className="mt-6 btn btn-main"
                style={{ minWidth: 140 }}
              >
                Quay lại
              </button>
            </div>
          </div>
        </div>
      </main>
      {/* Newest Tours Carousel */}
      <div className="container my-5">
        <h2 className="h4 mb-4 fw-bold luxury-section-title">Chuyến đi khác</h2>
        {newestTours.length === 0 ? (
          <p className="text-muted text-center">Không có chuyến đi nào để hiển thị.</p>
        ) : (
          <div id="toursCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              {chunkArray(newestTours, 3).map((group, idx) => (
                <div className={`carousel-item${idx === 0 ? ' active' : ''}`} key={group.map(t => t.id).join('-')}>
                  <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-5 justify-content-center">
                    {group.map((t) => (
                      <div className="col" key={t.id}>
                        <div className="card h-100 shadow border-0 rounded-4 luxury-card">
                          <a href={`/tours/${t.id}`} className="text-decoration-none">
                            {t.image_url && (
                              <img
                                src={t.image_url.startsWith('http') ? t.image_url : `http://localhost:3000${t.image_url}`}
                                alt={t.name}
                                className="card-img-top luxury-img-top"
                                style={{ height: 220, objectFit: 'cover', borderTopLeftRadius: '1.5rem', borderTopRightRadius: '1.5rem' }}
                              />
                            )}
                            <div className="card-body luxury-card-body">
                              <h3 className="card-title mb-2" style={{ fontWeight: 600 }}>{t.name}</h3>
                              <p className="card-text text-muted mb-2 luxury-desc">
                                {t.description ? `${t.description.replace(/<[^>]+>/g, '').substring(0, 100)}...` : 'Chưa có mô tả'}
                              </p>
                              <p className="card-text text-muted small mb-0 luxury-rating">
                                <span className="luxury-money">💰</span> {t.total_cost} VND
                              </p>
                            </div>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {newestTours.length > 3 && (
              <>
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
              </>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default TourDetail;
