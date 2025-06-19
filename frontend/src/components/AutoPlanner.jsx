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

  if (!user) {
    return (
      <div className="container py-4">
        <h2>Tạo lộ trình tự động bằng AI</h2>
        <div className="alert alert-warning mt-3">Bạn cần đăng nhập để sử dụng chức năng này.</div>
      </div>
    );
  }

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
    <div className="container py-4">
      <h2>Tạo lộ trình tự động bằng AI</h2>
      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <label className="form-label">Số ngày <span className="text-danger">*</span></label>
          <input
            type="number"
            min={1}
            placeholder="Nhập số ngày"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Sở thích (cách nhau bởi dấu phẩy)</label>
          <input
            type="text"
            placeholder="Ví dụ: biển, núi, lịch sử"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Ngân sách (VND)</label>
          <input
            type="number"
            min={0}
            placeholder="Nhập ngân sách dự kiến"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="form-control"
          />
        </div>
      </div>
      <button
        onClick={generateTour}
        className="btn btn-main mb-2"
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
          className="btn btn-main"
        >
          Lưu tour này vào hệ thống
        </button>
      )}
      {error && <p className="text-danger mt-3">{error}</p>}
      {tourData && (
        <div className="mt-4">
          <h3 className="h5 fw-bold mb-2">Tour: {tourData.tour.name}</h3>
          <p className="mb-3">{tourData.tour.description}</p>
          <h4 className="h6 fw-bold mb-2">Các địa điểm:</h4>
          <div className="row g-2">
            {tourData.steps.map((step, index) => {
              const place = step.place;
              return (
                <div className="col-md-6 col-lg-4" key={index}>
                  <div className="card mb-2">
                    <div className="card-body p-2">
                      <div className="fw-bold">{place?.name}</div>
                      <div className="small text-muted">Thời gian ở lại: {step.stay_duration} phút</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AutoPlanner;
