import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PlaceDetail = () => {
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/places/${id}`);
        if (!response.ok) {
          throw new Error('Không tìm thấy địa điểm');
        }
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Server trả về dữ liệu không hợp lệ");
        }
        const data = await response.json();
        setPlace(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchPlace();
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
      <h1 className="text-3xl font-bold mb-4 text-gray-800">{place.name}</h1>
      {place.image_url && (
        <img
          src={place.image_url}
          alt={place.name}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
      )}
      <div className="text-gray-600 mb-4">
        <p>Địa chỉ: {place.address}</p>
        <p>Đánh giá: {place.rating}</p>
      </div>
      <div className="prose prose-lg">
        <p>{place.description}</p>
      </div>
      <button
        onClick={() => navigate(-1)}
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Quay lại
      </button>
    </div>
  );
};

export default PlaceDetail;
