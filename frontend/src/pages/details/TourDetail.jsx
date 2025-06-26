import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header.jsx';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';

const TourDetail = () => {
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

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
  }, [id]);

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
      <Navbar />
      <main className="flex-grow-1">
        <div className="container mx-auto p-4 max-w-3xl">
          <div style={{ background: 'rgba(245, 250, 255, 0.95)', borderRadius: '1.5rem', boxShadow: '0 4px 24px 0 rgba(31, 38, 135, 0.10)', padding: '2.5rem 2rem', margin: '2rem 0' }}>
            <h1 className="text-3xl font-bold mb-2 text-gray-800 text-center">{tour.name}</h1>
            {tour.created_at && (
              <div className="text-center text-muted mb-2" style={{fontSize: '1rem'}}>
                Ngày tạo: {new Date(tour.created_at).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
            {tour.image_url && (
              <div className="d-flex justify-content-center mb-4">
                <img
                  src={tour.image_url.startsWith('http') ? tour.image_url : `http://localhost:3000${tour.image_url}`}
                  alt={tour.name}
                  style={{ maxWidth: '420px', maxHeight: '260px', width: '100%', objectFit: 'cover', borderRadius: '1rem', boxShadow: '0 2px 12px #b6e0fe55' }}
                />
              </div>
            )}
            <div className="text-gray-600 mb-4 d-flex flex-wrap gap-4 justify-content-center align-items-center" style={{ fontSize: '1.05rem' }}>
              <span className="d-flex align-items-center gap-2">
                Người tạo: <b>{tour.user_id}</b>
              </span>
              <span>Chi phí: <b>{tour.total_cost}</b></span>
              {tour.start_time && (
                <span>Bắt đầu: <b>{tour.start_time}</b></span>
              )}
              {tour.end_time && (
                <span>Kết thúc: <b>{tour.end_time}</b></span>
              )}
            </div>
            <div className="prose prose-lg mb-4" style={{ color: '#223a5f', fontSize: '1.15rem', lineHeight: 1.7 }}>
              <div dangerouslySetInnerHTML={{ __html: tour.description }} />
            </div>
            {tour.steps && tour.steps.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Các điểm đến:</h2>
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
                          <h4 className="fw-bold mb-2">Ngày {dayNum}</h4>
                          <ul className="list-disc pl-6">
                            {stepsByDay[dayNum].sort((a, b) => a.step_order - b.step_order).map((step, idx) => (
                              <li key={idx} className="mb-2">
                                <strong>{step.place_name || (step.place && step.place.name)}</strong> (Thời gian lưu trú: {step.stay_duration} phút)
                                {step.start_time && (
                                  <span> | Bắt đầu: <b>{step.start_time}</b></span>
                                )}
                                {step.end_time && (
                                  <span> | Kết thúc: <b>{step.end_time}</b></span>
                                )}
                              </li>
                            ))}
                          </ul>
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
      <Footer />
    </div>
  );
};

export default TourDetail;
