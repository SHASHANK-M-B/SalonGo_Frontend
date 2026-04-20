import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ShopkeeperDashboard from "./pages/ShopkeeperDashboard";
import LocationPopup from "./components/LocationPopup";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased text-base">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/dashboard" element={<ShopkeeperDashboard />} />
      </Routes>
      <LocationPopup />
    </div>
  );
}

export default App;