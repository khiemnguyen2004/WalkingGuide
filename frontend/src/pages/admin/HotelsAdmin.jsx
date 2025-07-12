import React, { useEffect, useState } from "react";
import AdminHeader from "../../components/AdminHeader.jsx";
import AdminSidebar from "../../components/AdminSidebar.jsx";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import "../../css/AdminLayout.css";

function HotelsAdmin() {
  const [hotels, setHotels] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [amenities, setAmenities] = useState("");
  const [roomTypes, setRoomTypes] = useState("");
  const [checkInTime, setCheckInTime] = useState("15:00");
  const [checkOutTime, setCheckOutTime] = useState("11:00");
  const [stars, setStars] = useState(0);
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [hotelToDelete, setHotelToDelete] = useState(null);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/hotels");
      setHotels(res.data.data || res.data);
    } catch (error) {
      console.error("Error fetching hotels:", error);
    }
  };

  // Helper function to get proper image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) {
      return imageUrl; // Already absolute URL
    }
    // Prepend backend URL for relative paths
    return `http://localhost:3000${imageUrl}`;
  };

  // Address autocomplete with debouncing
  const searchAddress = async (query) => {
    if (query.length < 3) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      );
      setAddressSuggestions(response.data);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
    }
  };

  const handleAddressChange = (value) => {
    setAddress(value);
    searchAddress(value);
  };

  const handleSuggestionClick = (suggestion) => {
    setAddress(suggestion.display_name);
    setCity(suggestion.address?.city || suggestion.address?.town || suggestion.address?.state || "");
    setShowSuggestions(false);
    setAddressSuggestions([]);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    
    // Create preview URLs for new images
    const newImages = files.map((file, index) => ({
      id: `new-${index}`,
      image_url: URL.createObjectURL(file),
      caption: "",
      is_primary: index === 0,
      sort_order: index
    }));
    
    setImages(newImages);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  const updateImageCaption = (index, caption) => {
    const updatedImages = [...images];
    updatedImages[index].caption = caption;
    setImages(updatedImages);
  };

  const setPrimaryImage = (index) => {
    const updatedImages = images.map((img, i) => ({
      ...img,
      is_primary: i === index
    }));
    setImages(updatedImages);
  };

  const getCoordinatesFromAddress = async (address) => {
    setIsLoadingLocation(true);
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      
      if (response.data && response.data.length > 0) {
        const location = response.data[0];
        return {
          latitude: parseFloat(location.lat),
          longitude: parseFloat(location.lon)
        };
      }
      return null;
    } catch (error) {
      console.error("Error getting coordinates:", error);
      return null;
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleCreate = async () => {
    try {
      // Get coordinates from address
      const coordinates = await getCoordinatesFromAddress(address);
      if (!coordinates) {
        alert("Không thể tìm thấy tọa độ cho địa chỉ này. Vui lòng kiểm tra lại địa chỉ.");
        return;
      }

      // Upload images first
      const uploadedImages = [];
      for (let i = 0; i < imageFiles.length; i++) {
        const formData = new FormData();
        formData.append("file", imageFiles[i]);
        const uploadRes = await axios.post("http://localhost:3000/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        uploadedImages.push({
          image_url: uploadRes.data.url,
          caption: images[i].caption,
          is_primary: images[i].is_primary,
          sort_order: i
        });
      }

      // Create the hotel
      const hotelRes = await axios.post("http://localhost:3000/api/hotels", {
        name,
        description,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        city,
        address,
        phone,
        email,
        website,
        price_range: priceRange,
        min_price: parseFloat(minPrice) || 0,
        max_price: parseFloat(maxPrice) || 0,
        amenities,
        room_types: roomTypes,
        check_in_time: checkInTime,
        check_out_time: checkOutTime,
        stars: parseInt(stars) || 0,
        images: uploadedImages
      });

      fetchHotels();
      resetForm();
    } catch (error) {
      console.error("Error creating hotel:", error);
      alert("Lỗi khi tạo khách sạn. Vui lòng thử lại.");
    }
  };

  const handleEdit = (hotel) => {
    setEditId(hotel.id);
    setName(hotel.name);
    setDescription(hotel.description || "");
    setCity(hotel.city || "");
    setAddress(hotel.address || "");
    setPhone(hotel.phone || "");
    setEmail(hotel.email || "");
    setWebsite(hotel.website || "");
    setPriceRange(hotel.price_range || "");
    setMinPrice(hotel.min_price || "");
    setMaxPrice(hotel.max_price || "");
    setAmenities(hotel.amenities || "");
    setRoomTypes(hotel.room_types || "");
    setCheckInTime(hotel.check_in_time || "15:00");
    setCheckOutTime(hotel.check_out_time || "11:00");
    setStars(hotel.stars || 0);
    setImages(hotel.images || []);
    setImageFiles([]);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdate = async () => {
    try {
      // Get coordinates from address
      const coordinates = await getCoordinatesFromAddress(address);
      if (!coordinates) {
        alert("Không thể tìm thấy tọa độ cho địa chỉ này. Vui lòng kiểm tra lại địa chỉ.");
        return;
      }

      // Upload new images first
      const uploadedImages = [];
      for (let i = 0; i < imageFiles.length; i++) {
        const formData = new FormData();
        formData.append("file", imageFiles[i]);
        const uploadRes = await axios.post("http://localhost:3000/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        uploadedImages.push({
          image_url: uploadRes.data.url,
          caption: images[i].caption,
          is_primary: images[i].is_primary,
          sort_order: i
        });
      }

      // Combine existing images with new ones
      const existingImages = images.filter(img => !img.id.toString().startsWith('new-'));
      const allImages = [...existingImages, ...uploadedImages];

      // Update the hotel
      await axios.put(`http://localhost:3000/api/hotels/${editId}`, {
        name,
        description,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        city,
        address,
        phone,
        email,
        website,
        price_range: priceRange,
        min_price: parseFloat(minPrice) || 0,
        max_price: parseFloat(maxPrice) || 0,
        amenities,
        room_types: roomTypes,
        check_in_time: checkInTime,
        check_out_time: checkOutTime,
        stars: parseInt(stars) || 0,
        images: allImages
      });

      fetchHotels();
      setEditId(null);
      resetForm();
    } catch (error) {
      console.error("Error updating hotel:", error);
      alert("Lỗi khi cập nhật khách sạn. Vui lòng thử lại.");
    }
  };

  const handleDelete = async (id) => {
    setHotelToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!hotelToDelete) return;
    
    try {
      await axios.delete(`http://localhost:3000/api/hotels/${hotelToDelete}`);
      fetchHotels();
      setShowDeleteModal(false);
      setHotelToDelete(null);
    } catch (error) {
      console.error('Error deleting hotel:', error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setHotelToDelete(null);
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setCity("");
    setAddress("");
    setPhone("");
    setEmail("");
    setWebsite("");
    setPriceRange("");
    setMinPrice("");
    setMaxPrice("");
    setAmenities("");
    setRoomTypes("");
    setCheckInTime("15:00");
    setCheckOutTime("11:00");
    setStars(0);
    setImages([]);
    setImageFiles([]);
    setAddressSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="admin-layout">
      <AdminHeader />
      <div className="admin-container">
        <AdminSidebar />
        <div className="admin-content">
          <div className="container-fluid">            
            {/* Create/Edit Form */}
            <div className="card mb-4">
              <div className="card-header">
                <h5>{editId ? "Chỉnh sửa Khách sạn" : "Tạo Khách sạn Mới"}</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Tên khách sạn *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Mô tả</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Thành phố</label>
                      <input
                        type="text"
                        className="form-control"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Địa chỉ *</label>
                      <div className="position-relative">
                        <input
                          type="text"
                          className="form-control"
                          value={address}
                          onChange={(e) => handleAddressChange(e.target.value)}
                          placeholder="Nhập địa chỉ để tìm kiếm..."
                        />
                        {isLoadingLocation && (
                          <div className="position-absolute top-50 end-0 translate-middle-y me-2">
                            <div className="spinner-border spinner-border-sm text-primary" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          </div>
                        )}
                        {showSuggestions && addressSuggestions.length > 0 && (
                          <div className="position-absolute w-100 bg-white border rounded shadow-sm" style={{ zIndex: 1000, top: '100%' }}>
                            {addressSuggestions.map((suggestion, index) => (
                              <div
                                key={index}
                                className="p-2 border-bottom suggestion-item"
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleSuggestionClick(suggestion)}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                              >
                                <div className="fw-semibold">{suggestion.display_name.split(',')[0]}</div>
                                <div className="small text-muted">{suggestion.display_name}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Số điện thoại</label>
                      <input
                        type="text"
                        className="form-control"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Website</label>
                      <input
                        type="url"
                        className="form-control"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                      />
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Mức giá</label>
                          <select
                            className="form-control"
                            value={priceRange}
                            onChange={(e) => setPriceRange(e.target.value)}
                          >
                            <option value="">Chọn mức giá</option>
                            <option value="$">$ (Bình dân)</option>
                            <option value="$$">$$ (Trung bình)</option>
                            <option value="$$$">$$$ (Cao cấp)</option>
                            <option value="$$$$">$$$$ (Sang trọng)</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Sao</label>
                          <select
                            className="form-control"
                            value={stars}
                            onChange={(e) => setStars(parseInt(e.target.value))}
                          >
                            <option value={0}>Chọn số sao</option>
                            <option value={1}>1 Sao</option>
                            <option value={2}>2 Sao</option>
                            <option value={3}>3 Sao</option>
                            <option value={4}>4 Sao</option>
                            <option value={5}>5 Sao</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Giá tối thiểu (VND)</label>
                          <input
                            type="number"
                            className="form-control"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Giá tối đa (VND)</label>
                          <input
                            type="number"
                            className="form-control"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Tiện ích (JSON)</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder='["WiFi", "Hồ bơi", "Spa"]'
                        value={amenities}
                        onChange={(e) => setAmenities(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Loại phòng (JSON)</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder='["Deluxe", "Suite", "Standard"]'
                        value={roomTypes}
                        onChange={(e) => setRoomTypes(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Giờ nhận phòng</label>
                      <input
                        type="time"
                        className="form-control"
                        value={checkInTime}
                        onChange={(e) => setCheckInTime(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Giờ trả phòng</label>
                      <input
                        type="time"
                        className="form-control"
                        value={checkOutTime}
                        onChange={(e) => setCheckOutTime(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Images Section */}
                <div className="mb-3">
                  <label className="form-label">Hình ảnh</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="form-control"
                    onChange={handleImageChange}
                  />
                  {images.length > 0 && (
                    <div className="mt-3">
                      <h6>Xem trước hình ảnh:</h6>
                      <div className="row">
                        {images.map((image, index) => (
                          <div key={index} className="col-md-3 mb-3">
                            <div className="card">
                              <img
                                src={getImageUrl(image.image_url)}
                                className="card-img-top"
                                alt={`Khách sạn ${index + 1}`}
                                style={{ height: "150px", objectFit: "cover" }}
                              />
                              <div className="card-body">
                                <input
                                  type="text"
                                  className="form-control mb-2"
                                  placeholder="Chú thích"
                                  value={image.caption}
                                  onChange={(e) => updateImageCaption(index, e.target.value)}
                                />
                                <div className="d-flex gap-2">
                                  <button
                                    className={`btn btn-sm ${image.is_primary ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => setPrimaryImage(index)}
                                  >
                                    {image.is_primary ? 'Chính' : 'Đặt làm chính'}
                                  </button>
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => removeImage(index)}
                                  >
                                    Xóa
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="d-flex gap-2">
                  {editId ? (
                    <>
                      <Button variant="primary" className="admin-main-btn" onClick={handleUpdate}>
                        Cập nhật Khách sạn
                      </Button>
                      <Button variant="secondary" onClick={() => { setEditId(null); resetForm(); }}>
                        Hủy
                      </Button>
                    </>
                  ) : (
                    <Button variant="primary" className="admin-main-btn" onClick={handleCreate}>
                      Tạo Khách sạn
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Hotels List */}
            <div className="card">
              <div className="card-header">
                <h5>Tất cả Khách sạn</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Hình ảnh</th>
                        <th>Tên</th>
                        <th>Thành phố</th>
                        <th>Địa chỉ</th>
                        <th>Sao</th>
                        <th>Mức giá</th>
                        <th>Đánh giá</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hotels.map((hotel) => (
                        <tr key={hotel.id}>
                          <td>{hotel.id}</td>
                          <td>
                            {hotel.images && hotel.images.length > 0 ? (
                              <img
                                src={getImageUrl(hotel.images[0].image_url)}
                                alt={hotel.name}
                                style={{ width: "50px", height: "50px", objectFit: "cover" }}
                              />
                            ) : (
                              <div style={{ width: "50px", height: "50px", backgroundColor: "#f8f9fa", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <i className="bi bi-building"></i>
                              </div>
                            )}
                          </td>
                          <td>{hotel.name}</td>
                          <td>{hotel.city}</td>
                          <td>
                            <div style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {hotel.address}
                            </div>
                          </td>
                          <td>
                            {hotel.stars > 0 && (
                              <span className="badge bg-warning text-dark">
                                {hotel.stars} <i className="bi bi-star-fill"></i>
                              </span>
                            )}
                          </td>
                          <td>{hotel.price_range}</td>
                          <td>{hotel.rating ? hotel.rating.toFixed(1) : '0.0'}</td>
                          <td>
                            <div className="btn-group" role="group">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleEdit(hotel)}
                              >
                                Sửa
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(hotel.id)}
                              >
                                Xóa
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={cancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa khách sạn này? Hành động này không thể hoàn tác.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>
            Hủy
          </Button>
          <Button variant="danger" className="admin-btn-danger" onClick={confirmDelete}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default HotelsAdmin; 