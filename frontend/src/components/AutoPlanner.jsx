import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext.jsx";

const AutoPlanner = () => {
  const [days, setDays] = useState(1);
  const [interests, setInterests] = useState("");
  const [budget, setBudget] = useState("");
  const [tourData, setTourData] = useState(null);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);

  const generateTour = async () => {
    if (!user?.id || isNaN(Number(user.id)) || !days || isNaN(days) || parseInt(days) < 1) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    try {
      setError("");
      const res = await axios.post("http://localhost:3000/api/ai/generate-tour", {
        days: parseInt(days),
        interests: interests.split(",").map(i => i.trim()).filter(Boolean),
        budget: budget ? parseFloat(budget) : 0,
        user_id: Number(user.id)
      });
      setTourData(res.data);
    } catch (err) {
      console.error(err);
      setError("Không thể tạo tour. Hãy kiểm tra lại dữ liệu.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Tạo lộ trình tự động bằng AI</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-1 font-medium">Số ngày <span className="text-red-500">*</span></label>
          <input
            type="number"
            min={1}
            placeholder="Nhập số ngày"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="p-2 border rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Sở thích (cách nhau bởi dấu phẩy)</label>
          <input
            type="text"
            placeholder="Ví dụ: biển, núi, lịch sử"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Ngân sách (VND)</label>
          <input
            type="number"
            min={0}
            placeholder="Nhập ngân sách dự kiến"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>
      </div>
      <button
        onClick={generateTour}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Tạo Tour
      </button>
      {tourData && (
        <button
          onClick={async () => {
            try {
              await axios.post("http://localhost:3000/api/tours", {
                name: tourData.tour.name,
                description: tourData.tour.description,
                user_id: user.id,
                total_cost: tourData.tour.total_cost,
                steps: tourData.steps.map((step, i) => ({
                  place_id: step.place_id,
                  step_order: i + 1,
                  stay_duration: step.stay_duration
                }))
              });
              alert("Đã lưu tour vào hệ thống!");
            } catch (err) {
              alert("Lỗi khi lưu tour vào hệ thống!");
            }
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded ml-2 mt-2"
        >
          Lưu tour này vào hệ thống
        </button>
      )}
      {error && <p className="text-red-500 mt-3">{error}</p>}
      {tourData && (
        <div className="mt-6">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-2xl font-bold text-blue-700 mb-2">{tourData.tour.name}</h3>
            <p className="text-gray-700 mb-4 text-lg">{tourData.tour.description}</p>
            <div className="flex flex-wrap gap-4 mb-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Tổng chi phí: {tourData.tour.total_cost || 0} VND</span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Số ngày: {days}</span>
              {interests && (
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">Sở thích: {interests}</span>
              )}
            </div>
          </div>
          <h4 className="text-lg font-bold mb-3 text-gray-800">Lộ trình các địa điểm:</h4>
          <ol className="space-y-4">
            {tourData.steps.map((step, index) => {
              const place = step.place;
              return (
                <li key={index} className="bg-gray-50 rounded-lg p-4 flex items-center gap-4 shadow-sm">
                  <span className="font-bold text-xl text-blue-600 mr-2">{index + 1}.</span>
                  <img src={place.image_url} alt={place.name} className="w-24 h-24 object-cover rounded mr-4 border" />
                  <div className="flex-1">
                    <h5 className="text-lg font-semibold mb-1 text-blue-900">{place.name}</h5>
                    <p className="text-gray-600 text-sm mb-1">Đánh giá: {place.rating}</p>
                    <p className="text-sm text-gray-700 mb-1">{place.description?.slice(0, 120)}...</p>
                    <span className="inline-block bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs mt-1">Thời gian ở lại: {step.stay_duration} phút</span>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
};

export default AutoPlanner;
