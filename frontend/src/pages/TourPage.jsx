import { useEffect, useState } from "react";
import axios from "axios";

function TourPage() {
  const [tours, setTours] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/tours")
      .then(res => setTours(res.data))
      .catch(err => console.error("Lỗi khi tải tour:", err));
  }, []);

  return (
    <div>
      <h1>Danh sách tour</h1>
      <ul>
        {tours.map(tour => (
          <li key={tour.id}>
            {tour.title} - {tour.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TourPage;
