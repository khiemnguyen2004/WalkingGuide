import React, { useEffect, useState } from "react";
import axios from "axios";

function PlacesAdmin() {
  const [places, setPlaces] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    const res = await axios.get("http://localhost:3000/api/places");
    setPlaces(res.data);
  };

  const handleCreate = async () => {
    await axios.post("http://localhost:3000/api/places", {
      name,
      description,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      image_url: imageUrl,
    });
    fetchPlaces();
    setName("");
    setDescription("");
    setLatitude("");
    setLongitude("");
    setImageUrl("");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa địa điểm này?")) {
      await axios.delete(`http://localhost:3000/api/places/${id}`);
      fetchPlaces();
    }
  };

  return (
    <div className="container py-4">
      <h2>Quản lý địa điểm</h2>

      <div className="mb-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-control mb-2"
          placeholder="Tên địa điểm"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-control mb-2"
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
        <input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="form-control mb-2"
          placeholder="Link ảnh (image_url)"
        />
        <button onClick={handleCreate} className="btn btn-success">Thêm</button>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên địa điểm</th>
            <th>Mô tả</th>
            <th>Vĩ độ</th>
            <th>Kinh độ</th>
            <th>Ảnh</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {places.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.description}</td>
              <td>{p.latitude}</td>
              <td>{p.longitude}</td>
              <td>{p.image_url}</td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PlacesAdmin;
