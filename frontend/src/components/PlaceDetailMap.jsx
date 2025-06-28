import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import '../css/PlaceDetailMap.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const createCustomIcon = (type) => {
  const iconSize = [32, 32];
  const iconAnchor = [16, 32];
  
  let iconUrl;
  let iconColor;
  
  switch (type) {
    case 'restaurant':
      iconColor = 'red';
      break;
    case 'hotel':
      iconColor = 'blue';
      break;
    case 'coffee':
      iconColor = 'orange';
      break;
    default:
      iconColor = 'red';
  }
  
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${iconColor}.png`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    shadowSize: [41, 41]
  });
};

// Current location icon
const currentLocationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to handle map updates
function MapUpdater({ center, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    if (center && center.lat && center.lng) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  
  return null;
}

// Component to handle initial map centering
function MapInitializer({ defaultCenter, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    if (defaultCenter && defaultCenter.length === 2) {
      map.setView(defaultCenter, zoom);
    }
  }, [defaultCenter, zoom, map]);
  
  return null;
}

// Component for current location button
function CurrentLocationButton({ onLocationClick }) {
  const map = useMap();
  
  const handleClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          map.setView([lat, lng], 15);
          onLocationClick({ lat, lng });
        },
        (error) => {
          console.error('Error getting current location:', error);
          alert('Không thể lấy vị trí hiện tại. Vui lòng kiểm tra quyền truy cập vị trí.');
        }
      );
    } else {
      alert('Trình duyệt của bạn không hỗ trợ định vị.');
    }
  };

  return (
    <div className="leaflet-control leaflet-bar location-control">
      <button
        onClick={handleClick}
        title="Đến vị trí hiện tại"
      >
        <i className="bi bi-geo-alt-fill"></i>
      </button>
    </div>
  );
}

// Component for zoom controls
function ZoomControls() {
  const map = useMap();
  
  const handleZoomIn = () => {
    map.zoomIn();
  };
  
  const handleZoomOut = () => {
    map.zoomOut();
  };

  return (
    <div className="leaflet-control leaflet-bar zoom-controls">
      <button
        onClick={handleZoomIn}
        title="Phóng to"
        className="zoom-in-btn"
      >
        <i className="bi bi-plus-lg"></i>
      </button>
      <button
        onClick={handleZoomOut}
        title="Thu nhỏ"
        className="zoom-out-btn"
      >
        <i className="bi bi-dash-lg"></i>
      </button>
    </div>
  );
}

function PlaceDetailMap({ place, onClose }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [places, setPlaces] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(place);
  const [defaultCenter, setDefaultCenter] = useState([10.8231, 106.6297]); // Default to Ho Chi Minh City
  const mapRef = useRef(null);

  // Get current location first
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(location);
          setDefaultCenter([location.lat, location.lng]);
          
          // Always find nearest place when map opens
          findNearestPlace(location);
        },
        (error) => {
          console.error('Error getting current location:', error);
          // Keep default center as Ho Chi Minh City
        }
      );
    }
  }, [places]);

  // Fetch all places
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/places');
        setPlaces(response.data);
      } catch (error) {
        console.error('Error fetching places:', error);
      }
    };
    fetchPlaces();
  }, []);

  // Find nearest place to current location
  const findNearestPlace = (location) => {
    if (places.length === 0) return;
    
    let nearestPlace = places[0];
    let shortestDistance = calculateDistance(
      location.lat, 
      location.lng, 
      parseFloat(places[0].latitude), 
      parseFloat(places[0].longitude)
    );
    
    places.forEach(place => {
      const distance = calculateDistance(
        location.lat,
        location.lng,
        parseFloat(place.latitude),
        parseFloat(place.longitude)
      );
      
      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestPlace = place;
      }
    });
    
    setSelectedPlace(nearestPlace);
  };

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handlePlaceClick = (clickedPlace) => {
    setSelectedPlace(clickedPlace);
  };

  const handleLocationClick = (location) => {
    setCurrentLocation(location);
    setDefaultCenter([location.lat, location.lng]);
    // Find nearest place to new location
    findNearestPlace(location);
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Không rõ';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    if (!price) return 'Không rõ';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className={`place-detail-map-container ${isExpanded ? 'expanded' : ''}`}>
      {/* Map Background */}
      <div className="map-background">
        <MapContainer
          ref={mapRef}
          center={defaultCenter}
          zoom={13}
          className="detail-map"
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* All Place Markers */}
          {places.map((placeItem) => (
            <Marker
              key={placeItem.id}
              position={[parseFloat(placeItem.latitude), parseFloat(placeItem.longitude)]}
              icon={createCustomIcon(placeItem.type || 'restaurant')}
              eventHandlers={{
                click: () => handlePlaceClick(placeItem)
              }}
            >
              <Popup>
                <div>
                  <h4>{placeItem.name}</h4>
                  <p>{placeItem.address}</p>
                  <button 
                    className="btn btn-sm btn-primary mt-2"
                    onClick={() => handlePlaceClick(placeItem)}
                  >
                    Xem chi tiết
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
          
          {/* Current Location Marker */}
          {currentLocation && (
            <Marker
              position={[currentLocation.lat, currentLocation.lng]}
              icon={currentLocationIcon}
            >
              <Popup>
                <div>
                  <h4>Vị trí hiện tại</h4>
                  <p>Bạn đang ở đây</p>
                </div>
              </Popup>
            </Marker>
          )}
          
          <MapUpdater center={defaultCenter} zoom={13} />
          <MapInitializer defaultCenter={defaultCenter} zoom={13} />
          <CurrentLocationButton onLocationClick={handleLocationClick} />
          <ZoomControls />
        </MapContainer>
      </div>

      {/* Overlay Information Panel */}
      <div className="info-overlay">
        {/* Header */}
        <div className="overlay-header">
          <div className="header-content">
            <h1 className="place-title">
              {selectedPlace?.name || 'Bạn muốn đi đâu?'}
            </h1>
            <div className="header-actions">
              <button 
                className="expand-btn"
                onClick={handleExpand}
                title={isExpanded ? 'Thu nhỏ' : 'Mở rộng'}
              >
                <i className={`bi bi-${isExpanded ? 'arrows-collapse' : 'arrows-expand'}`}></i>
              </button>
              <button 
                className="close-btn"
                onClick={onClose}
                title="Đóng"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overlay-content">
          {selectedPlace ? (
            <>
              {/* Tabs */}
              <div className="content-tabs">
                <button 
                  className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  <i className="bi bi-info-circle"></i>
                  Tổng Quan
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
                  onClick={() => setActiveTab('info')}
                >
                  <i className="bi bi-geo-alt"></i>
                  Thông Tin
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
                  onClick={() => setActiveTab('details')}
                >
                  <i className="bi bi-list-ul"></i>
                  Dịch vụ
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                  onClick={() => setActiveTab('reviews')}
                >
                  <i className="bi bi-star"></i>
                  Đánh giá
                </button>
              </div>

              {/* Tab Content */}
              <div className="tab-content">
                {activeTab === 'overview' && (
                  <div className="overview-tab">
                    <div className="place-overview">
                      <p>{selectedPlace?.description || 'Chưa có mô tả cho địa điểm này.'}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'info' && (
                  <div className="info-tab">
                    <div className="place-basic-info">
                      <div className="info-item location-item">
                        <i className="bi bi-geo-alt-fill"></i>
                        <div className="location-details">
                          <label>Địa chỉ:</label>
                          <span className="address-text">{selectedPlace?.address || 'Không có thông tin'}</span>
                          {currentLocation && selectedPlace?.latitude && selectedPlace?.longitude && (
                            <div className="distance-info">
                              <small>
                                <strong>Khoảng cách:</strong> {calculateDistance(
                                  currentLocation.lat,
                                  currentLocation.lng,
                                  parseFloat(selectedPlace.latitude),
                                  parseFloat(selectedPlace.longitude)
                                ).toFixed(1)} km
                              </small>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="info-item">
                        <i className="bi bi-clock"></i>
                        <div>
                          <label>Giờ mở cửa:</label>
                          <span>
                            {selectedPlace?.opening_time && selectedPlace?.closing_time 
                              ? `${formatTime(selectedPlace.opening_time)} - ${formatTime(selectedPlace.closing_time)}`
                              : 'Không có thông tin'
                            }
                          </span>
                        </div>
                      </div>
                      
                      <div className="info-item">
                        <i className="bi bi-telephone"></i>
                        <div>
                          <label>Điện thoại:</label>
                          <span>{selectedPlace?.phone || 'Không có thông tin'}</span>
                        </div>
                      </div>
                      
                      <div className="info-item">
                        <i className="bi bi-currency-dollar"></i>
                        <div>
                          <label>Mức giá:</label>
                          <span>{formatPrice(selectedPlace?.price_range)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'details' && (
                  <div className="details-tab">
                    <div className="details-grid">
                      <div className="detail-card">
                        <h4>Thông tin cơ bản</h4>
                        <ul>
                          <li><strong>Loại:</strong> {selectedPlace?.type || 'Không rõ'}</li>
                          <li><strong>Đánh giá:</strong> {selectedPlace?.rating || 'Chưa có đánh giá'}</li>
                          <li><strong>Trạng thái:</strong> {selectedPlace?.status || 'Hoạt động'}</li>
                        </ul>
                      </div>
                      
                      <div className="detail-card">
                        <h4>Dịch vụ</h4>
                        <ul>
                          <li>WiFi miễn phí</li>
                          <li>Chỗ đậu xe</li>
                          <li>Phòng vệ sinh</li>
                          <li>Điều hòa</li>
                        </ul>
                      </div>
                      
                      <div className="detail-card">
                        <h4>Thời gian phù hợp</h4>
                        <ul>
                          <li>Sáng: 7:00 - 11:00</li>
                          <li>Trưa: 11:00 - 14:00</li>
                          <li>Chiều: 14:00 - 18:00</li>
                          <li>Tối: 18:00 - 22:00</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="reviews-tab">
                    <div className="reviews-header">
                      <h3>Đánh giá từ khách hàng</h3>
                      <div className="average-rating">
                        <span className="rating-number">4.5</span>
                        <div className="stars">
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-half"></i>
                        </div>
                        <span className="total-reviews">(128 đánh giá)</span>
                      </div>
                    </div>
                    
                    <div className="reviews-list">
                      <div className="review-item">
                        <div className="review-header">
                          <div className="reviewer-info">
                            <div className="reviewer-avatar">N</div>
                            <div>
                              <div className="reviewer-name">Nguyễn Văn A</div>
                              <div className="review-date">2 ngày trước</div>
                            </div>
                          </div>
                          <div className="review-rating">
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star"></i>
                          </div>
                        </div>
                        <p className="review-text">
                          Địa điểm rất đẹp, không gian thoáng mát, nhân viên phục vụ nhiệt tình. 
                          Thức ăn ngon và giá cả hợp lý. Sẽ quay lại lần nữa!
                        </p>
                      </div>
                      
                      <div className="review-item">
                        <div className="review-header">
                          <div className="reviewer-info">
                            <div className="reviewer-avatar">T</div>
                            <div>
                              <div className="reviewer-name">Trần Thị B</div>
                              <div className="review-date">1 tuần trước</div>
                            </div>
                          </div>
                          <div className="review-rating">
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                          </div>
                        </div>
                        <p className="review-text">
                          Tuyệt vời! Không gian rất ấm cúng, đồ ăn ngon và giá cả phải chăng. 
                          Đặc biệt thích cách trang trí và ánh sáng ở đây.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{textAlign: 'center', padding: '2rem'}}>
              <h3>Chào mừng đến với bản đồ du lịch!</h3>
              <p>Nhấp vào bất kỳ địa điểm nào trên bản đồ để xem thông tin chi tiết.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlaceDetailMap; 