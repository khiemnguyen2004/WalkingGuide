import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import "../css/HomePage.css";

function TourPage() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3000/api/tours");
        setTours(res.data);
      } catch (err) {
        console.error("Lỗi khi tải tour:", err);
        setError("Không thể tải danh sách tour. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  return (
    <div className="min-vh-100 d-flex flex-column bg-light home-container">
      <Header />
      <Navbar activePage="tours" />
      <main className="container px-4 py-5 flex-grow-1">
        <h2 className="h4 mb-3 fw-bold">Danh sách tour</h2>
        {loading ? (
          <p className="text-muted">Đang tải dữ liệu...</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : tours.length === 0 ? (
          <p className="text-muted">Không có tour nào để hiển thị.</p>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 cards-wrapper">
            {tours.map((tour) => (
              <Link
                key={tour.id}
                to={`/tours/${tour.id}`}
                className="card text-decoration-none"
              >
                <div className="card-body card-info">
                  <h3 className="card-title text-primary">{tour.name}</h3>
                  <p className="card-text text-muted">
                    {tour.description ? `${tour.description.substring(0, 100)}...` : "Chưa có mô tả"}
                  </p>
                  <div className="text-muted small">
                    <p>Chi phí: {tour.total_cost} USD</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default TourPage;