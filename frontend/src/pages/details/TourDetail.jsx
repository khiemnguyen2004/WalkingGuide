import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">{tour.name}</h1>
      {tour.image_url && (
        <img
          src={tour.image_url}
          alt={tour.name}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
      )}
      <div className="text-gray-600 mb-4 d-flex flex-wrap gap-4">
        <span>Người tạo: <b>{tour.user_id}</b></span>
        <span>Chi phí: <b>{tour.total_cost}</b></span>
        {tour.created_at && <span>Ngày tạo: {new Date(tour.created_at).toLocaleDateString()}</span>}
      </div>
      <div className="prose prose-lg mb-4">
        <div dangerouslySetInnerHTML={{ __html: tour.description }} />
      </div>
      {tour.steps && tour.steps.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Các điểm đến:</h2>
          <ul className="list-disc pl-6">
            {tour.steps.map((step, idx) => (
              <li key={idx} className="mb-2">
                <strong>Ngày {step.step_order}:</strong> {step.place_name || step.place?.name} (Thời gian lưu trú: {step.stay_duration} phút)
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        onClick={() => navigate(-1)}
        className="mt-6 btn btn-main"
      >
        Quay lại
      </button>
    </div>
  );
};

export default TourDetail;
