import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Header from '../../components/Header.jsx';
import Footer from '../../components/Footer.jsx';
import '../../css/PlaceDetailMap.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const PlaceDetail = () => {
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch place details
        const placeResponse = await fetch(`http://localhost:3000/api/places/${id}`);
        if (!placeResponse.ok) {
          throw new Error('Không tìm thấy địa điểm');
        }
        const placeData = await placeResponse.json();
        setPlace(placeData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // ESC key handler
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isExpanded]);

  // Convert HTML to plain text
  const convertHtmlToText = (html) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(90deg, #2196f3, #64b5f6)' }}>
        <div className="text-center text-white">
          <div className="spinner-border mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4>Đang tải thông tin địa điểm...</h4>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)' }}>
        <div className="text-center text-white">
          <i className="bi bi-exclamation-triangle display-1 mb-3"></i>
          <h4>{error}</h4>
          <button onClick={() => navigate(-1)} className="btn btn-light mt-3">
            <i className="bi bi-arrow-left me-2"></i>
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <Header />
      <main className="flex-grow-1">
        <div className="container-fluid p-0">
          <div className="row g-0">
            {/* Map Container - Full width */}
            <div className="col-12">
              <div className="place-detail-map-container">
                <div className="map-background">
                  <MapContainer
                    center={[parseFloat(place.latitude), parseFloat(place.longitude)]}
                    zoom={16}
                    className="detail-map"
                    zoomControl={true}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[parseFloat(place.latitude), parseFloat(place.longitude)]}>
                      <Popup>
                        <div className="text-center">
                          <h5 className="text-primary mb-2">{place.name}</h5>
                          {place.address && <p className="mb-1 small">{place.address}</p>}
                          {place.city && <p className="mb-0 text-muted small">{place.city}</p>}
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>

                {/* Information Overlay */}
                <div className={`info-overlay ${isExpanded ? 'expanded' : ''}`}>
                  <div className="overlay-content">
                    <div className="tab-content">
                      <div className="place-basic-info">

                        {/* Hero Image */}
                        {place.image_url && (
                          <div className="position-relative" style={{ height: '250px' }}>
                            <img
                              src={place.image_url.startsWith("http") ? place.image_url : `http://localhost:3000${place.image_url}`}
                              alt={place.name}
                              className="w-100 h-100"
                              style={{ objectFit: 'cover' }}
                              onError={(e) => {
                                e.target.src = "/default-place.jpg";
                              }}
                            />
                            <div className="position-absolute top-0 start-0 w-100 h-100" 
                                 style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.4) 100%)' }}>
                            </div>
                            <div className="position-absolute bottom-0 start-0 w-100 p-3">
                              <h2 className="text-white fw-bold mb-2 text-shadow" style={{ fontSize: '1.8rem' }}>
                                {place.name}
                              </h2>
                              <div className="d-flex flex-wrap gap-2 align-items-center">
                                {place.city && (
                                  <span className="badge bg-primary bg-opacity-75 px-3 py-2 rounded-pill">
                                    <i className="bi bi-geo-alt-fill me-1"></i>
                                    {place.city}
                                  </span>
                                )}
                                <span className="badge bg-warning bg-opacity-75 px-3 py-2 rounded-pill">
                                  <i className="bi bi-star-fill me-1"></i>
                                  {place.rating?.toFixed ? place.rating.toFixed(1) : place.rating}/5
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                        {/* Open Button */}
                        <div className="d-flex justify-content-end pe-3">
                          <button
                            className="btn btn-primary btn-sm rounded-pill"
                            style={{ fontSize: '0.8rem' }}
                            title={isExpanded ? "Thu nhỏ thông tin" : "Mở rộng thông tin"}
                            onClick={() => setIsExpanded(!isExpanded)}
                          >
                            <i className={`bi ${isExpanded ? 'bi-arrows-collapse' : 'bi-arrows-expand'} me-1`}></i>
                            {isExpanded ? 'Xem bản đồ' : 'Xem thêm'}
                          </button>
                        </div>
                        {/* Place Info */}
                        <div className="p-4">
                          {/* Info Cards */}
                          <div className="row g-3 mb-4">
                            {place.address && (
                              <div className="col-12">
                                <div className="d-flex align-items-center p-3 bg-light rounded-3">
                                  <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3">
                                    <i className="bi bi-house text-primary"></i>
                                  </div>
                                  <div>
                                    <small className="text-muted d-block">Địa chỉ</small>
                                    <strong className="text-dark">{place.address}</strong>
                                  </div>
                                </div>
                              </div>
                            )}
                            {place.opening_hours && (
                              <div className="col-12">
                                <div className="d-flex align-items-center p-3 bg-light rounded-3">
                                  <div className="bg-success bg-opacity-10 p-2 rounded-circle me-3">
                                    <i className="bi bi-clock text-success"></i>
                                  </div>
                                  <div>
                                    <small className="text-muted d-block">Giờ mở cửa</small>
                                    <strong className="text-dark">{place.opening_hours}</strong>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Description */}
                          <div className="mb-4">
                            <h5 className="text-primary mb-3">
                              <i className="bi bi-info-circle me-2"></i>
                              Mô tả
                            </h5>
                            <div className="p-3 bg-light rounded-3 description-text" style={{ fontSize: '0.95rem', maxHeight: '150px', overflowY: 'auto' }}>
                              <div>{convertHtmlToText(place.description)}</div>
                            </div>
                          </div>

                          {/* Services */}
                          {place.service && (
                            <div className="mb-4">
                              <h5 className="text-primary mb-3">
                                <i className="bi bi-tools me-2"></i>
                                Dịch vụ
                              </h5>
                              <div className="p-3 service-section">
                                <p className="text-dark mb-0 fw-medium" style={{ fontSize: '0.95rem' }}>{place.service}</p>
                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="d-flex gap-2 justify-content-center pt-3">
                            <button
                              onClick={() => navigate(-1)}
                              className="btn btn-outline-primary px-3 py-2 rounded-pill"
                              style={{ fontSize: '0.9rem' }}
                            >
                              <i className="bi bi-arrow-left me-2"></i>
                              Quay lại
                            </button>
                            <button className="btn btn-primary px-3 py-2 rounded-pill" style={{ fontSize: '0.9rem' }}>
                              <i className="bi bi-share me-2"></i>
                              Chia sẻ
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlaceDetail;
