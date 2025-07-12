import React, { useEffect, useState } from "react";
import AdminHeader from "../../components/AdminHeader.jsx";
import AdminSidebar from "../../components/AdminSidebar.jsx";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import "../../css/AdminLayout.css";

function RestaurantsAdmin() {
  const [restaurants, setRestaurants] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [cuisineType, setCuisineType] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [openingHours, setOpeningHours] = useState("");
  const [deliveryAvailable, setDeliveryAvailable] = useState(false);
  const [takeoutAvailable, setTakeoutAvailable] = useState(true);
  const [dineInAvailable, setDineInAvailable] = useState(true);
  const [dietaryOptions, setDietaryOptions] = useState("");
  const [features, setFeatures] = useState("");
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [restaurantToDelete, setRestaurantToDelete] = useState(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/restaurants");
      setRestaurants(res.data.data || res.data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
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

      // Create the restaurant
      const restaurantRes = await axios.post("http://localhost:3000/api/restaurants", {
        name,
        description,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        city,
        address,
        phone,
        email,
        website,
        cuisine_type: cuisineType,
        price_range: priceRange,
        min_price: parseFloat(minPrice) || 0,
        max_price: parseFloat(maxPrice) || 0,
        opening_hours: openingHours,
        delivery_available: deliveryAvailable,
        takeout_available: takeoutAvailable,
        dine_in_available: dineInAvailable,
        dietary_options: dietaryOptions,
        features: features,
        images: uploadedImages
      });

      fetchRestaurants();
      resetForm();
    } catch (error) {
      console.error("Error creating restaurant:", error);
      alert("Lỗi khi tạo nhà hàng. Vui lòng thử lại.");
    }
  };

  const handleEdit = (restaurant) => {
    setEditId(restaurant.id);
    setName(restaurant.name);
    setDescription(restaurant.description || "");
    setLatitude(restaurant.latitude);
    setLongitude(restaurant.longitude);
    setCity(restaurant.city || "");
    setAddress(restaurant.address || "");
    setPhone(restaurant.phone || "");
    setEmail(restaurant.email || "");
    setWebsite(restaurant.website || "");
    setCuisineType(restaurant.cuisine_type || "");
    setPriceRange(restaurant.price_range || "");
    setMinPrice(restaurant.min_price || "");
    setMaxPrice(restaurant.max_price || "");
    setOpeningHours(restaurant.opening_hours || "");
    setDeliveryAvailable(restaurant.delivery_available || false);
    setTakeoutAvailable(restaurant.takeout_available !== false);
    setDineInAvailable(restaurant.dine_in_available !== false);
    setDietaryOptions(restaurant.dietary_options || "");
    setFeatures(restaurant.features || "");
    setImages(restaurant.images || []);
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

      // Update the restaurant
      await axios.put(`http://localhost:3000/api/restaurants/${editId}`, {
        name,
        description,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        city,
        address,
        phone,
        email,
        website,
        cuisine_type: cuisineType,
        price_range: priceRange,
        min_price: parseFloat(minPrice) || 0,
        max_price: parseFloat(maxPrice) || 0,
        opening_hours: openingHours,
        delivery_available: deliveryAvailable,
        takeout_available: takeoutAvailable,
        dine_in_available: dineInAvailable,
        dietary_options: dietaryOptions,
        features: features,
        images: allImages
      });

      fetchRestaurants();
      setEditId(null);
      resetForm();
    } catch (error) {
      console.error("Error updating restaurant:", error);
      alert("Lỗi khi cập nhật nhà hàng. Vui lòng thử lại.");
    }
  };

  const handleDelete = async (id) => {
    setRestaurantToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!restaurantToDelete) return;
    
    try {
      await axios.delete(`http://localhost:3000/api/restaurants/${restaurantToDelete}`);
      fetchRestaurants();
      setShowDeleteModal(false);
      setRestaurantToDelete(null);
    } catch (error) {
      console.error('Error deleting restaurant:', error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setRestaurantToDelete(null);
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
    setCuisineType("");
    setPriceRange("");
    setMinPrice("");
    setMaxPrice("");
    setOpeningHours("");
    setDeliveryAvailable(false);
    setTakeoutAvailable(true);
    setDineInAvailable(true);
    setDietaryOptions("");
    setFeatures("");
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
                <h5>{editId ? "Chỉnh sửa Nhà hàng" : "Tạo Nhà hàng Mới"}</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Tên nhà hàng *</label>
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
                          <label className="form-label">Loại ẩm thực</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="VD: Việt Nam, Ý, Nhật"
                            value={cuisineType}
                            onChange={(e) => setCuisineType(e.target.value)}
                          />
                        </div>
                      </div>
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
                      <label className="form-label">Giờ mở cửa (JSON)</label>
                      <textarea
                        className="form-control"
                        rows="4"
                        placeholder='{"Thứ 2": "09:00-22:00", "Thứ 3": "09:00-22:00"}'
                        value={openingHours}
                        onChange={(e) => setOpeningHours(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Dịch vụ</label>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={deliveryAvailable}
                          onChange={(e) => setDeliveryAvailable(e.target.checked)}
                        />
                        <label className="form-check-label">Giao hàng</label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={takeoutAvailable}
                          onChange={(e) => setTakeoutAvailable(e.target.checked)}
                        />
                        <label className="form-check-label">Mang về</label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={dineInAvailable}
                          onChange={(e) => setDineInAvailable(e.target.checked)}
                        />
                        <label className="form-check-label">Dùng tại chỗ</label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Tùy chọn ăn kiêng (JSON)</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder='["Chay", "Thuần chay", "Không gluten"]'
                        value={dietaryOptions}
                        onChange={(e) => setDietaryOptions(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Tính năng (JSON)</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder='["Chỗ ngồi ngoài trời", "Nhạc sống", "Ghép rượu"]'
                        value={features}
                        onChange={(e) => setFeatures(e.target.value)}
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
                                alt={`Nhà hàng ${index + 1}`}
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
                        Cập nhật Nhà hàng
                      </Button>
                      <Button variant="secondary" onClick={() => { setEditId(null); resetForm(); }}>
                        Hủy
                      </Button>
                    </>
                  ) : (
                    <Button variant="primary" className="admin-main-btn" onClick={handleCreate}>
                      Tạo Nhà hàng
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Restaurants List */}
            <div className="card">
              <div className="card-header">
                <h5>Tất cả Nhà hàng</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Hình ảnh</th>
                        <th>Tên</th>
                        <th>Ẩm thực</th>
                        <th>Thành phố</th>
                        <th>Mức giá</th>
                        <th>Đánh giá</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {restaurants.map((restaurant) => (
                        <tr key={restaurant.id}>
                          <td>{restaurant.id}</td>
                          <td>
                            {restaurant.images && restaurant.images.length > 0 ? (
                              <img
                                src={restaurant.images[0].image_url}
                                alt={restaurant.name}
                                style={{ width: "50px", height: "50px", objectFit: "cover" }}
                              />
                            ) : (
                              <div style={{ width: "50px", height: "50px", backgroundColor: "#f8f9fa", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <i className="bi bi-cup-hot"></i>
                              </div>
                            )}
                          </td>
                          <td>{restaurant.name}</td>
                          <td>
                            {restaurant.cuisine_type && (
                              <span className="badge bg-primary">{restaurant.cuisine_type}</span>
                            )}
                          </td>
                          <td>{restaurant.city}</td>
                          <td>{restaurant.price_range}</td>
                          <td>{restaurant.rating ? restaurant.rating.toFixed(1) : '0.0'}</td>
                          <td>
                            <div className="btn-group" role="group">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleEdit(restaurant)}
                              >
                                Sửa
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(restaurant.id)}
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
          Bạn có chắc chắn muốn xóa nhà hàng này? Hành động này không thể hoàn tác.
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

export default RestaurantsAdmin; 