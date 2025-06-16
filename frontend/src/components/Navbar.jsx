import React from "react";
import { Link } from "react-router-dom";

function Navbar({ activePage }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <div className="navbar-nav d-flex flex-row gap-3">
          <Link
            to="/"
            className={`nav-link ${activePage === "home" ? "active fw-bold" : ""}`}
          >
            Trang chủ
          </Link>
          <Link
            to="/places"
            className={`nav-link ${activePage === "places" ? "active fw-bold" : ""}`}
          >
            Địa điểm
          </Link>
          <Link
            to="/tours"
            className={`nav-link ${activePage === "tours" ? "active fw-bold" : ""}`}
          >
            Tours
          </Link>
          <Link
            to="/articles"
            className={`nav-link ${activePage === "articles" ? "active fw-bold" : ""}`}
          >
            Bài viết
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;