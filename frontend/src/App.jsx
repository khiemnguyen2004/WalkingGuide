// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import UserPage from "./pages/UserPage";
import PlacePage from "./pages/PlacePage";
import TourPage from "./pages/TourPage";
import ArticlePage from "./pages/ArticlePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/users" element={<UserPage />} />
        <Route path="/places" element={<PlacePage />} />
        <Route path="/tours" element={<TourPage />} />
        <Route path="/articles" element={<ArticlePage />} />
      </Routes>
    </Router>
  );
}

export default App;
