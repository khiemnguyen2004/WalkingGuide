import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext.jsx";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import "../css/luxury-home.css";

const AutoPlanner = ({ noLayout }) => {
  const [interests, setInterests] = useState("");
  const [total_cost, setTotal_cost] = useState("");
  const [tourData, setTourData] = useState(null);
  const [error, setError] = useState("");
  const [tourName, setTourName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdTour, setCreatedTour] = useState(null);
  const { user, refreshNotifications } = useContext(AuthContext);
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
        interests: interests.split(",").map(i => i.trim()).filter(Boolean),
        total_cost: total_cost ? parseFloat(total_cost) : 0,
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
      
      const response = await axios.post("http://localhost:3000/api/tours", {
        name: tourName || tourData.tour.name,
        description: tourData.tour.description,
        user_id: user.id,
        total_cost: total_cost ? parseFloat(total_cost) : 0,
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
      
      setCreatedTour(response.data.tour);
      setShowSuccessModal(true);
      setTourData(null);
      setTourName("");
      
      // Trigger notification refresh to update unread count
      refreshNotifications();
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

  // Helper to convert HTML to plain text
  function htmlToPlainText(html) {
    if (!html) return "";
    // Create a temporary div element
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    // Get the text content (strips HTML tags)
    return tempDiv.textContent || tempDiv.innerText || "";
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
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Ngân sách (VNĐ)</label>
              <input
                type="text"
                placeholder="Nhập ngân sách"
                value={total_cost}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/\D/g, '');
                  setTotal_cost(rawValue);
                }}
                className="form-control"
              />
              {total_cost && (
                <div className="form-text">
                  <i className="bi bi-info-circle me-1"></i>
                  Ngân sách: {parseInt(total_cost).toLocaleString('vi-VN')} VNĐ
                </div>
              )}
              
              {/* Price Suggestions - only show when input is short and not a complete price */}
              {total_cost && total_cost.length > 0 && total_cost.length <= 3 && !total_cost.endsWith('000') && (
                <div className="mt-2">
                  <small className="text-muted">Gợi ý:</small>
                  <div className="d-flex flex-wrap gap-1 mt-1">
                    {(() => {
                      const inputNum = total_cost.replace(/\D/g, '');
                      const suggestions = [
                        { value: inputNum + '000', label: inputNum + '.000 VNĐ' },
                        { value: inputNum + '0000', label: inputNum + '0.000 VNĐ' },
                        { value: inputNum + '00000', label: inputNum + '00.000 VNĐ' },
                        { value: inputNum + '000000', label: inputNum + '.000.000 VNĐ' },
                        { value: inputNum + '0000000', label: inputNum + '0.000.000 VNĐ' },
                      ].filter(s => s.value !== total_cost);
                      
                      return suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                          onClick={() => setTotal_cost(suggestion.value)}
                        >
                          {suggestion.label}
                        </button>
                      ));
                    })()}
                  </div>
                </div>
              )}
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
                  <i className="bi bi-magic fa-spin me-2"></i>
                  Đang tạo tour...
                </>
              ) : (
                <>
                  <i className="bi bi-magic text-white me-2"></i>
                  Tạo tour
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
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
                    <i className="bi bi-spinner fa-spin me-2"></i>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <i className="bi bi-save me-2"></i>
                    Lưu tour
                  </>
                )}
              </button>
            </div>

            <div className="tour-info mb-4">
              <h5 className="text-primary mb-2">
                <i className="bi bi-route me-2"></i>
                {/* {tourData.tour.name} */}
              </h5>
              <p className="text-muted mb-2">
                {generateAIDescription(interests, tourData.steps) || htmlToPlainText(tourData.tour.description)}
              </p>
              <div className="row">
                <div className="col-md-4">
                  <small className="text-muted">
                    <i className="bi bi-calendar me-1"></i>
                      {start_time && end_time ? `${start_time} → ${end_time}` : `${tourData.steps.length} địa điểm`}
                  </small>
                </div>
                <div className="col-md-4">
                  <small className="text-muted">
                    <i className="bi bi-clock me-1"></i>
                    {tourData.steps.reduce((total, step) => total + (step.stay_duration || 0), 0)} phút
                  </small>
                </div>
                {/* <div className="col-md-4">
                  <small className="text-muted">
                    <i className="bi bi-cash me-1"></i>
                    {tourData.tour.total_cost?.toLocaleString('vi-VN')} VND
                  </small>
                </div> */}
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
                            <i className="bi bi-map-marker-alt me-2 text-primary"></i>
                            {place?.name}
                          </h6>
                          <div className="place-details">
                            <span className="badge bg-primary me-2">
                              <i className="bi bi-clock me-1"></i>
                              {step.stay_duration} phút
                            </span>
                            {step.start_time && (
                              <span className="badge bg-success me-2">
                                <i className="bi bi-play me-1"></i>
                                {step.start_time}
                              </span>
                            )}
                            {step.end_time && (
                              <span className="badge bg-info">
                                <i className="bi bi-stop me-1"></i>
                                {step.end_time}
                              </span>
                            )}
                          </div>
                        </div>
                        {place?.address && (
                          <p className="place-address mb-2">
                            <i className="bi bi-geo-alt me-1 text-muted"></i>
                            <small className="text-muted">{place.address}</small>
                          </p>
                        )}
                        {place?.description && (
                          <p className="place-description">
                            <small className="text-muted">{htmlToPlainText(place.description)}</small>
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
        {/* Success Modal */}
        {showSuccessModal && createdTour && (
          <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.4)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Tạo tour thành công!</h5>
                  <button type="button" className="btn-close" onClick={() => setShowSuccessModal(false)}></button>
                </div>
                <div className="modal-body">
                  <p>Bạn đã tạo tour <b>{createdTour.name}</b> thành công.</p>
                  <div className="mb-3">
                    <b>Thời gian:</b> {createdTour.start_time || "-"} đến {createdTour.end_time || "-"}
                  </div>
                  
                  {/* Auto reminder message */}
                  {createdTour.start_time && (
                    <div className="alert alert-info mt-3">
                      <i className="bi bi-bell me-2"></i>
                      <strong>Nhắc nhở tự động:</strong> Bạn sẽ nhận được thông báo nhắc nhở trước khi tour bắt đầu.
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  {createdTour.id && (
                    <button className="btn btn-main" onClick={() => window.location.href = `/tours/${createdTour.id}`}>
                      Xem chi tiết tour
                    </button>
                  )}
                  <button className="btn btn-outline-secondary" onClick={() => window.location.href = '/my-tours'}>
                    Đến trang My Tours
                  </button>
                  <button className="btn btn-link" onClick={() => setShowSuccessModal(false)}>
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AutoPlanner;
