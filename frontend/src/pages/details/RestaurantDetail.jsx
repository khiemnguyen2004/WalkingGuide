import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../../css/luxury-home.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:3000/api/restaurants/${id}`)
      .then(res => setRestaurant(res.data.data))
      .catch(() => setError('Không tìm thấy nhà hàng này.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="d-flex justify-content-center align-items-center py-5"><div className="spinner-border text-primary" role="status"></div></div>;
  if (error) return <div className="alert alert-danger mt-4 text-center">{error}</div>;
  if (!restaurant) return <div className="alert alert-warning mt-4 text-center">Không tìm thấy nhà hàng.</div>;

  const imageUrls = restaurant.images ? restaurant.images.map(img => img.image_url) : [];
  const mainImage = imageUrls.length > 0 ? (imageUrls[0].startsWith('http') ? imageUrls[0] : `http://localhost:3000${imageUrls[0]}`) : null;
  const galleryImages = imageUrls.length > 1 ? imageUrls.slice(1) : [];

  return (
    <div className="luxury-home-container">
      <Header />
      {/* Hero Image */}
      <div className="position-relative w-100 d-flex justify-content-center align-items-center" style={{height: 350, background: '#e9ecef', borderBottomLeftRadius: 24, borderBottomRightRadius: 24, overflow: 'hidden'}}>
        {mainImage ? (
          <img src={mainImage} alt={restaurant.name} style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block', margin: '0 auto'}} />
        ) : (
          <div className="d-flex align-items-center justify-content-center h-100 w-100 bg-light">
            <i className="bi bi-image text-muted" style={{fontSize: '4rem'}}></i>
          </div>
        )}
        <div className="position-absolute bottom-0 start-0 w-100 p-4" style={{background: 'linear-gradient(0deg, rgba(26,91,184,0.85) 60%, rgba(26,91,184,0.1) 100%)'}}>
          <h1 className="text-white fw-bold mb-1" style={{textShadow: '0 2px 8px #0008'}}>{restaurant.name}</h1>
          <div className="text-white mb-1"><i className="bi bi-geo-alt me-2"></i>{restaurant.address}</div>
        </div>
      </div>

      {/* Luxury Image Box */}
      {galleryImages.length > 0 && (
        <div className="container my-5">
          <div className="p-4 bg-white shadow-lg rounded-4 border border-2 luxury-img-box">
            <h5 className="fw-bold mb-4 text-center" style={{color: '#1a5bb8', letterSpacing: 1}}>Hình ảnh nhà hàng</h5>
            <div className="d-flex flex-wrap justify-content-center gap-4">
              {galleryImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img.startsWith('http') ? img : `http://localhost:3000${img}`}
                  alt={restaurant.name}
                  style={{height: 160, width: 240, objectFit: 'cover', borderRadius: 16, boxShadow: '0 4px 16px #1a5bb822', border: '2px solid #e9ecef', background: '#f8f9fa'}}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Luxury Info Section */}
      <div className="container pb-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="p-4 bg-white rounded-4 shadow-sm border border-2" style={{marginTop: 32}}>
              <h4 className="fw-bold mb-4" style={{color: '#1a5bb8'}}>Thông tin nhà hàng</h4>
              <div className="mb-3 fs-5"><i className="bi bi-geo-alt me-2 text-primary"></i><b>Địa chỉ:</b> <span className="text-dark">{restaurant.address || '---'}</span></div>
              <div className="mb-3 fs-5"><i className="bi bi-building me-2 text-secondary"></i><b>Thành phố:</b> <span className="text-dark">{restaurant.city || '---'}</span></div>
              <div className="mb-3 fs-5"><i className="bi bi-telephone me-2 text-success"></i><b>Liên hệ:</b> <span className="text-dark">{restaurant.phone || '---'}</span></div>
              <div className="mb-3 fs-5"><i className="bi bi-star me-2 text-warning"></i><b>Đánh giá:</b> <span className="text-dark">{restaurant.rating || '---'}</span></div>
              <div className="mb-3 fs-5"><i className="bi bi-currency-dollar me-2 text-success"></i><b>Giá trung bình:</b> <span className="text-dark">{restaurant.price ? restaurant.price.toLocaleString('vi-VN') + ' VND' : '---'}</span></div>
              <div className="mb-3 fs-5"><i className="bi bi-info-circle me-2 text-info"></i><b>Mô tả:</b> <span className="text-muted">{restaurant.description || '---'}</span></div>
              {restaurant.cuisine_type && (
                <div className="mb-3 fs-5"><i className="bi bi-egg-fried me-2 text-danger"></i><b>Loại ẩm thực:</b> <span className="text-dark">{restaurant.cuisine_type}</span></div>
              )}
              {Array.isArray(restaurant.features) && restaurant.features.length > 0 && (
                <div className="mb-3 fs-5">
                  <i className="bi bi-gem me-2 text-info"></i><b>Tiện ích:</b>
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {restaurant.features.map((ft, idx) => (
                      <span key={idx} className="badge bg-light text-dark border border-1 px-3 py-2" style={{fontSize: '1em', borderRadius: 12}}>{ft}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="d-flex justify-content-end mt-4">
                <Link to="/restaurants" className="btn btn-outline-primary px-4 py-2 fw-bold" style={{borderRadius: 8}}>
                  <i className="bi bi-arrow-left me-2"></i>Quay lại danh sách nhà hàng
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RestaurantDetail; 