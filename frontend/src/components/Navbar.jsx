// src/components/Navbar.jsx
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <Link to="/">Trang chủ</Link> |{" "}
      <Link to="/users">Người dùng</Link> |{" "}
      <Link to="/places">Địa điểm</Link> |{" "}
      <Link to="/tours">Tour</Link> |{" "}
      <Link to="/articles">Bài viết</Link>
    </nav>
  );
}

export default Navbar;
