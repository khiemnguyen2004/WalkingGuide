import { useEffect, useState } from "react";
import axios from "axios";

function PlacePage() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/places")
      .then(res => setPlaces(res.data))
      .catch(err => console.error("Lỗi khi tải địa điểm:", err));
  }, []);

  return (
    <div>
      <h1>Danh sách địa điểm</h1>
      <ul>
        {places.map(place => (
          <li key={place.id}>
            {place.name} - {place.location}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PlacePage;
