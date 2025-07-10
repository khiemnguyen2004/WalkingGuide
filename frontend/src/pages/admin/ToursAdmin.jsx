import React, { useEffect, useState, useContext } from "react";
import AdminHeader from "../../components/AdminHeader.jsx";
import AdminSidebar from "../../components/AdminSidebar.jsx";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext.jsx";
import CKEditorField from "../../components/CKEditorField";
import placeApi from "../../api/placeApi";
import tourStepApi from "../../api/tourStepApi";

function ToursAdmin() {
  const { user } = useContext(AuthContext);
  const [tours, setTours] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [editId, setEditId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [allPlaces, setAllPlaces] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [tourStepsMap, setTourStepsMap] = useState({});
  const [selectedSteps, setSelectedSteps] = useState({});
  const [totalCost, setTotalCost] = useState(0);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('danger');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tourToDelete, setTourToDelete] = useState(null);

  useEffect(() => {
    fetchTours();
    placeApi.getAll().then(res => setAllPlaces(res.data)).catch(() => setAllPlaces([]));
  }, []);

  const fetchTours = async () => {
    const res = await axios.get("http://localhost:3000/api/tours");
    setTours(res.data);
    // Fetch steps for all tours
    const stepsMap = {};
    await Promise.all(
      res.data.map(async (tour) => {
        try {
          const stepsRes = await tourStepApi.getByTourId(tour.id);
          stepsMap[tour.id] = stepsRes.data;
        } catch {
          stepsMap[tour.id] = [];
        }
      })
    );
    setTourStepsMap(stepsMap);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post('http://localhost:3000/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.url;
  };

  const handleAddPlace = (placeId) => {
    if (!selectedPlaces.includes(placeId)) {
      setSelectedPlaces([...selectedPlaces, placeId]);
      setSelectedSteps(prev => ({
        ...prev,
        [placeId]: { day: 1, stay_duration: 60, start_time: '', end_time: '' }
      }));
    }
  };

  const handleRemovePlace = (placeId) => {
    setSelectedPlaces(selectedPlaces.filter(id => id !== placeId));
    setSelectedSteps(prev => {
      const copy = { ...prev };
      delete copy[placeId];
      return copy;
    });
  };

  const handleStepChange = (placeId, field, value) => {
    setSelectedSteps(prev => ({
      ...prev,
      [placeId]: { ...prev[placeId], [field]: value }
    }));
  };

  const handleMovePlace = (index, direction) => {
    const newArr = [...selectedPlaces];
    const target = newArr[index];
    newArr.splice(index, 1);
    newArr.splice(index + direction, 0, target);
    setSelectedPlaces(newArr);
  };

  const handleCreate = async () => {
    if (!user) {
      setAlertMessage('Bạn cần đăng nhập để tạo tour.');
      setAlertType('warning');
      setShowAlert(true);
      return;
    }
    setIsUploading(true);
    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      const steps = selectedPlaces.map((placeId, idx) => ({
        place_id: placeId,
        step_order: idx + 1,
        day: selectedSteps[placeId]?.day || 1,
        stay_duration: Number(selectedSteps[placeId]?.stay_duration) || 60,
      }));
      await axios.post("http://localhost:3000/api/tours", {
        name,
        description,
        image_url: imageUrl,
        user_id: user.id,
        total_cost: parseFloat(totalCost) || 0,
        steps,
      });
      fetchTours();
      setName("");
      setDescription("");
      setImageFile(null);
      setImagePreview("");
      setSelectedPlaces([]);
      setSelectedSteps({});
      setTotalCost(0);
      setStartTime("");
      setEndTime("");
    } catch (error) {
      console.error("Error creating tour:", error);
      setAlertMessage('Có lỗi xảy ra khi tạo tour');
      setAlertType('danger');
      setShowAlert(true);
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (tour) => {
    setEditId(tour.id);
    setName(tour.name);
    setDescription(tour.description);
    setImageFile(null);
    setImagePreview(tour.image_url || "");
    setTotalCost(tour.total_cost ? tour.total_cost.toString() : "0");
    // Load current stops for editing
    const steps = tourStepsMap[tour.id] || [];
    setSelectedPlaces(steps.sort((a, b) => a.step_order - b.step_order).map(s => s.place_id));
    const stepsObj = {};
    steps.forEach(s => {
      stepsObj[s.place_id] = {
        day: s.day || 1,
        stay_duration: s.stay_duration || 60,
      };
    });
    setSelectedSteps(stepsObj);
    // Scroll to top of the page to show the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdate = async () => {
    setIsUploading(true);
    try {
      let imageUrl = imagePreview;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      // Send updated steps
      const steps = selectedPlaces.map((placeId, idx) => ({
        place_id: placeId,
        step_order: idx + 1,
        day: selectedSteps[placeId]?.day || 1,
        stay_duration: Number(selectedSteps[placeId]?.stay_duration) || 60,
      }));
      await axios.put(`http://localhost:3000/api/tours/${editId}`, {
        name,
        description,
        image_url: imageUrl,
        total_cost: parseFloat(totalCost) || 0,
        steps,
      });
      fetchTours();
      setEditId(null);
      setName("");
      setDescription("");
      setImageFile(null);
      setImagePreview("");
      setSelectedPlaces([]);
      setSelectedSteps({});
      setTotalCost(0);
      setStartTime("");
      setEndTime("");
    } catch (error) {
      console.error("Error updating tour:", error);
      setAlertMessage('Có lỗi xảy ra khi cập nhật tour');
      setAlertType('danger');
      setShowAlert(true);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (id) => {
    setTourToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!tourToDelete) return;
    
    try {
      await axios.delete(`http://localhost:3000/api/tours/${tourToDelete}`);
      fetchTours();
      setShowDeleteModal(false);
      setTourToDelete(null);
    } catch (error) {
      console.error('Error deleting tour:', error);
      setAlertMessage('Có lỗi xảy ra khi xóa tour');
      setAlertType('danger');
      setShowAlert(true);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTourToDelete(null);
  };

  const clearForm = () => {
    setEditId(null);
    setName("");
    setDescription("");
    setImageFile(null);
    setImagePreview("");
    setTotalCost("0");
  };

  return (
    <div className="min-vh-100 d-flex flex-row" style={{ background: "#f6f8fa" }}>
      <AdminSidebar alwaysExpanded />
      <div
        className="flex-grow-1 d-flex flex-column admin-dashboard"
        style={{
          marginLeft: 220,
          minHeight: "100vh",
          padding: 0,
          background: "#f6f8fa",
        }}
      >
        <AdminHeader />
        <main
          className="flex-grow-1"
          style={{
            padding: 0,
            maxWidth: "100%",
            width: "100%",
            margin: 0,
          }}
        >
          <div className="admin-dashboard-cards-row">
            <div className="container py-4">
              <h2>Quản lý tour</h2>

              {/* Alert Component */}
              {showAlert && (
                <div className={`alert alert-${alertType} alert-dismissible fade show`} role="alert">
                  <i className={`bi ${alertType === 'danger' ? 'bi-exclamation-triangle-fill' : 'bi-exclamation-circle-fill'} me-2`}></i>
                  {alertMessage}
                  <button type="button" className="btn-close" onClick={() => setShowAlert(false)}></button>
                </div>
              )}

              <div className="mb-3">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-control mb-2"
                  placeholder="Tên tour"
                />
                
                <div className="mb-2">
                  <label className="form-label">Hình ảnh tour</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="form-control"
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img 
                        src={imagePreview.startsWith('data:') ? imagePreview : `http://localhost:3000${imagePreview}`} 
                        alt="Preview" 
                        style={{ 
                          maxWidth: '200px', 
                          maxHeight: '150px', 
                         objectFit: 'cover',
                          borderRadius: '8px',
                          border: '1px solid #ddd'
                        }} 
                      />
                    </div>
                  )}
                </div>

                <CKEditorField
                  value={description}
                  onChange={setDescription}
                  placeholder="Mô tả"
                />
                
                <div className="mb-3">
                  <label className="form-label fw-semibold">Tổng chi phí (VND):</label>
                  <input
                    type="text"
                    value={totalCost ? parseInt(totalCost).toLocaleString('vi-VN') : ''}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\D/g, '');
                      setTotalCost(rawValue);
                    }}
                    className="form-control"
                    placeholder="Nhập tổng chi phí tour"
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
                
                <div className="mb-3">
                  <label className="form-label fw-semibold">Chọn các địa điểm cho tour (kéo để sắp xếp):</label>
                  <div className="d-flex flex-wrap gap-2 mb-2">
                    {allPlaces.map(place => (
                      <button
                        key={place.id}
                        type="button"
                        className={`btn btn-sm ${selectedPlaces.includes(place.id) ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => handleAddPlace(place.id)}
                        disabled={selectedPlaces.includes(place.id)}
                      >
                        {place.name}
                      </button>
                    ))}
                  </div>
                  {selectedPlaces.length > 0 && (
                    <ul className="list-group">
                      {selectedPlaces.map((placeId, idx) => {
                        const place = allPlaces.find(p => p.id === placeId);
                        const step = selectedSteps[placeId] || {};
                        return (
                          <li key={placeId} className="list-group-item d-flex align-items-center justify-content-between flex-wrap gap-2">
                            <span>{place ? place.name : placeId}</span>
                            {/* Day select dropdown, dynamic days */}
                            <select
                              className="form-select form-select-sm ms-2"
                              style={{ width: 90, marginLeft: 8, marginRight: 8 }}
                              value={step.day || 1}
                              onChange={e => handleStepChange(placeId, 'day', Number(e.target.value))}
                            >
                              {[...Array(15)].map((_, i) => (
                                <option key={i+1} value={i+1}>Ngày {i+1}</option>
                              ))}
                            </select>
                            <input
                              type="number"
                              className="form-control form-control-sm ms-2"
                              style={{ width: 70 }}
                              min={1}
                              value={step.stay_duration || 60}
                              onChange={e => handleStepChange(placeId, 'stay_duration', e.target.value)}
                              placeholder="Phút"
                              title="Thời gian lưu trú (phút)"
                            />
                            <div>
                              <button type="button" className="btn btn-sm btn-light me-1" disabled={idx === 0} onClick={() => handleMovePlace(idx, -1)}><i className="bi bi-arrow-up" /></button>
                              <button type="button" className="btn btn-sm btn-light me-1" disabled={idx === selectedPlaces.length - 1} onClick={() => handleMovePlace(idx, 1)}><i className="bi bi-arrow-down" /></button>
                              <button type="button" className="btn btn-sm btn-danger" onClick={() => handleRemovePlace(placeId)}><i className="bi bi-x" /></button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
                
                {editId ? (
                  <>
                    <button 
                      onClick={handleUpdate} 
                      className="btn admin-main-btn me-2"
                      disabled={isUploading}
                    >
                      {isUploading ? "Đang cập nhật..." : "Cập nhật"}
                    </button>
                    <button
                      onClick={clearForm}
                      className="btn admin-btn-secondary"
                      disabled={isUploading}
                    >
                      Hủy
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={handleCreate} 
                    className="btn admin-main-btn"
                    disabled={isUploading}
                  >
                    {isUploading ? "Đang tạo..." : "Thêm"}
                  </button>
                )}
              </div>

              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th style={{ width: 60 }}>ID</th>
                    <th style={{ width: 150 }}>Tên tour</th>
                    <th style={{ width: 120 }}>Hình ảnh</th>
                    <th style={{ width: 200 }}>Mô tả</th>
                    <th style={{ width: 180 }}>Địa điểm (thứ tự)</th>
                    <th style={{ width: 120 }}>Tổng chi phí</th>
                    <th style={{ width: 70, textAlign: "center" }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {tours.map((t) => (
                    <tr key={t.id}>
                      <td>{t.id}</td>
                      <td>{t.name}</td>
                      <td>
                        {t.image_url ? (
                          <img 
                            src={`http://localhost:3000${t.image_url}`} 
                            alt={t.name}
                            style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                          />
                        ) : (
                          <div 
                            style={{ 
                              width: '80px', 
                              height: '60px', 
                              backgroundColor: '#e9ecef',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#6c757d',
                              borderRadius: '4px'
                            }}
                          >
                            <i className="bi bi-image"></i>
                          </div>
                        )}
                      </td>
                      <td>
                        <div 
                          style={{ 
                            maxHeight: '60px', 
                            overflow: 'hidden',
                            fontSize: '0.9rem'
                          }}
                          dangerouslySetInnerHTML={{ __html: t.description }}
                        />
                      </td>
                      <td>
                        {tourStepsMap[t.id] && tourStepsMap[t.id].length > 0 ? (
                          <div style={{ maxHeight: '60px', overflow: 'hidden', fontSize: '0.8rem' }}>
                            {tourStepsMap[t.id]
                              .sort((a, b) => a.step_order - b.step_order)
                              .map((step, index) => {
                                const place = allPlaces.find(p => p.id === step.place_id);
                                return (
                                  <div key={step.id} style={{ marginBottom: '2px' }}>
                                    <span className="badge bg-primary me-1">Ngày {step.day}</span>
                                    <span>{place ? place.name : `Place ${step.place_id}`}</span>
                                    {index < tourStepsMap[t.id].length - 1 && <i className="bi bi-arrow-right ms-1" style={{ fontSize: '0.7rem' }}></i>}
                                  </div>
                                );
                              })}
                          </div>
                        ) : (
                          <span className="text-muted">Chưa có địa điểm</span>
                        )}
                      </td>
                      <td>
                        {t.total_cost ? (
                          <span className="fw-semibold text-success">
                            {t.total_cost.toLocaleString('vi-VN')} VND
                          </span>
                        ) : (
                          <span className="text-muted">Chưa có</span>
                        )}
                      </td>
                      <td style={{textAlign: 'center'}}>
                        <button
                          className="btn admin-main-btn btn-sm me-2"
                          onClick={() => handleEdit(t)}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn admin-btn-danger btn-sm"
                          onClick={() => handleDelete(t.id)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      <div className={`modal fade ${showDeleteModal ? 'show' : ''}`} 
           style={{ display: showDeleteModal ? 'block' : 'none' }} 
           tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title">
                <i className="bi bi-exclamation-triangle me-2"></i>
                Xác nhận xóa
              </h5>
              <button type="button" className="btn-close btn-close-white" onClick={cancelDelete}></button>
            </div>
            <div className="modal-body">
              <p className="mb-0">Bạn có chắc muốn xóa tour này? Hành động này không thể hoàn tác.</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={cancelDelete}>
                <i className="bi bi-x-circle me-1"></i>
                Hủy
              </button>
              <button type="button" className="btn btn-danger" onClick={confirmDelete}>
                <i className="bi bi-trash me-1"></i>
                Xóa
              </button>
            </div>
          </div>
        </div>
      </div>
      {showDeleteModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}

export default ToursAdmin;
