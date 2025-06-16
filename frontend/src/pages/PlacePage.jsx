import React, { useEffect, useState } from "react";
import placeApi from "../api/placeApi";

function PlacePage() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    placeApi.getAll().then(res => setPlaces(res.data)).catch(console.error);
  }, []);

  return (
    <div>
      <h1>Danh sách địa điểm</h1>
      <ul>
        {places.map(p => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default PlacePage;
