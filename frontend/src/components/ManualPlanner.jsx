import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext.jsx";
import Header from "./Header.jsx";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import "../css/luxury-home.css";
import { useNavigate } from "react-router-dom";

function ManualPlanner({ noLayout }) {
  const [places, setPlaces] = useState([]);
  const [tourName, setTourName] = useState("");
  const [description, setDescription] = useState("");
  const [totalCost, setTotalCost] = useState(0);
  const [steps, setSteps] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, logout, refreshNotifications } = useContext(AuthContext);
  const [start_time, setStart_time] = useState("");
  const [end_time, setEnd_time] = useState("");
  const navigate = useNavigate();
  const [createdTour, setCreatedTour] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const userId = user ? user.id : null;
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('danger');

  useEffect(() => {
    axios.get("http://localhost:3000/api/places").then((res) => {
      setPlaces(res.data);
    });
  }, []);

  const handleAddStep = () => {
    setSteps([
      ...steps,
      {
        place_id: "",
        step_order: steps.length + 1,
        stay_duration: 60,
        start_time: "",
        end_time: "",
        day: 1 // default to day 1
      }
    ]);
  };

  const handleRemoveStep = (index) => {
    const newSteps = steps.filter((_, i) => i !== index);
    // Reorder remaining steps
    const reorderedSteps = newSteps.map((step, i) => ({
      ...step,
      step_order: i + 1
    }));
    setSteps(reorderedSteps);
  };

  const handleMoveStep = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === steps.length - 1) return;

    const newSteps = [...steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap steps
    [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
    
    // Update step_order
    newSteps.forEach((step, i) => {
      step.step_order = i + 1;
    });
    
    setSteps(newSteps);
  };

  const handleChangeStep = (index, field, value) => {
    const newSteps = [...steps];
    if (field === "stay_duration" || field === "step_order" || field === "day") {
      newSteps[index][field] = parseInt(value) || 1;
    } else {
      newSteps[index][field] = value;
    }
    setSteps(newSteps);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!tourName.trim()) {
      setAlertMessage('Vui lòng nhập tên tour!');
      setAlertType('warning');
      setShowAlert(true);
      return;
    }
    
    if (steps.length === 0) {
      setAlertMessage('Vui lòng thêm ít nhất một địa điểm!');
      setAlertType('warning');
      setShowAlert(true);
      return;
    }
    
    if (steps.some(step => !step.place_id)) {
      setAlertMessage('Vui lòng chọn địa điểm cho tất cả các bước!');
      setAlertType('warning');
      setShowAlert(true);
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await axios.post("http://localhost:3000/api/tours", {
        name: tourName,
        description,
        user_id: userId,
        total_cost: parseFloat(totalCost) || 0,
        start_time: start_time,
        end_time: end_time,
        steps,
      });
      // Show modal with summary and buttons
      setCreatedTour(res.data.tour || res.data); // support both {tour, steps} and just tour
      setShowSuccessModal(true);
      setTourName("");
      setDescription("");
      setTotalCost(0);
      setSteps([]);
      
      // Trigger notification refresh to update unread count
      refreshNotifications();
    } catch (error) {
      setAlertMessage('Lỗi khi tạo tour');
      setAlertType('danger');
      setShowAlert(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedPlace = (placeId) => {
    return places.find(p => p.id == placeId);
  };

  const stepsByDay = steps.reduce((acc, step) => {
    const day = step.day || 1;
    if (!acc[day]) acc[day] = [];
    acc[day].push(step);
    return acc;
  }, {});
  const sortedDays = Object.keys(stepsByDay).sort((a, b) => a - b);

  if (!user) {
    const content = (
      <div className="container py-4">
        <h2>Tự tạo lộ trình cho riêng bạn</h2>
        <div className="alert alert-warning mt-3">Bạn cần đăng nhập để sử dụng chức năng này.</div>
      </div>
    );
    if (noLayout) return content;
    return (
      <div className="min-vh-100 d-flex flex-column bg-gradient-to-br from-gray-100 to-white luxury-home-container">
        <Header />
        <Navbar activePage="plan" />
        <main className="container py-4 flex-grow-1">{content}</main>
        <Footer />
      </div>
    );
  }

  const mainContent = (
    <div className="luxury-planner-container">
      <h2 className="luxury-section-title mb-4">Tự tạo lộ trình cho riêng bạn</h2>
      
      {/* Alert Component */}
      {showAlert && (
        <div className={`alert alert-${alertType} alert-dismissible fade show`} role="alert">
          <i className={`bi ${alertType === 'danger' ? 'bi-exclamation-triangle-fill' : 'bi-exclamation-circle-fill'} me-2`}></i>
          {alertMessage}
          <button type="button" className="btn-close" onClick={() => setShowAlert(false)}></button>
        </div>
      )}

      {/* Tour Basic Info */}
      <div className="luxury-card mb-4">
        <div className="luxury-card-body">
          <h4 className="mb-3">Thông tin tour</h4>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-bold">Tên tour <span className="text-danger">*</span></label>
              <input
                className="form-control"
                value={tourName}
                onChange={(e) => setTourName(e.target.value)}
                placeholder="Nhập tên tour của bạn"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Tổng chi phí (VND)</label>
              <input
                className="form-control"
                type="text"
                value={totalCost ? parseInt(totalCost).toLocaleString('vi-VN') : ''}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/\D/g, '');
                  setTotalCost(rawValue);
                }}
                placeholder="Nhập chi phí dự kiến"
              />
              {totalCost && (
                <div className="form-text">
                  <i className="bi bi-info-circle me-1"></i>
                  Chi phí: {parseInt(totalCost).toLocaleString('vi-VN')} VNĐ
                </div>
              )}
              
              {/* Price Suggestions - only show when input is short and not a complete price */}
              {totalCost && totalCost.length > 0 && totalCost.length <= 3 && !totalCost.endsWith('000') && (
                <div className="mt-2">
                  <small className="text-muted">Gợi ý:</small>
                  <div className="d-flex flex-wrap gap-1 mt-1">
                    {(() => {
                      const inputNum = totalCost.replace(/\D/g, '');
                      const suggestions = [
                        { value: inputNum + '000', label: inputNum + '.000 VNĐ' },
                        { value: inputNum + '0000', label: inputNum + '0.000 VNĐ' },
                        { value: inputNum + '00000', label: inputNum + '00.000 VNĐ' },
                        { value: inputNum + '000000', label: inputNum + '.000.000 VNĐ' },
                        { value: inputNum + '0000000', label: inputNum + '0.000.000 VNĐ' },
                      ].filter(s => s.value !== totalCost);
                      
                      return suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                          onClick={() => setTotalCost(suggestion.value)}
                        >
                          {suggestion.label}
                        </button>
                      ));
                    })()}
                  </div>
                </div>
              )}
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
            <div className="col-12">
              <label className="form-label fw-bold">Mô tả</label>
              <textarea
                className="form-control"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả chi tiết về tour của bạn"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tour Steps */}
      <div className="luxury-card">
        <div className="luxury-card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">Các địa điểm trong tour</h4>
            <div className="d-flex gap-2">
              <button className="btn btn-main btn-sm" onClick={() => {
                // Calculate days based on start and end dates
                let totalDays = 1;
                if (start_time && end_time) {
                  const startDate = new Date(start_time);
                  const endDate = new Date(end_time);
                  const diffTime = Math.abs(endDate - startDate);
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  totalDays = Math.max(1, diffDays);
                } else {
                  totalDays = Math.ceil(steps.length / 3); // Default to 3 places per day
                }
                
                // Distribute steps evenly across calculated days
                const stepsPerDay = Math.ceil(steps.length / totalDays);
                const newSteps = steps.map((step, i) => ({
                  ...step,
                  day: Math.floor(i / stepsPerDay) + 1
                }));
                setSteps(newSteps);
              }}>
                <i className="bi bi-magic me-1"></i>Tự động phân ngày
              </button>
              <button className="btn btn-main btn-sm" onClick={handleAddStep}>
                Thêm địa điểm
              </button>
            </div>
          </div>

          {steps.length === 0 ? (
            <div className="text-center py-4">
              <i className="bi bi-map-marker-alt fa-3x text-muted mb-3"></i>
              <p className="text-muted">Chưa có địa điểm nào. Hãy thêm địa điểm đầu tiên!</p>
            </div>
          ) : (
            <>
              <div className="tour-steps-container">
                {sortedDays.map(dayNum => (
                  <div key={dayNum} className="mb-4">
                    <h5 className="fw-bold mb-3">Ngày {dayNum}</h5>
                    {stepsByDay[dayNum].map((step, i) => {
                      const selectedPlace = getSelectedPlace(step.place_id);
                      const stepIndex = steps.findIndex(s => s === step);
                      return (
                        <div key={stepIndex} className="tour-step-card mb-3">
                          <div className="tour-step-header">
                            <div className="step-number">{step.step_order}</div>
                            <div className="step-controls">
                              <button 
                                className="btn btn-sm btn-outline-secondary me-1"
                                onClick={() => handleMoveStep(stepIndex, 'up')}
                                disabled={stepIndex === 0}
                                title="Di chuyển lên"
                              >
                                <i className="bi bi-arrow-up"></i>
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-secondary me-1"
                                onClick={() => handleMoveStep(stepIndex, 'down')}
                                disabled={stepIndex === steps.length - 1}
                                title="Di chuyển xuống"
                              >
                                <i className="bi bi-arrow-down"></i>
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleRemoveStep(stepIndex)}
                                title="Xóa địa điểm"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </div>
                          <div className="tour-step-content">
                            <div className="row g-3">
                              <div className="col-md-6">
                                <label className="form-label fw-bold">Địa điểm <span className="text-danger">*</span></label>
                                <select
                                  className="form-select"
                                  value={step.place_id}
                                  onChange={(e) => handleChangeStep(stepIndex, "place_id", e.target.value)}
                                >
                                  <option value="">-- Chọn địa điểm --</option>
                                  {places.map((p) => (
                                    <option key={p.id} value={p.id}>
                                      {p.name}
                                    </option>
                                  ))}
                                </select>
                                {selectedPlace && (
                                  <div className="mt-2 p-2 bg-light rounded">
                                    <small className="text-muted">
                                      <i className="bi bi-map-marker-alt me-1"></i>
                                      {selectedPlace.address}
                                    </small>
                                  </div>
                                )}
                              </div>
                              <div className="col-md-2">
                                <label className="form-label fw-bold">Ngày</label>
                                <select
                                  className="form-select"
                                  value={step.day || 1}
                                  onChange={e => handleChangeStep(stepIndex, "day", e.target.value)}
                                >
                                  {(() => {
                                    // Calculate total days based on start/end dates
                                    let totalDays = 1;
                                    if (start_time && end_time) {
                                      const startDate = new Date(start_time);
                                      const endDate = new Date(end_time);
                                      const diffTime = Math.abs(endDate - startDate);
                                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                      totalDays = Math.max(1, diffDays);
                                    } else {
                                      totalDays = Math.max(1, Math.ceil(steps.length / 3));
                                    }
                                    
                                    return Array.from({ length: totalDays }, (_, i) => (
                                      <option key={i + 1} value={i + 1}>Ngày {i + 1}</option>
                                    ));
                                  })()}
                                </select>
                              </div>
                              <div className="col-md-2">
                                <label className="form-label fw-bold">Thời gian</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  min="15"
                                  step="15"
                                  value={step.stay_duration}
                                  onChange={(e) => handleChangeStep(stepIndex, "stay_duration", e.target.value)}
                                />
                              </div>
                              <div className="col-md-2">
                                <label className="form-label fw-bold">Thứ tự</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  min="1"
                                  value={step.step_order}
                                  onChange={(e) => handleChangeStep(stepIndex, "step_order", e.target.value)}
                                />
                              </div>
                              <div className="col-md-6">
                                <label className="form-label fw-bold">Thời gian bắt đầu</label>
                                <input
                                  type="time"
                                  className="form-control"
                                  value={step.start_time || ""}
                                  onChange={(e) => handleChangeStep(stepIndex, "start_time", e.target.value)}
                                />
                              </div>
                              <div className="col-md-6">
                                <label className="form-label fw-bold">Thời gian kết thúc</label>
                                <input
                                  type="time"
                                  className="form-control"
                                  value={step.end_time || ""}
                                  onChange={(e) => handleChangeStep(stepIndex, "end_time", e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
                <button 
                  className="btn btn-main btn-sm mb-3"
                  onClick={() => handleAddStep()}
                  title="Thêm địa điểm"
                >
                  Thêm
                </button>
              </div>
              {/* Add summary preview below steps */}
              <div className="mt-4">
                <h5 className="fw-bold">Tóm tắt kế hoạch:</h5>
                <ul>
                  {sortedDays.map(dayNum => (
                    <li key={dayNum}>
                      <b>Ngày {dayNum}:</b> {stepsByDay[dayNum].map(step => {
                        const place = getSelectedPlace(step.place_id);
                        return place ? place.name : "(Chưa chọn địa điểm)";
                      }).join(', ')}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-center mt-4">
        <button 
          className="btn btn-main btn-lg px-5" 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <i className="bi bi-spinner fa-spin me-2"></i>
              Đang tạo tour...
            </>
          ) : (
            <>
              <i className="bi bi-save me-2"></i>
              Tạo tour
            </>
          )}
        </button>
      </div>
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
                  <div className="mb-2">
                    <b>Thời gian:</b> {createdTour.start_time || "-"} đến {createdTour.end_time || "-"}
                  </div>
                  {/* Auto reminder message */}
                  {createdTour.start_time && (
                    <div className="alert alert-info mt-3">
                      <i className="bi bi-bell me-2"></i>
                      <strong>Nhắc nhở tự động:</strong> Bạn sẽ nhận được thông báo nhắc nhở trước khi tour bắt đầu.
                    </div>
                  )}
                      <b>Kế hoạch:</b>
                      <ul>
                        {sortedDays.map(dayNum => (
                          <li key={dayNum}>
                            <b>Ngày {dayNum}:</b> {stepsByDay[dayNum].map(step => {
                              const place = getSelectedPlace(step.place_id);
                              return place ? place.name : "(Chưa chọn địa điểm)";
                            }).join(', ')}
                          </li>
                        ))}
                      </ul>
                </div>
                <div className="modal-footer">
                  {createdTour.id && (
                    <button className="btn btn-main" onClick={() => navigate(`/tours/${createdTour.id}`)}>
                      Xem chi tiết tour
                    </button>
                  )}
                  <button className="btn btn-outline-secondary" onClick={() => navigate('/my-tours')}>
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
}

export default ManualPlanner;
