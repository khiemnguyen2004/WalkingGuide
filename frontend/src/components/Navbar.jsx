import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ activePage, isAuthenticated }) => (
  <aside className="luxury-sidebar d-none d-lg-block luxury-sidebar-collapsed">
    <nav>
      <ul className="luxury-sidebar-nav list-unstyled mb-0">
        <li>
          <Link
            to="/explore"
            className={`luxury-sidebar-link${
              activePage === "explore" ? " active" : ""
            }`}
            style={{ textDecoration: "none" }}
          >
            <i className="bi bi-map luxury-sidebar-icon" />
            <span className="luxury-sidebar-label">Explore Map</span>
          </Link>
        </li>
        <li>
          <Link
            to="/plan"
            className={`luxury-sidebar-link${
              activePage === "plan" ? " active" : ""
            }`}
            style={{ textDecoration: "none" }}
          >
            <i className="bi bi-calendar2-check luxury-sidebar-icon" />
            <span className="luxury-sidebar-label">Plan Trip</span>
          </Link>
        </li>
        <li>
          <Link
            to="/mytrip"
            className={`luxury-sidebar-link${
              activePage === "mytrip" ? " active" : ""
            }`}
            style={{ textDecoration: "none" }}
          >
            <i className="bi bi-suitcase luxury-sidebar-icon" />
            <span className="luxury-sidebar-label">My Trip</span>
          </Link>
        </li>
      </ul>
    </nav>
  </aside>
);

export default Navbar;