import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../../css/luxury-home.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import hotelApi from '../../api/hotelApi';
import { Modal, Button, Form } from 'react-bootstrap';
import { AuthContext } from '../../contexts/AuthContext';

const HotelDetail = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalImg, setModalImg] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingCheckIn, setBookingCheckIn] = useState("");
  const [bookingCheckOut, setBookingCheckOut] = useState("");
  const [bookingStatus, setBookingStatus] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:3000/api/hotels/${id}`)
      .then(res => setHotel(res.data.data))
      .catch(() => setError('Không tìm thấy khách sạn này.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="d-flex justify-content-center align-items-center py-5"><div className="spinner-border text-primary" role="status"></div></div>;
  if (error) return <div className="alert alert-danger mt-4 text-center">{error}</div>;
  if (!hotel) return <div className="alert alert-warning mt-4 text-center">Không tìm thấy khách sạn.</div>;

  const imageUrls = hotel.images ? hotel.images.map(img => img.image_url) : [];
  const mainImage = imageUrls.length > 0 ? (imageUrls[0].startsWith('http') ? imageUrls[0] : `http://localhost:3000${imageUrls[0]}`) : null;
  const galleryImages = imageUrls.length > 1 ? imageUrls.slice(1) : [];

  // Modal handler
  const handleImageClick = (imgUrl) => {
    setModalImg(imgUrl);
    setShowModal(true);
  };

  return (
    <div className="luxury-home-container">
      <Header />
      {/* Hero Image */}
      <div className="position-relative" style={{height: 350, width:'100%', background: '#e9ecef', borderBottomLeftRadius: 24, borderBottomRightRadius: 24, overflow: 'hidden'}}>
        {mainImage ? (
          <img src={mainImage} alt={hotel.name} style={{width: '100%', maxHeight: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block', margin: '0 auto', cursor: 'pointer'}} onClick={() => handleImageClick(mainImage)} />
        ) : (
          <div className="d-flex align-items-center justify-content-center h-100 w-100 bg-light">
            <i className="bi bi-image text-muted" style={{fontSize: '4rem'}}></i>
          </div>
        )}
        <div className="position-absolute bottom-0 start-0 w-100 p-4" style={{background: 'linear-gradient(0deg, rgba(26,91,184,0.85) 60%, rgba(26,91,184,0.1) 100%)'}}>
          <h1 className="text-white fw-bold mb-1" style={{textShadow: '0 2px 8px #0008'}}>{hotel.name}</h1>
          <div className="text-white mb-1"><i className="bi bi-geo-alt me-2"></i>{hotel.address}</div>
        </div>
      </div>

      {/* Luxury Image Box */}
      {galleryImages.length > 0 && (
        <div className="container my-5">
          <div className="p-4 bg-white shadow-lg rounded-4 border border-2 luxury-img-box">
            <h5 className="fw-bold mb-4 text-center" style={{color: '#1a5bb8', letterSpacing: 1}}>Hình ảnh khách sạn</h5>
            <div className="d-flex flex-wrap justify-content-center gap-4">
              {galleryImages.map((img, idx) => {
                const imgUrl = img.startsWith('http') ? img : `http://localhost:3000${img}`;
                return (
                  <img
                    key={idx}
                    src={imgUrl}
                    alt={hotel.name}
                    style={{height: 160, width: 240, objectFit: 'cover', borderRadius: 16, boxShadow: '0 4px 16px #1a5bb822', border: '2px solid #e9ecef', background: '#f8f9fa', cursor: 'pointer'}}
                    onClick={() => handleImageClick(imgUrl)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showModal && (
        <div className="modal fade show" style={{display:'block', background:'rgba(0,0,0,0.7)'}} tabIndex="-1" onClick={() => setShowModal(false)}>
          <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
            <div className="modal-content bg-transparent border-0">
              <button type="button" className="btn-close btn-close-white ms-auto" style={{fontSize: 24}} onClick={() => setShowModal(false)}></button>
              <img src={modalImg} alt="Preview" className="img-fluid rounded-4 shadow" style={{maxHeight: '70vh', maxWidth: '90vw', display: 'block', margin: '0 auto'}} />
            </div>
          </div>
        </div>
      )}

      {/* Luxury Info Section */}
      <div className="container pb-5">
        <div className="row justify-content-center">
          <div className="col-xlg-8">
            <div className="p-4 bg-white rounded-4 shadow-sm border border-2" style={{marginTop: 32}}>
              <h4 className="fw-bold mb-4" style={{color: '#1a5bb8'}}>Thông tin khách sạn</h4>
              <div className="mb-3 fs-5"><i className="bi bi-geo-alt me-2 text-primary"></i><b>Địa chỉ:</b> <span className="text-dark">{hotel.address || '---'}</span></div>
              <div className="mb-3 fs-5"><i className="bi bi-building me-2 text-secondary"></i><b>Thành phố:</b> <span className="text-dark">{hotel.city || '---'}</span></div>
              <div className="mb-3 fs-5"><i className="bi bi-telephone me-2 text-success"></i><b>Liên hệ:</b> <span className="text-dark">{hotel.phone || '---'}</span></div>
              <div className="mb-3 fs-5"><i className="bi bi-star me-2 text-warning"></i><b>Hạng sao:</b> <span className="text-dark">{hotel.stars || '---'}</span></div>
              <div className="mb-3 fs-5"><i className="bi bi-currency-dollar me-2 text-success"></i><b>Giá:</b> <span className="text-dark">{hotel.price ? hotel.price.toLocaleString('vi-VN') + ' VND' : '---'}</span></div>
              <div className="mb-3 fs-5"><i className="bi bi-info-circle me-2 text-info"></i><b>Mô tả:</b> <span className="text-muted">{hotel.description || '---'}</span></div>
              {Array.isArray(hotel.amenities) && hotel.amenities.length > 0 && (
                <div className="mb-3 fs-5">
                  <i className="bi bi-gem me-2 text-info"></i><b>Tiện nghi:</b>
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {hotel.amenities.map((am, idx) => (
                      <span key={idx} className="badge bg-light text-dark border border-1 px-3 py-2" style={{fontSize: '1em', borderRadius: 12}}>{am}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="d-flex justify-content-end mt-4 gap-2">
                <Button variant="success" size="lg" onClick={() => setShowBookingModal(true)}>
                  <i className="bi bi-calendar-check me-2"></i>Đặt phòng khách sạn
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Đặt phòng khách sạn</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Ngày nhận phòng</Form.Label>
              <Form.Control type="date" value={bookingCheckIn} onChange={e => setBookingCheckIn(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ngày trả phòng</Form.Label>
              <Form.Control type="date" value={bookingCheckOut} onChange={e => setBookingCheckOut(e.target.value)} />
            </Form.Group>
            {bookingStatus === 'success' && <div className="alert alert-success">Đặt phòng thành công!</div>}
            {bookingStatus === 'error' && <div className="alert alert-danger">Đặt phòng thất bại. Vui lòng thử lại.</div>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBookingModal(false)}>
            Đóng
          </Button>
          <Button variant="success" onClick={async () => {
            setBookingStatus(null);
            try {
              await hotelApi.bookHotel({
                user_id: user?.id,
                hotel_id: hotel.id,
                check_in: bookingCheckIn,
                check_out: bookingCheckOut,
              });
              setBookingStatus('success');
            } catch {
              setBookingStatus('error');
            }
          }} disabled={!bookingCheckIn || !bookingCheckOut}>
            Xác nhận đặt phòng
          </Button>
        </Modal.Footer>
      </Modal>
      <Footer />
    </div>
  );
};

export default HotelDetail; 