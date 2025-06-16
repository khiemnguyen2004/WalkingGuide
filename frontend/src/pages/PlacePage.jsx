import { useEffect, useState } from 'react';
import axios from 'axios';

function PlacePage() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/places')
      .then(res => setPlaces(res.data))
      .catch(err => {
        console.error("Lỗi khi tải địa điểm:", err);
        if (err.response) {
          console.error("Status:", err.response.status);
          console.error("Data:", err.response.data);
        } else if (err.request) {
          console.error("Không nhận được phản hồi:", err.request);
        } else {
          console.error("Lỗi khác:", err.message);
        }
      });
  }, []);

  return (
    <div>
      <h1>Địa điểm du lịch</h1>
      <ul>
        {places.map(place => (
          <li key={place.id}>{place.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default PlacePage;
