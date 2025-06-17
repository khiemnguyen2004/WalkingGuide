// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import UserPage from "./pages/UserPage";
import PlacePage from "./pages/PlacePage";
import TourPage from "./pages/TourPage";
import ArticlePage from "./pages/ArticlePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/users" element={<UserPage />} />
        <Route path="/places" element={<PlacePage />} />
        <Route path="/tours" element={<TourPage />} />
        <Route path="/articles" element={<ArticlePage />} />
      </Routes>
    </Router>
  );
}

export default App;
