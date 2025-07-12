import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Header from "../components/Header.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { Link } from "react-router-dom";
import "../css/luxury-home.css";
import tourStepApi from "../api/tourStepApi";
import placeApi from "../api/placeApi";
import tourApi from '../api/tourApi';
import { FaUser, FaCalendarAlt, FaPlusCircle } from 'react-icons/fa';
import { Modal, Button } from 'react-bootstrap';
import RatingStars from '../components/RatingStars.jsx';
import CustomAlertModal from '../components/CustomAlertModal.jsx';
import CustomConfirmModal from '../components/CustomConfirmModal.jsx';

function MyTours() {
  const { user } = useContext(AuthContext);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tourToDelete, setTourToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [tourSteps, setTourSteps] = useState([]); // steps for selected tour
  const [places, setPlaces] = useState({}); // { [placeId]: placeObj }
  const [allPlaces, setAllPlaces] = useState([]);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    image_url: "",
    total_cost: "",
  });
  const [editError, setEditError] = useState("");
  const [showEditStepModal, setShowEditStepModal] = useState(false);
  const [stepToEdit, setStepToEdit] = useState(null);
  const [editStepForm, setEditStepForm] = useState({ stay_duration: '' });
  const [editStepError, setEditStepError] = useState("");
  const [removedStepIds, setRemovedStepIds] = useState([]);
  const [bookedTours, setBookedTours] = useState([]);
  const [showTourModal, setShowTourModal] = useState(false);
  const [modalTour, setModalTour] = useState(null);
  // Add state for modal steps and places
  const [modalSteps, setModalSteps] = useState([]);
  const [modalPlaces, setModalPlaces] = useState({});
  // Add state for custom modals
  const [alertModal, setAlertModal] = useState({ show: false, message: '', title: '' });
  const [confirmModal, setConfirmModal] = useState({ show: false, message: '', onConfirm: null });

  useEffect(() => {
    if (!user) return;
    axios.get(`http://localhost:3000/api/tours/user/${user.id}`)
      .then(res => {
        setTours(res.data);
        if (res.data.length > 0) setSelected(res.data[0]);
      })
      .catch(() => setError("Không thể tải danh sách tour."))
      .finally(() => setLoading(false));
    // Fetch booked tours
    tourApi.getUserBookedTours(user.id)
      .then(res => setBookedTours(res.data))
      .catch(() => setBookedTours([]));
  }, [user]);

  useEffect(() => {
    if (!selected) return;
    let isMounted = true;
    async function fetchStepsAndPlaces() {
      try {
        const res = await tourStepApi.getByTourId(selected.id);
        if (!isMounted) return;
        console.log('Tour steps data:', res.data); // Debug: Check the actual data
        setTourSteps(res.data);
        // Fetch all places for steps
        const placeIds = res.data.map(s => s.place_id);
        const uniqueIds = [...new Set(placeIds)];
        const placeMap = {};
        for (const pid of uniqueIds) {
          if (!places[pid]) {
            const pres = await placeApi.getById(pid);
            placeMap[pid] = pres.data;
          } else {
            placeMap[pid] = places[pid];
          }
        }
        setPlaces(prev => ({ ...prev, ...placeMap }));
      } catch (e) {
        // Optionally handle error
      }
    }
    fetchStepsAndPlaces();
    return () => { isMounted = false; };
  }, [selected]);

  useEffect(() => {
    placeApi.getAll().then(res => setAllPlaces(res.data)).catch(() => setAllPlaces([]));
  }, []);

  useEffect(() => {
    if (showEditModal && selected && tourSteps.length > 0) {
      setEditForm({
        name: selected.name || "",
        description: selected.description || "",
        image_url: selected.image_url || "",
        total_cost: selected.total_cost || "",
        start_time: selected.start_time || "",
        end_time: selected.end_time || "",
        steps: tourSteps.map(s => ({ ...s })),
      });
      setEditError("");
    }
  }, [showEditModal, selected, tourSteps]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditStepFieldChange = (idx, field, value) => {
    setEditForm(prev => {
      const steps = [...prev.steps];
      steps[idx] = { ...steps[idx], [field]: value };
      return { ...prev, steps };
    });
  };

  const handleAddStep = () => {
    setEditForm(prev => ({
      ...prev,
      steps: [
        ...prev.steps,
        { place_id: allPlaces[0]?.id || '', stay_duration: 30, step_order: prev.steps.length + 1 }
      ]
    }));
  };

  const handleRemoveStep = (idx) => {
    setEditForm(prev => {
      const step = prev.steps[idx];
      const steps = prev.steps.filter((_, i) => i !== idx).map((s, i) => ({ ...s, step_order: i + 1 }));
      if (step.id) setRemovedStepIds(ids => [...ids, step.id]);
      return { ...prev, steps };
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update tour info
      const res = await axios.put(`http://localhost:3000/api/tours/${selected.id}`, {
        name: editForm.name,
        description: editForm.description,
        image_url: editForm.image_url,
        total_cost: editForm.total_cost,
      });
      // Update steps
      await Promise.all(editForm.steps.map(s =>
        axios.put(`http://localhost:3000/api/tour-steps/${s.id}`, {
          place_id: s.place_id,
          stay_duration: s.stay_duration,
          step_order: s.step_order,
          start_time: s.start_time,
          end_time: s.end_time,
          day: s.day || 1
        })
      ));
      // Delete removed steps
      await Promise.all(removedStepIds.map(id =>
        axios.delete(`http://localhost:3000/api/tour-steps/${id}`)
      ));
      setTours((prev) =>
        prev.map((t) => (t.id === selected.id ? { ...t, ...res.data } : t))
      );
      setSelected((prev) => ({ ...prev, ...res.data }));
      setTourSteps(editForm.steps);
      setRemovedStepIds([]);
      setShowEditModal(false);
    } catch {
      setEditError("Không thể cập nhật tour hoặc hành trình.");
    }
  };

  const handleEditStepClick = (step) => {
    setStepToEdit(step);
    setEditStepForm({ stay_duration: step.stay_duration });
    setEditStepError("");
    setShowEditStepModal(true);
  };

  const handleEditStepChange = (e) => {
    setEditStepForm({ ...editStepForm, [e.target.name]: e.target.value });
  };

  const handleEditStepSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await tourStepApi.update(stepToEdit.id, {
        ...stepToEdit,
        stay_duration: editStepForm.stay_duration,
        start_time: stepToEdit.start_time,
        end_time: stepToEdit.end_time,
      });
      setTourSteps((prev) =>
        prev.map((s) => (s.id === stepToEdit.id ? { ...s, ...res.data } : s))
      );
      setShowEditStepModal(false);
      setStepToEdit(null);
    } catch {
      setEditStepError("Không thể cập nhật hành trình.");
    }
  };

  const handleDeleteTour = async (tourId) => {
    try {
      await axios.delete(`http://localhost:3000/api/tours/${tourId}`);
      setTours(prev => prev.filter(t => t.id !== tourId));
      setShowTourModal(false);
      setAlertModal({ show: true, message: 'Đã xóa tour thành công!', title: 'Thành công' });
    } catch {
      setAlertModal({ show: true, message: 'Không thể xóa tour.', title: 'Lỗi' });
    }
  };

  // Add handleDeleteBooking function:
  const handleDeleteBooking = async (bookingId) => {
    if (!bookingId) {
      setAlertModal({ show: true, message: 'Không tìm thấy booking để hủy.', title: 'Lỗi' });
      return;
    }
    try {
      const res = await axios.delete(`http://localhost:3000/api/bookings/${bookingId}`);
      if (res.status === 200 && res.data?.message) {
        setBookedTours(prev => prev.filter(t => t.booking?.id !== bookingId));
        setShowTourModal(false);
        setAlertModal({ show: true, message: 'Đã hủy đặt tour thành công!', title: 'Thành công' });
      } else {
        setAlertModal({ show: true, message: 'Không thể hủy đặt tour.', title: 'Lỗi' });
      }
    } catch {
      setAlertModal({ show: true, message: 'Không thể hủy đặt tour.', title: 'Lỗi' });
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-gradient-to-br from-gray-100 to-white luxury-home-container">
      <Header />
      <main className="container px-4 py-4 flex-grow-1">
        <div className="mb-5 d-flex align-items-center gap-3 border-bottom pb-3">
          <h2 className="fw-bold mb-0" style={{color: '#1a5bb8'}}>Tour của tôi</h2>
          <button className="btn btn-main ms-auto d-flex align-items-center gap-2" style={{ borderRadius: 8, fontWeight: 600 }} onClick={() => setShowAddModal(true)}>
            <FaPlusCircle /> Tạo tour mới
            </button>
          </div>
        {/* Add Tour Modal */}
        {showAddModal && (
          <div className="modal fade show" style={{display:'block', background:'rgba(0,0,0,0.25)'}} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content" style={{borderRadius:16, boxShadow:'0 4px 24px #1a5bb822'}}>
                <div className="modal-header">
                  <h5 className="modal-title">Tạo tour mới</h5>
                  <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                </div>
                <div className="modal-body text-center">
                  <p className="mb-4">Bạn muốn tạo tour bằng cách nào?</p>
                  <div className="d-flex flex-column gap-3">
                    <button className="btn btn-main" style={{fontWeight:600, fontSize:'1.1rem'}} onClick={() => { setShowAddModal(false); window.location.href='/ai/generate-tour'; }}>
                      <i className="bi bi-stars me-2"></i>Tạo tour bằng AI
                    </button>
                    <button className="btn btn-outline-primary" style={{fontWeight:600, fontSize:'1.1rem'}} onClick={() => { setShowAddModal(false); window.location.href='/manual-planner'; }}>
                      <i className="bi bi-pencil-square me-2"></i>Tạo tour thủ công
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Delete Tour Modal */}
        {showDeleteModal && tourToDelete && (
          <div className="modal fade show" style={{display:'block', background:'rgba(0,0,0,0.25)'}} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content" style={{borderRadius:16, boxShadow:'0 4px 24px #1a5bb822'}}>
                <div className="modal-header">
                  <h5 className="modal-title">Xác nhận xóa tour</h5>
                  <button type="button" className="btn-close" onClick={() => { setShowDeleteModal(false); setTourToDelete(null); }}></button>
                </div>
                <div className="modal-body text-center">
                  <p>Bạn có chắc muốn xóa tour <b>{tourToDelete.name}</b>?</p>
                  <div className="d-flex justify-content-center gap-3 mt-4">
                    <button className="btn btn-danger" style={{fontWeight:600}} onClick={async () => {
                      try {
                        await axios.delete(`http://localhost:3000/api/tours/${tourToDelete.id}`);
                        setTours(tours.filter(tour => tour.id !== tourToDelete.id));
                        if (selected && selected.id === tourToDelete.id) setSelected(null);
                        setShowDeleteModal(false);
                        setTourToDelete(null);
                      } catch {
                        setDeleteError('Không thể xóa tour.');
                      }
                    }}>
                      Xóa
                    </button>
                    <button className="btn btn-secondary" onClick={() => { setShowDeleteModal(false); setTourToDelete(null); }}>Hủy</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Delete Error Modal */}
        {deleteError && (
          <div className="modal fade show" style={{display:'block', background:'rgba(0,0,0,0.25)'}} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content" style={{borderRadius:16, boxShadow:'0 4px 24px #1a5bb822'}}>
                <div className="modal-header">
                  <h5 className="modal-title text-danger"><i className="bi bi-x-circle-fill me-2"></i>Lỗi</h5>
                  <button type="button" className="btn-close" onClick={() => setDeleteError("")}></button>
                </div>
                <div className="modal-body text-center">
                  <div className="alert alert-danger d-flex align-items-center justify-content-center" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <div>{deleteError}</div>
                  </div>
                  <button className="btn btn-main mt-3" onClick={() => setDeleteError("")}>Đóng</button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Edit Tour Modal */}
        {showEditModal && selected && (
          <div className="modal fade show" style={{display:'block', background:'rgba(0,0,0,0.25)'}} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-xl">
              <div className="modal-content" style={{borderRadius:16, boxShadow:'0 4px 24px #1a5bb822'}}>
                <div className="modal-header">
                  <h5 className="modal-title">Chỉnh sửa tour & hành trình</h5>
                  <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                </div>
                <form onSubmit={handleEditSubmit}>
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Tên tour</label>
                          <input type="text" className="form-control" name="name" value={editForm.name} onChange={handleEditChange} required />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Mô tả</label>
                          <textarea className="form-control" name="description" value={editForm.description} onChange={handleEditChange} rows={4} required />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Ngày bắt đầu</label>
                          <input type="date" className="form-control" name="start_time" value={editForm.start_time} onChange={handleEditChange} />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Ngày kết thúc</label>
                          <input type="date" className="form-control" name="end_time" value={editForm.end_time} onChange={handleEditChange} />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Chi phí (VND)</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            name="total_cost" 
                            value={editForm.total_cost ? parseInt(editForm.total_cost).toLocaleString('vi-VN') : ''} 
                            onChange={(e) => {
                              const rawValue = e.target.value.replace(/\D/g, '');
                              handleEditChange({ target: { name: 'total_cost', value: rawValue } });
                            }} 
                            placeholder="Nhập chi phí dự kiến"
                          />
                          {editForm.total_cost && (
                            <div className="form-text">
                              <i className="fas fa-info-circle me-1"></i>
                              Chi phí: {parseInt(editForm.total_cost).toLocaleString('vi-VN')} VNĐ
                            </div>
                          )}
                          
                          {/* Price Suggestions */}
                          {editForm.total_cost && editForm.total_cost.length > 0 && editForm.total_cost.length <= 3 && !editForm.total_cost.endsWith('000') && (
                            <div className="mt-2">
                              <small className="text-muted">Gợi ý:</small>
                              <div className="d-flex flex-wrap gap-1 mt-1">
                                {(() => {
                                  const inputNum = editForm.total_cost.replace(/\D/g, '');
                                  const suggestions = [
                                    { value: inputNum + '000', label: inputNum + '.000 VNĐ' },
                                    { value: inputNum + '0000', label: inputNum + '0.000 VNĐ' },
                                    { value: inputNum + '00000', label: inputNum + '00.000 VNĐ' },
                                    { value: inputNum + '000000', label: inputNum + '.000.000 VNĐ' },
                                    { value: inputNum + '0000000', label: inputNum + '0.000.000 VNĐ' },
                                  ].filter(s => s.value !== editForm.total_cost);
                                  
                                  return suggestions.map((suggestion, index) => (
                                    <button
                                      key={index}
                                      type="button"
                                      className="btn btn-outline-primary btn-sm"
                                      style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                                      onClick={() => handleEditChange({ target: { name: 'total_cost', value: suggestion.value } })}
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
                      <div className="col-md-6">
                        <label className="form-label">Hành trình</label>
                        <div className="tour-steps-edit-container" style={{maxHeight: '400px', overflowY: 'auto'}}>
                          {editForm.steps && editForm.steps.map((step, idx) => (
                            <div 
                              key={step.id || idx} 
                              className="tour-step-edit-item mb-3 p-3 border rounded"
                              style={{
                                background: '#f8f9fa',
                                cursor: 'grab',
                                transition: 'all 0.2s ease',
                                border: '1px solid #dee2e6'
                              }}
                              draggable
                              onDragStart={(e) => {
                                e.dataTransfer.setData('text/plain', idx);
                                e.currentTarget.style.opacity = '0.5';
                              }}
                              onDragEnd={(e) => {
                                e.currentTarget.style.opacity = '1';
                              }}
                              onDragOver={(e) => {
                                e.preventDefault();
                                e.currentTarget.style.borderColor = '#007bff';
                                e.currentTarget.style.background = '#e3f2fd';
                              }}
                              onDragLeave={(e) => {
                                e.currentTarget.style.borderColor = '#dee2e6';
                                e.currentTarget.style.background = '#f8f9fa';
                              }}
                              onDrop={(e) => {
                                e.preventDefault();
                                const draggedIdx = parseInt(e.dataTransfer.getData('text/plain'));
                                const droppedIdx = idx;
                                
                                if (draggedIdx !== droppedIdx) {
                                  const newSteps = [...editForm.steps];
                                  const draggedStep = newSteps[draggedIdx];
                                  newSteps.splice(draggedIdx, 1);
                                  newSteps.splice(droppedIdx, 0, draggedStep);
                                  
                                  // Update step_order
                                  newSteps.forEach((step, i) => {
                                    step.step_order = i + 1;
                                  });
                                  
                                  setEditForm(prev => ({ ...prev, steps: newSteps }));
                                }
                                
                                e.currentTarget.style.borderColor = '#dee2e6';
                                e.currentTarget.style.background = '#f8f9fa';
                              }}
                            >
                              <div className="d-flex align-items-center gap-2">
                                <div className="step-number" style={{
                                  background: '#007bff',
                                  color: 'white',
                                  borderRadius: '50%',
                                  width: '24px',
                                  height: '24px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.8rem',
                                  fontWeight: 'bold'
                                }}>
                                  {step.step_order}
                                </div>
                                <div className="flex-grow-1">
                                  <select 
                                    className="form-select form-select-sm" 
                                    value={step.place_id} 
                                    onChange={e => handleEditStepFieldChange(idx, 'place_id', e.target.value)}
                                  >
                                    <option value="">Chọn địa điểm...</option>
                                    {allPlaces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                  </select>
                                </div>
                                <div className="d-flex gap-1">
                                  <input 
                                    type="time" 
                                    className="form-control form-control-sm" 
                                    style={{width: '100px'}}
                                    value={step.start_time || ''} 
                                    onChange={e => handleEditStepFieldChange(idx, 'start_time', e.target.value)} 
                                  />
                                  <input 
                                    type="time" 
                                    className="form-control form-control-sm" 
                                    style={{width: '100px'}}
                                    value={step.end_time || ''} 
                                    onChange={e => handleEditStepFieldChange(idx, 'end_time', e.target.value)} 
                                  />
                                  <button 
                                    type="button" 
                                    className="btn btn-outline-danger btn-sm" 
                                    onClick={() => handleRemoveStep(idx)} 
                                    title="Xóa địa điểm"
                                  >
                                    <i className="bi bi-trash"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <button type="button" className="btn btn-outline-success btn-sm mt-2" onClick={handleAddStep}>
                          <i className="bi bi-plus"></i> Thêm địa điểm
                        </button>
                      </div>
                    </div>
                    {editError && <div className="text-danger mb-2">{editError}</div>}
                  </div>
                  <div className="modal-footer">
                    <button type="submit" className="btn btn-primary">Lưu</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Hủy</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        {/* Created/Cloned Tours Section */}
        <section className="mb-5">
                {loading ? (
            <div className="d-flex justify-content-center align-items-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                  </div>
                ) : tours.length === 0 ? (
            <div className="text-center text-muted py-5">
              <i className="bi bi-inbox" style={{fontSize: '3rem'}}></i>
              <div className="fw-bold mb-1">Bạn chưa tạo tour nào.</div>
              <button className="btn btn-main mt-3" onClick={() => setShowAddModal(true)}><FaPlusCircle /> Tạo tour mới</button>
            </div>
          ) : (
            <div className="row g-4">
              {tours.map(tour => {
                // Find first step and its place
                const steps = tourSteps && tour.id === selected?.id ? tourSteps : [];
                const firstStep = steps[0];
                const firstPlace = firstStep ? places[firstStep.place_id] : null;
                const cardImg = firstPlace?.image_url
                  ? (firstPlace.image_url.startsWith('http') ? firstPlace.image_url : `http://localhost:3000${firstPlace.image_url}`)
                  : (tour.image_url ? (tour.image_url.startsWith('http') ? tour.image_url : `http://localhost:3000${tour.image_url}`) : null);
                return (
                  <div className="col-12 col-md-6 col-lg-4" key={tour.id}>
                    <div
                      className="card h-100 shadow border-0 rounded-4 luxury-card"
                      style={{ cursor: 'pointer' }}
                      onClick={async () => {
                        setModalTour(tour);
                        setShowTourModal(true);
                        // Fetch steps and places for this tour
                        try {
                          const res = await tourStepApi.getByTourId(tour.id);
                          setModalSteps(res.data);
                          // Fetch all places for steps
                          const placeIds = res.data.map(s => s.place_id);
                          const uniqueIds = [...new Set(placeIds)];
                          const placeMap = {};
                          for (const pid of uniqueIds) {
                            const pres = await placeApi.getById(pid);
                            placeMap[pid] = pres.data;
                          }
                          setModalPlaces(placeMap);
                        } catch {
                          setModalSteps([]);
                          setModalPlaces({});
                        }
                      }}
                    >
                      {cardImg ? (
                        <img
                          src={cardImg}
                          alt={tour.name}
                          className="card-img-top luxury-img-top"
                          style={{ height: 220, objectFit: "cover", borderTopLeftRadius: "1.5rem", borderTopRightRadius: "1.5rem" }}
                        />
                      ) : (
                        <div className="card-img-top luxury-img-top d-flex align-items-center justify-content-center"
                          style={{ height: 220, borderTopLeftRadius: "1.5rem", borderTopRightRadius: "1.5rem", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", fontSize: "3rem" }}>
                          <i className="bi bi-map"></i>
                        </div>
                      )}
                      <div className="card-body luxury-card-body">
                        <h3 className="card-title mb-2" style={{ fontWeight: 600 }}>{tour.name}</h3>
                        <p className="card-text text-muted mb-2 luxury-desc">
                          {tour.description ? `${tour.description.replace(/<[^>]+>/g, '').substring(0, 100)}...` : ''}
                        </p>
                        <div className="mb-2">
                          <span className="luxury-star" style={{ color: '#f1c40f', fontSize: 18 }}>★</span>
                          <span style={{ fontWeight: 600, marginLeft: 4 }}>{tour.rating ? tour.rating.toFixed(1) : '0.0'}</span>
                          <span style={{ color: '#888', marginLeft: 2 }}>/ 5</span>
                        </div>
                        {tour.total_cost && (
                          <p className="card-text text-muted small mb-2 luxury-rating">
                            <span className="luxury-money"><i className="bi bi-currency-exchange"></i></span> {tour.total_cost} VND
                          </p>
                        )}
                        <button className="btn btn-main btn-sm flex-fill me-2" onClick={e => { e.stopPropagation(); setSelected(tour); setShowEditModal(true); }}>Sửa</button>
                        <button className="btn btn-danger btn-sm flex-fill" onClick={e => { e.stopPropagation(); setConfirmModal({ show: true, message: 'Bạn có chắc muốn xóa tour này?', onConfirm: () => handleDeleteTour(tour.id) }); }}>Xóa</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
        {/* Booked Tours Section */}
        <section className="mb-5">
          <div className="d-flex align-items-center mb-3 gap-2">
            <h4 className="fw-bold mb-0 luxury-section-title">Tour bạn đã đặt</h4>
          </div>
          {bookedTours.length === 0 ? (
            <div className="text-center text-muted py-5">
              <i className="bi bi-calendar-x" style={{fontSize: '3rem'}}></i>
              <div className="fw-bold mb-1">Bạn chưa đặt tour nào.</div>
            </div>
          ) : (
            <div className="row g-4">
              {bookedTours.map(tour => (
                <div className="col-12 col-md-6 col-lg-4" key={tour.id}>
                  <div className="card h-100 shadow border-0 rounded-4 luxury-card">
                    <Link to={`/tours/${tour.id}`} className="text-decoration-none" style={{display:'block'}}>
                      {tour.image_url ? (
                        <img
                          src={tour.image_url.startsWith('http') ? tour.image_url : `http://localhost:3000${tour.image_url}`}
                          alt={tour.name}
                          className="card-img-top luxury-img-top"
                          style={{ height: 220, objectFit: "cover", borderTopLeftRadius: "1.5rem", borderTopRightRadius: "1.5rem" }}
                        />
                      ) : (
                        <div className="card-img-top luxury-img-top d-flex align-items-center justify-content-center"
                          style={{ height: 220, borderTopLeftRadius: "1.5rem", borderTopRightRadius: "1.5rem", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", fontSize: "3rem" }}>
                          <i className="bi bi-map"></i>
                        </div>
                      )}
                      <div className="card-body luxury-card-body">
                        <h3 className="card-title mb-2" style={{ fontWeight: 600 }}>{tour.name}</h3>
                        <p className="card-text text-muted mb-2 luxury-desc">
                          {tour.description ? `${tour.description.replace(/<[^>]+>/g, '').substring(0, 100)}...` : ''}
                        </p>
                        <div className="mb-2">
                          <span className="luxury-star" style={{ color: '#f1c40f', fontSize: 18 }}>★</span>
                          <span style={{ fontWeight: 600, marginLeft: 4 }}>{tour.rating ? tour.rating.toFixed(1) : '0.0'}</span>
                          <span style={{ color: '#888', marginLeft: 2 }}>/ 5</span>
                        </div>
                        {tour.total_cost && (
                          <p className="card-text text-muted small mb-0 luxury-rating">
                            <span className="luxury-money">💰</span> {tour.total_cost} VND
                          </p>
                        )}
                        {/* Show spots and total_price if available */}
                        {tour.booking && (
                          <>
                            <div className="text-muted small mb-1">Số lượng khách: <b>{tour.booking.spots}</b></div>
                            <div className="text-muted small mb-2">Tổng giá: <b>{tour.booking.total_price?.toLocaleString('vi-VN')} VND</b></div>
                          </>
                        )}
                      </div>
                    </Link>
                    <div className="px-3 pb-3 d-flex gap-2">
                      <button
                        className="btn btn-outline-danger btn-sm flex-fill"
                        disabled={!tour.booking?.id}
                        onClick={e => {
                          e.stopPropagation();
                          if (tour.booking?.id) {
                            setConfirmModal({ show: true, message: 'Bạn có chắc muốn hủy đặt tour này?', onConfirm: () => handleDeleteBooking(tour.booking.id) });
                          }
                        }}
                      >
                        Hủy đặt
                      </button>
                    </div>
                  </div>
              </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
      <Modal show={showTourModal} onHide={() => setShowTourModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalTour?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalTour?.image_url && (
            <img
              src={modalTour.image_url.startsWith('http') ? modalTour.image_url : `http://localhost:3000${modalTour.image_url}`}
              alt={modalTour.name}
              className="img-fluid rounded mb-3"
              style={{ maxHeight: 200, objectFit: 'cover', width: '100%' }}
            />
          )}
          <p>{modalTour?.description}</p>
          <div className="mb-2">
            <span className="badge bg-info text-dark me-2">
              {modalTour?.start_time ? new Date(modalTour.start_time).toLocaleDateString() : '--'} → {modalTour?.end_time ? new Date(modalTour.end_time).toLocaleDateString() : '--'}
                  </span>
            <span className="badge bg-light text-dark"><i className="bi bi-currency-exchange"></i> {modalTour?.total_cost?.toLocaleString('vi-VN')} VND</span>
            </div>
          {modalSteps.length > 0 && (
            <div className="mt-4">
              <h6 className="fw-bold mb-3">Hành trình chi tiết</h6>
              <div className="list-group">
                {modalSteps.map((step, idx) => {
                  const place = modalPlaces[step.place_id];
                            return (
                    <div key={step.id || idx} className="list-group-item d-flex align-items-center gap-3 py-3" style={{borderLeft: '4px solid #1a5bb8', background: '#f8f9fa', borderRadius: 12, marginBottom: 8, boxShadow: '0 2px 8px #b6e0fe22'}}>
                      {place?.image_url && (
                        <img
                          src={place.image_url.startsWith('http') ? place.image_url : `http://localhost:3000${place.image_url}`}
                          alt={place.name}
                          style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 12, boxShadow: '0 2px 8px #b6e0fe33', flexShrink: 0 }}
                        />
                      )}
                      <div className="flex-grow-1">
                        <div className="fw-bold mb-1" style={{color: '#1a5bb8', fontSize: '1.1em'}}>
                          <Link to={`/places/${place?.id}`} className="text-decoration-none" style={{color: '#1a5bb8'}} target="_blank" rel="noopener noreferrer">
                                  {place?.name || `Địa điểm #${step.place_id}`}
                          </Link>
                                </div>
                        <div className="small text-muted mb-1" style={{fontStyle: 'italic'}}>
                          {place?.description ? `${place.description.replace(/<[^>]+>/g, '').slice(0, 100)}${place.description.length > 100 ? '...' : ''}` : 'Chưa có mô tả'}
                              </div>
                        <div className="d-flex gap-2 flex-wrap align-items-center mt-1">
                          {step.start_time && <span className="badge bg-success"><i className="bi bi-play me-1"></i>Bắt đầu: {step.start_time}</span>}
                          {step.end_time && <span className="badge bg-info"><i className="bi bi-stop me-1"></i>Kết thúc: {step.end_time}</span>}
                        </div>
                      </div>
                </div>
                  );
                })}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-main" onClick={() => setShowTourModal(false)}>Đóng</Button>
          <Button className="btn btn-danger" onClick={() => { setShowEditModal(true); setSelected(modalTour); setShowTourModal(false); }}>Sửa</Button>
          {/* Add more actions as needed */}
        </Modal.Footer>
      </Modal>
      <CustomAlertModal show={alertModal.show} title={alertModal.title} message={alertModal.message} onClose={() => setAlertModal({ show: false, message: '', title: '' })} />
      <CustomConfirmModal show={confirmModal.show} message={confirmModal.message} onClose={() => setConfirmModal({ show: false, message: '', onConfirm: null })} onConfirm={() => { if (confirmModal.onConfirm) confirmModal.onConfirm(); setConfirmModal({ show: false, message: '', onConfirm: null }); }} />
    </div>
  );
}

export default MyTours;
