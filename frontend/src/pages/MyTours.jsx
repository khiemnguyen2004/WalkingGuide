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

  useEffect(() => {
    if (!user) return;
    axios.get(`http://localhost:3000/api/tours/user/${user.id}`)
      .then(res => {
        setTours(res.data);
        if (res.data.length > 0) setSelected(res.data[0]);
      })
      .catch(() => setError("Không thể tải danh sách tour."))
      .finally(() => setLoading(false));
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

  return (
    <div className="min-vh-100 d-flex flex-column bg-gradient-to-br from-gray-100 to-white luxury-home-container">
      <Header />
      <main className="container px-4 py-4 flex-grow-1">
        <section className="mb-5">
          <div className="d-flex align-items-center mb-4" style={{background: 'linear-gradient(90deg, #b6e0fe 0%, #5b9df9 100%)', borderRadius: '1.5rem', padding: '1.5rem 2rem', boxShadow: '0 4px 24px 0 rgba(31, 38, 135, 0.10)'}}>
            <i className="bi bi-person-walking text-primary" style={{fontSize: 38, marginRight: 18}}></i>
            <div>
              <h2 className="h3 fw-bold mb-1" style={{color: '#1a5bb8'}}>Tour của tôi</h2>
              <div className="text-muted" style={{fontSize: '1.08rem'}}>Danh sách các tour bạn đã tạo hoặc tham gia</div>
            </div>
            <button
              className="btn btn-primary ms-auto"
              style={{ borderRadius: 8, fontWeight: 600 }}
              onClick={() => setShowAddModal(true)}
            >
              <i className="bi bi-plus-circle me-2"></i>Thêm tour
            </button>
          </div>
        </section>
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
                  <h5 className="modal-title">Lỗi</h5>
                  <button type="button" className="btn-close" onClick={() => setDeleteError("")}></button>
                </div>
                <div className="modal-body text-center">
                  <p>{deleteError}</p>
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
        <section className="cards-section mb-6">
          <div className="row g-4">
            <div className="col-12 col-lg-4">
              <div className="list-group">
                {loading ? (
                  <div className="text-muted">Đang tải...</div>
                ) : error ? (
                  <div className="text-danger">{error}</div>
                ) : tours.length === 0 ? (
                  <div className="text-muted">Bạn chưa có tour nào.</div>
                ) : (
                  tours.map(t => (
                    <div key={t.id} className="d-flex align-items-center mb-2">
                      <button
                        className={`list-group-item list-group-item-action flex-grow-1${selected && selected.id === t.id ? ' active' : ''}`}
                        style={{borderRadius: 12, fontWeight: 600, fontSize: '1.08rem'}}
                        onClick={() => setSelected(t)}
                      >
                        {t.name}
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm ms-2"
                        style={{borderRadius: 8}}
                        onClick={(e) => {
                          e.stopPropagation();
                          setTourToDelete(t);
                          setShowDeleteModal(true);
                        }}
                        title="Xóa tour"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="col-12 col-lg-8">
        {selected && (
          <div className="card shadow-lg border-0 rounded-4 p-4 mb-4" style={{background: 'rgba(255,255,255,0.97)', color: '#1a1a1a'}}>
            {/* Tour Image */}
            {selected.image_url && (
              <div className="d-flex justify-content-center mb-4">
                <img
                  src={selected.image_url.startsWith('http') ? selected.image_url : `http://localhost:3000${selected.image_url}`}
                  alt={selected.name}
                  style={{ maxWidth: '420px', maxHeight: '260px', width: '100%', objectFit: 'cover', borderRadius: '1rem', boxShadow: '0 2px 12px #b6e0fe55' }}
                />
              </div>
            )}

            {/* Card Header with Edit Button */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="card-title mb-2 fw-bold luxury-section-title">
                {selected.name}
                {selected.start_time && selected.end_time && (
                  <span className="badge bg-info ms-2" style={{fontSize: '0.95em', fontWeight: 500}}>
                    {new Date(selected.start_time).toLocaleDateString()} → {new Date(selected.end_time).toLocaleDateString()}
                  </span>
                )}
              </h5>
              <button
                className="btn btn-outline-primary ms-2"
                style={{ borderRadius: 8 }}
                onClick={() => setShowEditModal(true)}
                title="Chỉnh sửa tour"
              >
                <i className="bi bi-pencil-square"></i> Sửa
              </button>
            </div>

            {/* Tour Info */}
            <div className="mb-4 d-flex flex-wrap gap-4 justify-content-center" style={{ fontSize: '1.05rem', color: 'rgb(26, 91, 184)' }}>
              <span>Chi phí: <b>{selected.total_cost.toLocaleString('vi-VN')} VND</b></span>
              {selected.created_at && <span>Ngày tạo: {new Date(selected.created_at).toLocaleDateString()}</span>}

                </div>
                <div className="prose prose-lg mb-4" style={{ color: 'rgb(26, 91, 184)', fontSize: '1.15rem', lineHeight: 1.7 }}>
                  <div dangerouslySetInnerHTML={{ __html: selected.description }} />
                </div>

                {/* Day summary */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-3 luxury-section-title">Tổng quan theo ngày:</h6>
                  <div className="row g-3">
                    {(() => {
                      // Group steps by day
                      const stepsByDay = tourSteps.reduce((acc, step) => {
                        const day = step.day || 1;
                        if (!acc[day]) acc[day] = [];
                        acc[day].push(step);
                        return acc;
                      }, {});
                      const sortedDays = Object.keys(stepsByDay).sort((a, b) => parseInt(a) - parseInt(b));
                      return sortedDays.map(dayNum => (
                        <div key={dayNum} className="col-md-6 col-lg-4">
                          <div className="card h-100" style={{borderRadius: '12px', boxShadow: '0 2px 8px rgba(26, 91, 184, 0.1)'}}>
                            <div className="card-header text-center text-white fw-bold" style={{borderRadius: '12px 12px 0 0', background: 'linear-gradient(120deg, #b6e0fe 0%, #5b9df9 100%)'}}>
                              Ngày {dayNum}
                            </div>
                            <div className="card-body p-3">
                              <div className="small">
                                {stepsByDay[dayNum]
                                  .sort((a, b) => a.step_order - b.step_order)
                                  .map((step, idx) => (
                                    <div key={step.id} className="d-flex align-items-center mb-2">
                                      <span className="badge bg-light text-dark me-2" style={{fontSize: '0.75em'}}>
                                        {step.step_order}
                                      </span>
                                      <span className="text-truncate" style={{fontSize: '0.9em'}}>
                                        {places[step.place_id]?.name || 'Địa điểm'}
                                      </span>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
                {/* Place Images Row */}
                <div className="mb-4">
                  {(() => {
                    // Group steps by day for journey list as well
                    const stepsByDay = tourSteps.reduce((acc, step) => {
                      const day = step.day || 1;
                      if (!acc[day]) acc[day] = [];
                      acc[day].push(step);
                      return acc;
                    }, {});
                    const sortedDays = Object.keys(stepsByDay).sort((a, b) => parseInt(a) - parseInt(b));
                    return sortedDays.map(dayNum => (
                      <div key={dayNum} className="mb-4">
                        <h6 className="fw-bold mb-3 text-secondary border-bottom pb-2">
                          <i className="bi bi-calendar-day me-2"></i>Ngày {dayNum}
                        </h6>
                        <div className="d-flex gap-3 flex-wrap">
                          {stepsByDay[dayNum].sort((a, b) => a.step_order - b.step_order).map((step) => {
                            const place = places[step.place_id];
                            const imageUrl = place?.image_url 
                              ? (place.image_url.startsWith('http') 
                                  ? place.image_url 
                                  : `http://localhost:3000${place.image_url}`)
                              : "/default-place.jpg";
                            
                            return (
                            <div key={step.id} className="text-center">
                              <img
                                  src={imageUrl}
                                  alt={place?.name || `Địa điểm #${step.place_id}`}
                                style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 12, boxShadow: "0 2px 8px #b6e0fe33" }}
                                  onError={(e) => {
                                    e.target.src = "/default-place.jpg";
                                  }}
                              />
                              <div className="small mt-2" style={{maxWidth: 100, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color:'#1a1a1a', fontWeight: '500'}}>
                                  {place?.name || `Địa điểm #${step.place_id}`}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
                {/* Journey List */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-3 luxury-section-title">Chi tiết hành trình:</h6>
                  <div className="list-group">
                    {(() => {
                      const stepsByDay = tourSteps.reduce((acc, step) => {
                        const day = step.day || 1;
                        if (!acc[day]) acc[day] = [];
                        acc[day].push(step);
                        return acc;
                      }, {});
                      const sortedDays = Object.keys(stepsByDay).sort((a, b) => parseInt(a) - parseInt(b));
                      return sortedDays.map(dayNum => (
                        <React.Fragment key={dayNum}>
                          <div className="list-group-item text-white fw-bold text-center" style={{borderRadius: '8px 8px 0 0', fontSize: '1.1em', background: 'linear-gradient(120deg, #b6e0fe 0%, #5b9df9 100%)'}}>
                            <i className="bi bi-calendar-day me-2"></i>Ngày {dayNum}
                          </div>
                          {stepsByDay[dayNum].sort((a, b) => a.step_order - b.step_order).map((step, idx) => (
                            <div key={step.id || idx} className="list-group-item d-flex align-items-center justify-content-between border-start border-end" style={{borderLeft: '4px solid #1a5bb8'}}>
                              <div className="d-flex align-items-center">
                                <span className="badge bg-primary me-3" style={{fontSize: '1em', minWidth: '2rem'}}>
                                  {step.step_order}
                                </span>
                                <div>
                                  <div className="fw-bold" style={{color: '#1a5bb8'}}>
                                    {places[step.place_id]?.name || 'Địa điểm'}
                                  </div>
                                  <div className="small text-muted">
                                    {step.stay_duration} phút
                                  </div>
                                </div>
                              </div>
                              <div className="d-flex gap-2">
                                {step.start_time && (
                                  <span className="badge bg-success" style={{fontSize: '0.85em'}}>
                                    <i className="bi bi-play me-1"></i>{step.start_time}
                                  </span>
                                )}
                                {step.end_time && (
                                  <span className="badge bg-info" style={{fontSize: '0.85em'}}>
                                    <i className="bi bi-stop me-1"></i>{step.end_time}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                          {dayNum < sortedDays[sortedDays.length - 1] && (
                            <div className="text-center py-2" style={{background: '#f8f9fa', borderLeft: '4px solid #dee2e6', marginLeft: '1.75rem', marginRight: '1rem'}}>
                              <i className="bi bi-arrow-down text-muted"></i>
                            </div>
                          )}
                        </React.Fragment>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default MyTours;
