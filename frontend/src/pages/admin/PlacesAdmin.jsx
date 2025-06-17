import React, { useEffect, useState } from "react";
import axios from "axios";

function PlacesAdmin() {
  const [places, setPlaces] = useState([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");

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
      address,
      description,
    });
    fetchPlaces();
    setName("");
    setAddress("");
    setDescription("");
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
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="form-control mb-2"
          placeholder="Địa chỉ"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-control mb-2"
          placeholder="Mô tả"
        />
        <button onClick={handleCreate} className="btn btn-success">Thêm</button>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên địa điểm</th>
            <th>Địa chỉ</th>
            <th>Mô tả</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {places.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.address}</td>
              <td>{p.description}</td>
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
