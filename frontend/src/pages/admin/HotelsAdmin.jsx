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
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
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

  const handleCreate = async () => {
    try {
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
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
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
    setLatitude(hotel.latitude);
    setLongitude(hotel.longitude);
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
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
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
    setLatitude("");
    setLongitude("");
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
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Vĩ độ *</label>
                          <input
                            type="number"
                            step="any"
                            className="form-control"
                            value={latitude}
                            onChange={(e) => setLatitude(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Kinh độ *</label>
                          <input
                            type="number"
                            step="any"
                            className="form-control"
                            value={longitude}
                            onChange={(e) => setLongitude(e.target.value)}
                          />
                        </div>
                      </div>
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
                      <label className="form-label">Địa chỉ</label>
                      <input
                        type="text"
                        className="form-control"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
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
                                src={image.image_url}
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
                                src={hotel.images[0].image_url}
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