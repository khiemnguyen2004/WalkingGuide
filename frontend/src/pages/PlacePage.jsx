import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import "../css/HomePage.css";

function PlacePage() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3000/api/places");
        console.log("Places:", res.data); // Kiểm tra dữ liệu
        setPlaces(res.data);
      } catch (err) {
        console.error("Error:", {
          message: err.message,
          code: err.code,
          response: err.response ? err.response.data : null,
        });
        setError("Không thể kết nối đến server. Dữ liệu mặc định sẽ được sử dụng.");
        setPlaces([
          {
            id: 4,
            name: "Hòn Chồng",
            description: "Địa điểm ngắm biển đẹp, yên bình.",
            latitude: 12.2701,
            longitude: 109.2038,
            image_url: "https://example.com/honchong.jpg",
            rating: 4.2,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, []);

  return (
    <div className="min-vh-100 d-flex flex-column bg-light home-container">
      <Header />
      <Navbar activePage="places" id="main-navbar" />
      <main className="container px-4 py-5 flex-grow-1">
        {loading ? (
          <p className="text-muted text-center">Đang tải dữ liệu...</p>
        ) : error ? (
          <p className="text-danger text-center">{error}</p>
        ) : (
          <>
            <section className="cards-section mb-5">
              <h2 className="h4 mb-3 fw-bold">Điểm đến nổi bật</h2>
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {places.map((p) => (
                  <div className="col" key={p.id}>
                    <div className="card h-100">
                      <Link to={`/places/${p.id}`} className="text-decoration-none">
                        <img
                          src={p.image_url || "/default-place.jpg"}
                          alt={p.name}
                          className="card-img-top"
                        />
                        <div className="card-body">
                          <h3 className="card-title text-primary">{p.name}</h3>
                          <p className="card-text text-muted">
                            {p.description ? `${p.description.substring(0, 100)}...` : "Chưa có mô tả"}
                          </p>
                          <p className="card-text text-muted small">Đánh giá: {p.rating.toFixed(1)}/5</p>
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default PlacePage;