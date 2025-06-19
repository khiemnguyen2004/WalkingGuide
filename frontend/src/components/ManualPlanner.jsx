import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext.jsx";

function ManualPlanner() {
  const [places, setPlaces] = useState([]);
  const [tourName, setTourName] = useState("");
  const [description, setDescription] = useState("");
  const [totalCost, setTotalCost] = useState(0);
  const [steps, setSteps] = useState([]);
  const { user, logout } = useContext(AuthContext);
  const userId = user ? user.id : null;

  useEffect(() => {
    axios.get("http://localhost:3000/api/places").then((res) => {
      setPlaces(res.data);
    });
  }, []);

  const handleAddStep = () => {
    setSteps([...steps, { place_id: "", step_order: steps.length + 1, stay_duration: 60 }]);
  };

  const handleChangeStep = (index, field, value) => {
    const newSteps = [...steps];
    newSteps[index][field] = field === "stay_duration" || field === "step_order" ? parseInt(value) : value;
    setSteps(newSteps);
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:3000/api/tours", {
        name: tourName,
        description,
        user_id: userId,
        total_cost: parseFloat(totalCost),
        steps,
      });
      alert("Tạo tour thành công!");
      setTourName("");
      setDescription("");
      setTotalCost(0);
      setSteps([]);
    } catch (err) {
      console.error(err);
      alert("Lỗi khi tạo tour");
    }
  };

  if (!user) {
    return (
      <div className="container py-4">
        <h2>Lên lộ trình du lịch thủ công</h2>
        <div className="alert alert-warning mt-3">Bạn cần đăng nhập để sử dụng chức năng này.</div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2>Lên lộ trình du lịch thủ công</h2>

      <label className="form-label">Tên tour</label>
      <input
        className="form-control mb-2"
        value={tourName}
        onChange={(e) => setTourName(e.target.value)}
        placeholder="Tên tour"
      />
      <label className="form-label">Mô tả</label>
      <textarea
        className="form-control mb-2"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Mô tả"
      />
      <label className="form-label">Tổng chi phí (VND)</label>
      <input
        className="form-control mb-2"
        type="number"
        value={totalCost}
        onChange={(e) => setTotalCost(e.target.value)}
        placeholder="Tổng chi phí (VND)"
      />

      <h4>Các bước trong tour</h4>
      {steps.map((step, i) => (
        <div key={i} className="row mb-2">
          <div className="col-md-5">
            <label className="form-label">Địa điểm</label>
            <select
              className="form-select"
              value={step.place_id}
              onChange={(e) => handleChangeStep(i, "place_id", e.target.value)}
            >
              <option value="">-- Chọn địa điểm --</option>
              {places.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Thứ tự</label>
            <input
              type="number"
              className="form-control"
              placeholder="Thứ tự"
              value={step.step_order}
              onChange={(e) => handleChangeStep(i, "step_order", e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Thời gian ở lại (phút)</label>
            <input
              type="number"
              className="form-control"
              placeholder="Thời gian ở lại (phút)"
              value={step.stay_duration}
              onChange={(e) => handleChangeStep(i, "stay_duration", e.target.value)}
            />
          </div>
        </div>
      ))}
      <button className="btn btn-main me-5" onClick={handleAddStep}>
        + Thêm địa điểm
      </button>
      <button className="btn btn-main" onClick={handleSubmit}>
        Tạo tour
      </button>
    </div>
  );
}

export default ManualPlanner;
