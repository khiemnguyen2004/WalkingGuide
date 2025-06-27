import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext.jsx";
import Header from "./Header.jsx";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import "../css/luxury-home.css";

const AutoPlanner = ({ noLayout }) => {
  const [days, setDays] = useState(1);
  const [interests, setInterests] = useState("");
  const [budget, setBudget] = useState("");
  const [tourData, setTourData] = useState(null);
  const [error, setError] = useState("");
  const [tourName, setTourName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useContext(AuthContext);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [start_time, setStart_time] = useState("");
  const [end_time, setEnd_time] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3000/api/tags").then(res => setTags(res.data));
  }, []);

  const generateTour = async () => {
    if (!user?.id || isNaN(Number(user.id))) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    try {
      setError("");
      setIsGenerating(true);
      const res = await axios.post("http://localhost:3000/api/ai/generate-tour", {
        days: parseInt(days),
        interests: interests.split(",").map(i => i.trim()).filter(Boolean),
        budget: budget ? parseFloat(budget) : 0,
        user_id: Number(user.id),
        tag_ids: selectedTags.map(Number),
        start_time: start_time,
        end_time: end_time
      });
      setTourData(res.data);
    } catch (err) {
      console.error(err);
      setError("Không thể tạo tour. Hãy kiểm tra lại dữ liệu.");
    } finally {
      setIsGenerating(false);
    }
  };

  const saveTour = async () => {
    if (!tourData) return;
    
    setIsSaving(true);
    try {
      // Calculate days based on start and end dates
      let totalDays = 1;
      if (start_time && end_time) {
        const startDate = new Date(start_time);
        const endDate = new Date(end_time);
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        totalDays = Math.max(1, diffDays);
      } else {
        totalDays = parseInt(days) || 1;
      }
      
      // Distribute steps across days evenly
      const stepsPerDay = Math.ceil(tourData.steps.length / totalDays);
      
      await axios.post("http://localhost:3000/api/tours", {
        name: tourName || tourData.tour.name,
        description: tourData.tour.description,
        user_id: user.id,
        total_cost: tourData.tour.total_cost,
        steps: tourData.steps.map((step, i) => ({
          place_id: step.place_id,
          step_order: i + 1,
          stay_duration: step.stay_duration,
          start_time: step.start_time || null,
          end_time: step.end_time || null,
          day: Math.floor(i / stepsPerDay) + 1 // Distribute evenly across calculated days
        })),
        start_time: start_time,
        end_time: end_time
      });
      alert("Đã lưu tour vào hệ thống!");
      setTourData(null);
      setTourName("");
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lưu tour vào hệ thống!");
    } finally {
      setIsSaving(false);
    }
  };

  // Helper to generate a friendly AI-like description
  function generateAIDescription(interests, steps) {
    if (!interests || !steps || steps.length === 0) return "";
    const interestArr = interests.split(",").map(i => i.trim()).filter(Boolean);
    const placeNames = steps.map(s => s.place?.name).filter(Boolean);
    if (interestArr.length === 0 || placeNames.length === 0) return "";
    let desc = "";
    if (interestArr.length === 1) {
      desc += `Nếu bạn yêu thích ${interestArr[0]}, bạn không thể bỏ qua những địa điểm như ${placeNames.slice(0,2).join(", ")}`;
    } else {
      desc += `Dựa trên sở thích của bạn (${interestArr.join(", ")}), các địa điểm nổi bật gồm: ${placeNames.slice(0,3).join(", ")}`;
    }
    return desc;
  }

  if (!user) {
    const content = (
      <div className="container py-4">
        <h2>Tạo lộ trình tự động</h2>
        <div className="alert alert-warning mt-3">Bạn cần đăng nhập để sử dụng chức năng này.</div>
      </div>
    );
    if (noLayout) return content;
    return (
      <div className="min-vh-100 d-flex flex-column bg-gradient-to-br from-gray-100 to-white luxury-home-container">
        <Header />
        <main className="container py-4 flex-grow-1">{content}</main>
        <Footer />
      </div>
    );
  }

  const mainContent = (
    <div className="luxury-planner-container">
      <h2 className="luxury-section-title mb-4">Tạo lộ trình tự động</h2>
      
      {/* Tour Configuration */}
      <div className="luxury-card mb-4">
        <div className="luxury-card-body">
          <h4 className="mb-3">Cấu hình tour</h4>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-bold">Tên tour</label>
              <input
                className="form-control"
                value={tourName}
                onChange={e => setTourName(e.target.value)}
                placeholder="Nhập tên tour (tuỳ chọn)"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Số ngày <span className="text-danger">*</span></label>
              <input
                type="number"
                min={1}
                max={7}
                placeholder="Nhập số ngày (1-7)"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Bạn thích đi đâu?</label>
              <div>
                <div className="d-flex align-items-center gap-2">
                  <select
                    className="form-select"
                    value=""
                    onChange={e => {
                      const tagId = e.target.value;
                      if (tagId && !selectedTags.includes(tagId)) {
                        setSelectedTags([...selectedTags, tagId]);
                      }
                    }}>
                    <option value="">Có thể bạn muốn khám phá...</option>
                    {tags.filter(tag => !selectedTags.includes(String(tag.id))).map(tag => (
                      <option key={tag.id} value={tag.id}>{tag.name}</option>
                    ))}
                  </select>
                </div>
                <div className="mt-2">
                  {selectedTags.map(tagId => {
                    const tag = tags.find(t => String(t.id) === String(tagId));
                    if (!tag) return null;
                    return (
                      <span key={tag.id} className="badge bg-primary me-2 mb-1" style={{fontSize: '1em'}}>
                        {tag.name}
                        <button
                          type="button"
                          className="btn btn-sm btn-link text-white ms-1 p-0 text-decoration-none"
                          style={{fontSize: '1em'}}
                          title="Xóa thẻ"
                          onClick={() => setSelectedTags(selectedTags.filter(id => id !== String(tag.id)))}
                        >×</button>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>          
            <div className="col-md-6">
              <label className="form-label fw-bold">Ngày bắt đầu</label>
              <input
                type="date"
                className="form-control"
                value={start_time}
                onChange={e => setStart_time(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Ngày kết thúc</label>
              <input
                type="date"
                className="form-control"
                value={end_time}
                onChange={e => setEnd_time(e.target.value)}
                min={start_time}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Sở thích</label>
              <input
                type="text"
                placeholder="Ví dụ: biển, núi, lịch sử, ẩm thực"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Ngân sách (VND)</label>
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
          <div className="text-center mt-4">
            <button
              onClick={generateTour}
              className="btn btn-main btn-lg px-5"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <i className="fas fa-magic fa-spin me-2"></i>
                  AI đang tạo tour...
                </>
              ) : (
                <>
                  <i className="fas fa-magic me-2"></i>
                  Tạo tour bằng AI
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {/* Generated Tour Display */}
      {tourData && (
        <div className="luxury-card">
          <div className="luxury-card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">Tour được tạo</h4>
              <button
                onClick={saveTour}
                className="btn btn-main"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <i className="fas fa-spinner fa-spin me-2"></i>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save me-2"></i>
                    Lưu tour
                  </>
                )}
              </button>
            </div>

            <div className="tour-info mb-4">
              <h5 className="text-primary mb-2">
                <i className="fas fa-route me-2"></i>
                {/* {tourData.tour.name} */}
              </h5>
              <p className="text-muted mb-2">
                {generateAIDescription(interests, tourData.steps) || tourData.tour.description}
              </p>
              <div className="row">
                <div className="col-md-4">
                  <small className="text-muted">
                    <i className="fas fa-calendar me-1"></i>
                      {start_time && end_time ? `${start_time} → ${end_time}` : `${tourData.steps.length} địa điểm`}
                  </small>
                </div>
                <div className="col-md-4">
                  <small className="text-muted">
                    <i className="fas fa-clock me-1"></i>
                    {tourData.steps.reduce((total, step) => total + (step.stay_duration || 0), 0)} phút
                  </small>
                </div>
                <div className="col-md-4">
                  <small className="text-muted">
                    <i className="fas fa-money-bill me-1"></i>
                    {tourData.tour.total_cost?.toLocaleString('vi-VN')} VND
                  </small>
                </div>
              </div>
            </div>

            <h5 className="mb-3">Lộ trình chi tiết</h5>
            <div className="tour-steps-timeline">
              {tourData.steps.map((step, index) => {
                const place = step.place;
                return (
                  <div key={index} className="timeline-step">
                    <div className="timeline-marker">
                      <div className="step-number">{index + 1}</div>
                    </div>
                    <div className="timeline-content">
                      <div className="place-card">
                        <div className="place-header">
                          <h6 className="place-name mb-1">
                            <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                            {place?.name}
                          </h6>
                          <div className="place-details">
                            <span className="badge bg-primary me-2">
                              <i className="fas fa-clock me-1"></i>
                              {step.stay_duration} phút
                            </span>
                            {step.start_time && (
                              <span className="badge bg-success me-2">
                                <i className="fas fa-play me-1"></i>
                                {step.start_time}
                              </span>
                            )}
                            {step.end_time && (
                              <span className="badge bg-info">
                                <i className="fas fa-stop me-1"></i>
                                {step.end_time}
                              </span>
                            )}
                          </div>
                        </div>
                        {place?.address && (
                          <p className="place-address mb-2">
                            <i className="fas fa-location-dot me-1 text-muted"></i>
                            <small className="text-muted">{place.address}</small>
                          </p>
                        )}
                        {place?.description && (
                          <p className="place-description">
                            <small className="text-muted">{place.description}</small>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (noLayout) return mainContent;

  return (
    <div className="min-vh-100 d-flex flex-column bg-gradient-to-br from-gray-100 to-white luxury-home-container">
      <Header />
      <main className="container py-4 flex-grow-1">
        {mainContent}
      </main>
      <Footer />
    </div>
  );
};

export default AutoPlanner;
