import React, { useEffect, useState } from "react";
import AdminHeader from "../../components/AdminHeader.jsx";
import AdminSidebar from "../../components/AdminSidebar.jsx";
import axios from "axios";
import CKEditorField from "../../components/CKEditorField";
import CityAutocomplete from "../../components/CityAutocomplete";
import "../../css/AdminLayout.css";
import { getTags } from "../../api/tagApi";
import { getPlaceTags, createPlaceTag, deletePlaceTag } from "../../api/placeTagApi";
import { Modal, Button } from "react-bootstrap";
import debounce from 'lodash.debounce';

function PlacesAdmin() {
  const [places, setPlaces] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [openingHours, setOpeningHours] = useState("");
  const [service, setService] = useState("");
  const [editId, setEditId] = useState(null);
  const [tags, setTags] = useState([]);
  const [placeTags, setPlaceTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showTagModal, setShowTagModal] = useState(false);
  const [tagModalPlace, setTagModalPlace] = useState(null);
  const [tagModalSelected, setTagModalSelected] = useState([]);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [placeToDelete, setPlaceToDelete] = useState(null);

  useEffect(() => {
    fetchPlaces();
    fetchTags();
    fetchPlaceTags();
  }, []);

  const fetchPlaces = async () => {
    const res = await axios.get("http://localhost:3000/api/places");
    setPlaces(res.data);
  };

  const fetchTags = async () => {
    const res = await getTags();
    setTags(res.data);
  };

  const fetchPlaceTags = async () => {
    const res = await getPlaceTags();
    setPlaceTags(res.data);
  };

  const handleCreate = async () => {
    let uploadedImageUrl = imageUrl;
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      const uploadRes = await axios.post("http://localhost:3000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      uploadedImageUrl = uploadRes.data.url;
    }
    
    // Create the place
    const placeRes = await axios.post("http://localhost:3000/api/places", {
      name,
      description,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      image_url: uploadedImageUrl,
      city,
      address,
      opening_hours: openingHours,
      service,
    });
    
    // Create place tags if any are selected
    if (selectedTags.length > 0) {
      for (const tagId of selectedTags) {
        await createPlaceTag({ place_id: placeRes.data.id, tag_id: tagId });
      }
    }
    
    fetchPlaces();
    fetchPlaceTags();
    setName("");
    setDescription("");
    setLatitude("");
    setLongitude("");
    setImageUrl("");
    setImageFile(null);
    setCity("");
    setAddress("");
    setOpeningHours("");
    setService("");
    setSelectedTags([]);
  };

  const handleEdit = (place) => {
    setEditId(place.id);
    setName(place.name);
    setDescription(place.description);
    setLatitude(place.latitude);
    setLongitude(place.longitude);
    setImageUrl(place.image_url);
    setCity(place.city || "");
    setAddress(place.address || "");
    setOpeningHours(place.opening_hours || "");
    setService(place.service || "");
    
    // Set selected tags for the place being edited
    const placeTagIds = getTagsForPlace(place.id).map(tag => tag.id);
    setSelectedTags(placeTagIds);
    
    // Scroll to top of the page to show the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdate = async () => {
    let uploadedImageUrl = imageUrl;
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      const uploadRes = await axios.post("http://localhost:3000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      uploadedImageUrl = uploadRes.data.url;
    }
    
    // Update the place
    await axios.put(`http://localhost:3000/api/places/${editId}`, {
      name,
      description,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      image_url: uploadedImageUrl,
      city,
      address,
      opening_hours: openingHours,
      service,
    });
    
    // Update place tags
    const currentTagIds = getTagsForPlace(editId).map(t => t.id);
    const toAdd = selectedTags.filter(id => !currentTagIds.includes(id));
    const toRemove = currentTagIds.filter(id => !selectedTags.includes(id));
    
    for (const tagId of toAdd) {
      await createPlaceTag({ place_id: editId, tag_id: tagId });
    }
    for (const tagId of toRemove) {
      const pt = placeTags.find(pt => pt.place_id === editId && pt.tag_id === tagId);
      if (pt) await deletePlaceTag(pt.id);
    }
    
    fetchPlaces();
    fetchPlaceTags();
    setEditId(null);
    setName("");
    setDescription("");
    setLatitude("");
    setLongitude("");
    setImageUrl("");
    setImageFile(null);
    setCity("");
    setAddress("");
    setOpeningHours("");
    setService("");
    setSelectedTags([]);
  };

  const handleDelete = async (id) => {
    setPlaceToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!placeToDelete) return;
    
    try {
      await axios.delete(`http://localhost:3000/api/places/${placeToDelete}`);
      fetchPlaces();
      setShowDeleteModal(false);
      setPlaceToDelete(null);
    } catch (error) {
      console.error('Error deleting place:', error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setPlaceToDelete(null);
  };

  // Helper to get tags for a place
  const getTagsForPlace = (placeId) => {
    const tagIds = placeTags.filter(pt => pt.place_id === placeId).map(pt => pt.tag_id);
    return tags.filter(tag => tagIds.includes(tag.id));
  };

  const openTagModal = (place) => {
    setTagModalPlace(place);
    setTagModalSelected(getTagsForPlace(place.id).map(t => t.id));
    setShowTagModal(true);
  };

  const closeTagModal = () => {
    setShowTagModal(false);
    setTagModalPlace(null);
    setTagModalSelected([]);
  };

  const handleTagModalSave = async () => {
    if (!tagModalPlace) return;
    const currentTagIds = getTagsForPlace(tagModalPlace.id).map(t => t.id);
    const toAdd = tagModalSelected.filter(id => !currentTagIds.includes(id));
    const toRemove = currentTagIds.filter(id => !tagModalSelected.includes(id));
    for (const tagId of toAdd) {
      await createPlaceTag({ place_id: tagModalPlace.id, tag_id: tagId });
    }
    for (const tagId of toRemove) {
      const pt = placeTags.find(pt => pt.place_id === tagModalPlace.id && pt.tag_id === tagId);
      if (pt) await deletePlaceTag(pt.id);
    }
    fetchPlaceTags();
    closeTagModal();
  };

  // Debounced geocode function (for lat/lng update only)
  const geocodeAddress = debounce(async (address) => {
    if (!address || address.length < 5) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        setLatitude(data[0].lat);
        setLongitude(data[0].lon);
      }
    } catch (err) {}
  }, 800);

  // Debounced address suggestion fetch
  const fetchAddressSuggestions = debounce(async (query) => {
    if (!query || query.length < 3) {
      setAddressSuggestions([]);
      return;
    }
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setAddressSuggestions(data);
    } catch (err) {
      setAddressSuggestions([]);
    }
  }, 400);

  // Watch address changes for suggestions
  useEffect(() => {
    fetchAddressSuggestions(address);
    geocodeAddress(address);
    return () => {
      fetchAddressSuggestions.cancel();
      geocodeAddress.cancel();
    };
  }, [address]);

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setAddress(suggestion.display_name);
    setLatitude(suggestion.lat);
    setLongitude(suggestion.lon);
    setShowSuggestions(false);
    setAddressSuggestions([]);
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
              <div className="mb-3">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-control mb-2"
                  placeholder="Tên địa điểm"
                />
                <CKEditorField
                  value={description}
                  onChange={setDescription}
                  placeholder="Mô tả"
                />
                <input
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="form-control mb-2"
                  placeholder="Vĩ độ (latitude)"
                  type="number"
                />
                <input
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="form-control mb-2"
                  placeholder="Kinh độ (longitude)"
                  type="number"
                />
                <div className="row">
                  <div className="col-md-6">
                    <CityAutocomplete
                      value={city}
                      onChange={setCity}
                      placeholder="Thành phố"
                    />
                  </div>
                  <div className="col-md-6">
                    <div style={{position: 'relative'}}>
                    <input
                      value={address}
                        onChange={(e) => { setAddress(e.target.value); setShowSuggestions(true); }}
                      className="form-control mb-2"
                      placeholder="Địa chỉ"
                        autoComplete="off"
                    />
                      {showSuggestions && addressSuggestions.length > 0 && (
                        <ul className="list-group position-absolute w-100 shadow" style={{zIndex: 10, top: '100%'}}>
                          {addressSuggestions.map((s, idx) => (
                            <li key={idx} className="list-group-item list-group-item-action" style={{cursor: 'pointer'}} onClick={() => handleSuggestionClick(s)}>
                              {s.display_name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
                <textarea
                  value={openingHours}
                  onChange={(e) => setOpeningHours(e.target.value)}
                  className="form-control mb-2"
                  placeholder="Giờ mở cửa"
                  rows="3"
                />
                <textarea
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="form-control mb-2"
                  placeholder="Dịch vụ"
                  rows="3"
                />
                <input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="form-control mb-2"
                  placeholder="Link ảnh (image_url)"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="form-control mb-2"
                />
                
                {/* Tag Selection */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Thẻ địa điểm:</label>
                  <div className="row">
                    {tags.map(tag => (
                      <div key={tag.id} className="col-md-3 col-sm-6 mb-2">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`tag-${tag.id}`}
                            checked={selectedTags.includes(tag.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedTags([...selectedTags, tag.id]);
                              } else {
                                setSelectedTags(selectedTags.filter(id => id !== tag.id));
                              }
                            }}
                          />
                          <label className="form-check-label" htmlFor={`tag-${tag.id}`}>
                            {tag.name}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                  {selectedTags.length > 0 && (
                    <div className="mt-2">
                      <small className="text-muted">Đã chọn: </small>
                      {selectedTags.map(tagId => {
                        const tag = tags.find(t => t.id === tagId);
                        return tag ? (
                          <span key={tagId} className="badge bg-primary me-1">
                            {tag.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
                
                {editId ? (
                  <>
                    <button onClick={handleUpdate} className="btn admin-main-btn me-2">
                      Cập nhật
                    </button>
                    <button
                      onClick={() => {
                        setEditId(null);
                        setName("");
                        setDescription("");
                        setLatitude("");
                        setLongitude("");
                        setImageUrl("");
                        setImageFile(null);
                        setCity("");
                        setAddress("");
                        setOpeningHours("");
                        setService("");
                        setSelectedTags([]);
                      }}
                      className="btn admin-btn-secondary"
                    >
                      Hủy
                    </button>
                  </>
                ) : (
                  <button onClick={handleCreate} className="btn admin-main-btn">
                    Thêm
                  </button>
                )}
              </div>

              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tên địa điểm</th>
                      <th>Thành phố</th>
                      <th>Địa chỉ</th>
                      <th>Giờ mở cửa</th>
                      <th>Dịch vụ</th>
                      <th>Vĩ độ</th>
                      <th>Kinh độ</th>
                      <th>Ảnh</th>
                      <th>Thẻ</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {places.map((p) => (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.name}</td>
                        <td>{p.city || "N/A"}</td>
                        <td>
                          <div style={{maxWidth: 150, maxHeight: 80, overflow: 'auto'}}>
                            {p.address || "N/A"}
                          </div>
                        </td>
                        <td>
                          <div style={{maxWidth: 150, maxHeight: 80, overflow: 'auto'}}>
                            {p.opening_hours || "N/A"}
                          </div>
                        </td>
                        <td>
                          <div style={{maxWidth: 150, maxHeight: 80, overflow: 'auto'}}>
                            {p.service || "N/A"}
                          </div>
                        </td>
                        <td>{p.latitude}</td>
                        <td>{p.longitude}</td>
                        <td>
                          {p.image_url ? (
                            <img
                              src={
                                p.image_url.startsWith("http")
                                  ? p.image_url
                                  : `http://localhost:3000${p.image_url}`
                              }
                              alt="Ảnh"
                              style={{ maxWidth: 80, maxHeight: 60 }}
                            />
                          ) : (
                            ""
                          )}
                        </td>
                        <td>
                          {getTagsForPlace(p.id).map(tag => (
                            <span key={tag.id} className="badge bg-primary me-1">
                              {tag.name}
                            </span>
                          ))}
                          <button className="btn btn-sm btn-outline-secondary ms-2" onClick={() => openTagModal(p)}>
                            Quản lý thẻ
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn admin-main-btn btn-sm me-2"
                            onClick={() => handleEdit(p)}
                          >
                            Sửa
                          </button>
                          <button
                            className="btn admin-btn-danger btn-sm"
                            onClick={() => handleDelete(p.id)}
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
          </div>
        </main>
      </div>
      {/* Tag Modal */}
      <Modal show={showTagModal} onHide={closeTagModal}>
        <Modal.Header closeButton>
          <Modal.Title>Quản lý thẻ cho địa điểm: {tagModalPlace?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {tags.map(tag => (
            <div key={tag.id} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={`tag-checkbox-${tag.id}`}
                checked={tagModalSelected.includes(tag.id)}
                onChange={e => {
                  if (e.target.checked) {
                    setTagModalSelected([...tagModalSelected, tag.id]);
                  } else {
                    setTagModalSelected(tagModalSelected.filter(id => id !== tag.id));
                  }
                }}
              />
              <label className="form-check-label" htmlFor={`tag-checkbox-${tag.id}`}>{tag.name}</label>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeTagModal}>Hủy</Button>
          <Button variant="primary" onClick={handleTagModalSave}>Lưu</Button>
        </Modal.Footer>
      </Modal>

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
              <p className="mb-0">Bạn có chắc muốn xóa địa điểm này? Hành động này không thể hoàn tác.</p>
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

export default PlacesAdmin;
