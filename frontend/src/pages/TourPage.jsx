import React, { useEffect, useState } from "react";
import tourApi from "../api/tourApi";

function TourPage() {
  const [tours, setTours] = useState([]);

  useEffect(() => {
    tourApi.getAll().then(res => setTours(res.data)).catch(console.error);
  }, []);

  return (
    <div>
      <h1>Danh sách tour</h1>
      <ul>
        {tours.map(t => (
          <li key={t.id}>{t.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default TourPage;
