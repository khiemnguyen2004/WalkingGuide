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
      <Navbar activePage="mytours" />
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
                          <label className="form-label">Ảnh (URL)</label>
                          <input type="text" className="form-control" name="image_url" value={editForm.image_url} onChange={handleEditChange} />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Chi phí (VND)</label>
                          <input type="number" className="form-control" name="total_cost" value={editForm.total_cost} onChange={handleEditChange} min={0} />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Hành trình</label>
                        <ol className="mb-0" style={{fontSize:'1.08rem'}}>
                          {editForm.steps && editForm.steps.map((step, idx) => (
                            <li key={step.id || idx} className="mb-3 d-flex align-items-center gap-2">
                              <select className="form-select" style={{width:180}} value={step.place_id} onChange={e => handleEditStepFieldChange(idx, 'place_id', e.target.value)}>
                                {allPlaces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                              </select>
                              <input type="number" className="form-control" style={{width:120}} min={1} value={step.stay_duration} onChange={e => handleEditStepFieldChange(idx, 'stay_duration', e.target.value)} />
                              <span>phút</span>
                              <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleRemoveStep(idx)} title="Xóa địa điểm"><i className="bi bi-x"></i></button>
                            </li>
                          ))}
                        </ol>
                        <button type="button" className="btn btn-outline-success btn-sm mt-2" onClick={handleAddStep}><i className="bi bi-plus"></i> Thêm địa điểm</button>
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
              <h1 className="text-3xl font-bold text-center mb-0" style={{color:'rgb(26, 91, 184)'}}>{selected.name}</h1>
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
              <span>Chi phí: <b>{selected.total_cost} VND</b></span>
              {selected.created_at && <span>Ngày tạo: {new Date(selected.created_at).toLocaleDateString()}</span>}
                </div>
                <div className="prose prose-lg mb-4" style={{ color: 'rgb(26, 91, 184)', fontSize: '1.15rem', lineHeight: 1.7 }}>
                  <div dangerouslySetInnerHTML={{ __html: selected.description }} />
                </div>

                {/* Journey Section */}
                {tourSteps && tourSteps.length > 0 && (
                  <div className="mt-3 luxury-journey-card">
                    <h5 className="mb-3" style={{fontWeight:700, color:'#1a5bb8'}}>Hành trình của bạn</h5>
                    {/* Place Images Row */}
                    <div className="d-flex gap-3 mb-3 flex-wrap">
                      {tourSteps
                        .sort((a, b) => a.step_order - b.step_order)
                        .map((step) => (
                          <div key={step.id} className="text-center">
                            <img
                              src={places[step.place_id]?.image_url || "/default-place.jpg"}
                              alt={places[step.place_id]?.name || `Địa điểm #${step.place_id}`}
                              style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 12, boxShadow: "0 2px 8px #b6e0fe33" }}
                            />
                            <div className="small mt-1" style={{maxWidth: 80, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color:'#1a1a1a'}}>
                              {places[step.place_id]?.name || `Địa điểm #${step.place_id}`}
                            </div>
                          </div>
                        ))}
                    </div>
                    {/* Journey List */}
                    <ol className="mb-0" style={{fontSize:'1.08rem', color:'#1a1a1a'}}>
                      {tourSteps.sort((a, b) => a.step_order - b.step_order).map((step) => (
                        <li key={step.id} className="mb-2 d-flex align-items-center justify-content-between">
                          <span>
                            <Link to={places[step.place_id] ? `/places/${places[step.place_id].id}` : '#'} style={{ fontWeight: 'bold', textDecoration: 'none', color: '#1a5bb8', cursor: 'pointer' }}>
                              {places[step.place_id]?.name || `Địa điểm #${step.place_id}`}
                            </Link> <span className="text-muted" style={{color:'#888'}}>(ở lại {step.stay_duration} phút)</span>
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
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
