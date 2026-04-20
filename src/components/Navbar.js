import { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { LocationContext } from "../context/LocationContext";
import {
  Scissors,
  LogOut,
  LayoutDashboard,
  MapPin,
  ChevronDown,
  CalendarDays,
  Menu,
  X
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { location, clearLocation } = useContext(LocationContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const routerLocation = useLocation();

  // Close mobile menu on route change
  useEffect(() => setIsMenuOpen(false), [routerLocation]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className={`sticky top-0 z-[100] transition-all duration-500 ${scrolled
        ? "bg-white/90 backdrop-blur-xl border-b border-slate-200/50 py-3 shadow-lg shadow-slate-900/5"
        : "bg-white py-5"
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">

        {/* LEFT: LOGO */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white p-2 rounded-2xl group-active:scale-90 transition-transform shadow-indigo-200 shadow-lg">
            <Scissors size={20} strokeWidth={2.5} />
          </div>
          <span className="text-xl sm:text-2xl font-black tracking-tighter text-slate-900">
            Salon<span className="text-indigo-600">Link</span>
          </span>
        </Link>

        {/* CENTER: DESKTOP LOCATION */}
        <div className="hidden lg:block flex-1 max-w-md px-8">
          <button
            onClick={clearLocation}
            className="w-full flex items-center justify-between gap-3 bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-white hover:shadow-sm px-4 py-2 rounded-2xl transition-all group"
          >
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-indigo-500 group-hover:bounce" />
              <div className="text-left">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Finding salons in</p>
                <p className="text-sm font-bold text-slate-700">{location || "Select your area"}</p>
              </div>
            </div>
            <ChevronDown size={16} className="text-slate-400" />
          </button>
        </div>

        {/* RIGHT: DESKTOP ACTIONS / MOBILE TOGGLE */}
        <div className="flex items-center gap-3">
          {/* Desktop User Logic */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to={user.role === "shopkeeper" ? "/dashboard" : "/my-bookings"}
                  className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  {user.role === "shopkeeper" ? "Dashboard" : "My Bookings"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-rose-50 text-rose-600 p-2.5 rounded-xl hover:bg-rose-100 transition-colors"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-2xl">Log In</Link>
                <Link to="/register" className="px-6 py-2.5 text-sm font-bold bg-indigo-600 text-white rounded-2xl shadow-md hover:bg-indigo-700 active:scale-95 transition-all">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2.5 bg-slate-50 rounded-xl text-slate-900 border border-slate-100 active:scale-90 transition-transform"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE OVERLAY MENU */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 transition-all duration-300 overflow-hidden ${isMenuOpen ? "max-h-[500px] opacity-100 visible" : "max-h-0 opacity-0 invisible"
        }`}>
        <div className="p-4 space-y-4">
          {/* Mobile Location Pill */}
          <button
            onClick={clearLocation}
            className="w-full flex items-center gap-4 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100"
          >
            <div className="bg-white p-2 rounded-xl shadow-sm">
              <MapPin size={20} className="text-indigo-600" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold text-indigo-400 uppercase">Current Location</p>
              <p className="font-bold text-slate-800">{location || "Set Location"}</p>
            </div>
          </button>

          {user ? (
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center gap-3 p-2 mb-2">
                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                </div>
              </div>
              <Link to={user.role === "shopkeeper" ? "/dashboard" : "/my-bookings"} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl font-bold text-slate-700">
                {user.role === "shopkeeper" ? <LayoutDashboard size={20} /> : <CalendarDays size={20} />}
                {user.role === "shopkeeper" ? "Admin Dashboard" : "My Appointments"}
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-3 p-4 text-rose-600 font-bold">
                <LogOut size={20} /> Sign Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 pt-2">
              <Link to="/login" className="w-full py-4 text-center font-bold text-slate-700 bg-slate-50 rounded-2xl">Log In</Link>
              <Link to="/register" className="w-full py-4 text-center font-bold text-white bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100">Create Account</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}