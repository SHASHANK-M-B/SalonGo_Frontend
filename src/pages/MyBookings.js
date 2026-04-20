import { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Calendar, Clock } from "lucide-react";

export default function MyBookings() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    // API Call
    axios.get("http://localhost:5000/api/bookings", {
      headers: { Authorization: `Bearer ${user.token}` }
    }).then(res => {
      setBookings(res.data);
      setLoading(false);
    }).catch(err => {
      console.log("Failed API, falling back to local storage", err);
      const local = JSON.parse(localStorage.getItem('bookings')) || [];
      setBookings(local);
      setLoading(false);
    });
  }, [user, navigate]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'Completed': return 'bg-indigo-50 text-indigo-700 border border-indigo-200';
      case 'Rejected': return 'bg-rose-50 text-rose-700 border border-rose-200';
      default: return 'bg-amber-50 text-amber-700 border border-amber-200'; // Pending
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 pb-20">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-extrabold mb-8 flex items-center gap-3">
          <Calendar className="text-indigo-600" size={32} /> My Bookings
        </h1>

        {loading ? (
           <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="animate-pulse bg-white border border-slate-100 shadow-sm h-32 rounded-3xl" />)}
           </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl shadow-sm border border-slate-100 mt-8">
            <div className="bg-slate-50 p-6 rounded-full mb-6">
              <Calendar size={48} className="text-slate-300" />
            </div>
            <h3 className="text-2xl font-extrabold mb-2 text-slate-900">No bookings yet</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-8 font-medium">You haven't made any salon appointments. Explore salons to book your first service!</p>
            <button onClick={() => navigate("/")} className="bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all">
               Explore Salons
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((b, i) => (
              <div key={i} className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                  <div>
                    <h2 className="text-xl font-extrabold mb-2 text-slate-900">{b.salon?.name || b.salonName || b.salon || "Salon"}</h2>
                    <div className="flex items-center gap-4 text-slate-500 text-sm font-medium">
                      <span className="flex items-center gap-1.5"><Calendar size={16} className="text-indigo-400" /> {b.date || (b.time ? b.time.split(' at ')[0] : '')}</span>
                      <span className="flex items-center gap-1.5"><Clock size={16} className="text-indigo-400" /> {b.time ? (b.time.includes(' at ') ? b.time.split(' at ')[1] : b.time) : ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <span className={`px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider ${getStatusColor(b.status)}`}>
                        {b.status || 'Pending'}
                     </span>
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl">
                   <h3 className="font-bold text-slate-400 mb-3 text-xs uppercase tracking-widest">Services Booked</h3>
                   <div className="space-y-3">
                     {b.services?.map((s, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <span className="font-bold text-slate-700">{s.name}</span>
                          <span className="font-bold text-slate-400">₹{s.price}</span>
                        </div>
                     ))}
                   </div>
                   <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
                     <span className="font-bold text-slate-900">Total Paid</span>
                     <span className="text-xl font-extrabold text-indigo-600">₹{b.totalAmount || 200}</span>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}