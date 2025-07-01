import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import UserPage from "./pages/UserPage";
import PlacePage from "./pages/PlacePage";
import TourPage from "./pages/TourPage";
import ArticlePage from "./pages/ArticlePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./pages/AdminDashboard";
import ArticlesAdmin from "./pages/admin/ArticlesAdmin";
import UsersAdmin from "./pages/admin/UsersAdmin";
import PlacesAdmin from "./pages/admin/PlacesAdmin";
import ToursAdmin from "./pages/admin/ToursAdmin";
import TagsAdmin from "./pages/admin/TagsAdmin";
import SettingsAdmin from "./pages/admin/SettingsAdmin";
import { PrivateRoute, AdminRoute } from "./components/ProtectedRoute";
import ManualPlanner from "./components/ManualPlanner";
import TourList from "./components/TourList";
import AutoPlanner from "./components/AutoPlanner";
import ArticleDetail from './pages/details/ArticleDetail';
import PlaceDetail from './pages/details/PlaceDetail';
import TourDetail from './pages/details/TourDetail';
import MyTours from "./pages/MyTours";
import NotificationPage from "./pages/NotificationPage";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/users" element={<PrivateRoute><UserPage /></PrivateRoute>} />
        <Route path="/places" element={<PrivateRoute><PlacePage /></PrivateRoute>} />
        <Route path="/tours" element={<PrivateRoute><TourPage /></PrivateRoute>} />
        <Route path="/articles" element={<PrivateRoute><ArticlePage /></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><NotificationPage /></PrivateRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><UsersAdmin /></AdminRoute>} />
        <Route path="/admin/places" element={<AdminRoute><PlacesAdmin /></AdminRoute>} />
        <Route path="/admin/articles" element={<AdminRoute><ArticlesAdmin /></AdminRoute>} />
        <Route path="/admin/tours" element={<AdminRoute><ToursAdmin /></AdminRoute>} />
        <Route path="/admin/tags" element={<AdminRoute><TagsAdmin /></AdminRoute>} />
        <Route path="/admin/settings" element={<AdminRoute><SettingsAdmin /></AdminRoute>} />
        <Route path="/manual-planner" element={<PrivateRoute><ManualPlanner /></PrivateRoute>} />
        <Route path="/my-tours" element={<PrivateRoute><MyTours /></PrivateRoute>} />
        <Route path="/ai/generate-tour" element={<PrivateRoute><AutoPlanner /></PrivateRoute>} />
        <Route path="/articles/:id" element={<ArticleDetail />} />
        <Route path="/places/:id" element={<PlaceDetail />} />
        <Route path="/tours/:id" element={<TourDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
