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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tourToDelete, setTourToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [tourSteps, setTourSteps] = useState([]); // steps for selected tour
  const [places, setPlaces] = useState({}); // { [placeId]: placeObj }

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

  // Fetch steps and places when selected tour changes
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
                <div className="card shadow-lg border-0 rounded-4 p-4 mb-4" style={{background: 'rgba(255,255,255,0.97)'}}>
                  <h1 className="text-3xl font-bold mb-4 text-gray-800 text-center">{selected.name}</h1>
                  {selected.image_url && (
                    <div className="d-flex justify-content-center mb-4">
                      <img
                        src={selected.image_url.startsWith('http') ? selected.image_url : `http://localhost:3000${selected.image_url}`}
                        alt={selected.name}
                        style={{ maxWidth: '420px', maxHeight: '260px', width: '100%', objectFit: 'cover', borderRadius: '1rem', boxShadow: '0 2px 12px #b6e0fe55' }}
                      />
                    </div>
                  )}
                  <div className="text-gray-600 mb-4 d-flex flex-wrap gap-4 justify-content-center" style={{ fontSize: '1.05rem' }}>
                    <span>Chi phí: <b>{selected.total_cost} VND</b></span>
                    {selected.created_at && <span>Ngày tạo: {new Date(selected.created_at).toLocaleDateString()}</span>}
                  </div>
                  <div className="prose prose-lg mb-4" style={{ color: '#223a5f', fontSize: '1.15rem', lineHeight: 1.7 }}>
                    <div dangerouslySetInnerHTML={{ __html: selected.description }} />
                  </div>
                  {/* Optionally, show steps or other details here */}
                  {tourSteps && tourSteps.length > 0 && (
                    <div className="mt-3 luxury-journey-card">
                      <h5 className="mb-3 text-primary" style={{fontWeight:700}}>Hành trình của bạn</h5>
                      <ol className="mb-0" style={{fontSize:'1.08rem'}}>
                        {tourSteps.sort((a, b) => a.step_order - b.step_order).map((step, idx) => (
                          <li key={step.id} className="mb-2">
                            <b>{places[step.place_id]?.name || `Địa điểm #${step.place_id}`}</b> <span className="text-muted">(ở lại {step.stay_duration} phút)</span>
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
