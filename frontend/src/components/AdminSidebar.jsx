import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../css/AdminLayout.css";

const adminNavLinks = [
  { to: "/admin/users", icon: "bi-person", label: "Người dùng" },
  { to: "/admin/places", icon: "bi-geo-alt", label: "Địa điểm" },
  { to: "/admin/articles", icon: "bi-newspaper", label: "Bài viết" },
  { to: "/admin/tours", icon: "bi-map", label: "Lộ trình" },
  { to: "/admin/tags", icon: "bi-tag", label: "Thẻ địa điểm" },
];

const AdminSidebar = ({ alwaysExpanded }) => {
  const location = useLocation();
  return (
    <aside className="admin-sidebar">
      <nav>
        <ul className="list-unstyled mb-0">
          {adminNavLinks.map(link => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`admin-sidebar-link${location.pathname.startsWith(link.to) ? ' active' : ''}`}
              >
                <i className={`bi ${link.icon}`} />
                <span>{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
