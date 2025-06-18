import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext.jsx";


function TourList() {
  const { user } = useContext(AuthContext);
  const [myTours, setMyTours] = useState([]);

  useEffect(() => {
    fetchMyTours();
  }, []);

  const fetchMyTours = async () => {
    const res = await axios.get(`http://localhost:3000/api/tours/user/${user.id}`);
    setMyTours(res.data);
  };

  return (
    <div className="container mt-4">
      <h2>Tour của tôi</h2>
      <ul className="list-group">
        {myTours.map((tour) => (
          <li key={tour.id} className="list-group-item">
            <h5>{tour.name}</h5>
            <p>{tour.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TourList;
