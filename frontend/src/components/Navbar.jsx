import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ activePage }) => (
  <nav className="luxury-navbar navbar navbar-expand-lg">
    <div className="container">
      <ul className="navbar-nav mx-auto flex-row gap-3">
        <li className="nav-item">
          <Link
            to="/"
            className={`nav-link${
              activePage === "home" ? " active" : ""
            }`}
          >
            Trang chủ
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/places"
            className={`nav-link${
              activePage === "places" ? " active" : ""
            }`}
          >
            Địa điểm
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/tours"
            className={`nav-link${
              activePage === "tours" ? " active" : ""
            }`}
          >
            Lộ trình
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/articles"
            className={`nav-link${
              activePage === "articles" ? " active" : ""
            }`}
          >
            Bài viết
          </Link>
        </li>
      </ul>
    </div>
  </nav>
);

export default Navbar;