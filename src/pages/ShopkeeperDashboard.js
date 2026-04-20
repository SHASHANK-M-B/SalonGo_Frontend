import { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Store, CalendarDays, DollarSign, CheckCircle2, XCircle, Plus } from "lucide-react";
import toast from "react-hot-toast";

export default function ShopkeeperDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("requests");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'shopkeeper') {
      navigate("/");
      return;
    }
    
    const fetchBookings = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/bookings", {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setBookings(data);
      } catch (error) {
        console.error(error);
        const local = JSON.parse(localStorage.getItem('bookings')) || [];
        setBookings(local); // Fallback
      }
      setLoading(false);
    };

    fetchBookings();
  }, [user, navigate]);

  const fetchBookingsGlobal = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/bookings", {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setBookings(data);
      } catch (error) {
         // fallback
      }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      if (user.token) {
        await axios.put(`http://localhost:5000/api/bookings/${id}/status`, { status: newStatus }, {
           headers: { Authorization: `Bearer ${user.token}` }
        });
        toast.success(`Booking ${newStatus}`);
        fetchBookingsGlobal();
      } else {
        const existing = JSON.parse(localStorage.getItem("bookings")) || [];
        if(existing.length > 0) existing[0].status = newStatus;
        localStorage.setItem("bookings", JSON.stringify(existing));
        setBookings(existing);
        toast.success(`Booking ${newStatus}`);
      }
    } catch (e) {
      toast.error('Failed to update status');
    }
  }

  const pendingBookings = bookings.filter(b => b.status === 'Pending');
  const pastBookings = bookings.filter(b => b.status !== 'Pending');
  const totalEarnings = pastBookings.reduce((sum, b) => b.status === "Completed" ? sum + (b.totalAmount || 0) : sum, 0);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 pb-20">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold mb-8 flex items-center gap-3">
          <Store className="text-indigo-600" size={32} /> Shopkeeper Dashboard
        </h1>

        {/* Dashboard Tabs */}
        <div className="flex gap-4 border-b border-slate-200 mb-8 overflow-x-auto hide-scrollbar">
           <button onClick={() => setActiveTab("requests")} className={`pb-4 px-2 font-bold text-lg whitespace-nowrap border-b-4 transition-colors ${activeTab === "requests" ? "border-indigo-600 text-indigo-700" : "border-transparent text-slate-500 hover:text-slate-900"}`}>
             Action Required ({pendingBookings.length})
           </button>
           <button onClick={() => setActiveTab("earnings")} className={`pb-4 px-2 font-bold text-lg whitespace-nowrap border-b-4 transition-colors ${activeTab === "earnings" ? "border-indigo-600 text-indigo-700" : "border-transparent text-slate-500 hover:text-slate-900"}`}>
             Stats & Earnings
           </button>
           <button onClick={() => setActiveTab("services")} className={`pb-4 px-2 font-bold text-lg whitespace-nowrap border-b-4 transition-colors ${activeTab === "services" ? "border-indigo-600 text-indigo-700" : "border-transparent text-slate-500 hover:text-slate-900"}`}>
             Manage Services
           </button>
        </div>

        {loading ? (
             <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div></div>
        ) : (
          <>
            {activeTab === 'requests' && (
              <div className="space-y-6">
                 {pendingBookings.length === 0 ? (
                    <div className="p-12 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
                      <p className="text-slate-500 font-bold mb-2">No pending booking requests!</p>
                      <p className="text-sm text-slate-400">You're all caught up.</p>
                    </div>
                 ) : (
                   pendingBookings.map((b, i) => (
                      <div key={b._id || i} className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between md:items-center gap-6 hover:shadow-md transition-shadow">
                        <div>
                          <h3 className="text-xl font-extrabold text-slate-900">{b.user?.name || "Guest Customer"}</h3>
                          <div className="text-sm text-slate-500 font-medium mt-3 space-y-2">
                            <p className="flex items-center gap-2"><CalendarDays size={16} className="text-indigo-400" /> {b.date || (b.time ? b.time.split(' at ')[0] : '')} at {b.time ? (b.time.includes(' at ') ? b.time.split(' at ')[1] : b.time) : ''}</p>
                            <p className="flex items-center gap-2"><DollarSign size={16} className="text-indigo-400" /> Total: ₹{b.totalAmount} <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded ml-2 uppercase font-bold">(50% adv paid)</span></p>
                          </div>
                          <div className="mt-4 text-sm font-bold bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <span className="text-indigo-600">Services:</span> <span className="text-slate-700">{b.services?.map(s => s.name).join(', ') || 'Various services'}</span>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                           <button onClick={() => handleUpdateStatus(b._id, 'Accepted')} className="flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white px-6 py-3 rounded-2xl font-bold transition-colors shadow-sm border border-emerald-100 hover:border-transparent">
                             <CheckCircle2 size={18} /> Accept
                           </button>
                           <button onClick={() => handleUpdateStatus(b._id, 'Rejected')} className="flex items-center justify-center gap-2 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white px-6 py-3 rounded-2xl font-bold transition-colors shadow-sm border border-rose-100 hover:border-transparent">
                             <XCircle size={18} /> Reject
                           </button>
                        </div>
                      </div>
                   ))
                 )}
              </div>
            )}

            {activeTab === 'earnings' && (
              <div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-3xl text-white shadow-xl shadow-indigo-600/20">
                       <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-2">Total Earnings</p>
                       <h2 className="text-4xl sm:text-5xl font-extrabold">₹{totalEarnings || 0}</h2>
                    </div>
                    <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm">
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Successful Bookings</p>
                       <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900">{pastBookings.filter(b=>b.status==='Completed').length}</h2>
                    </div>
                 </div>

                 <h2 className="text-2xl font-extrabold mb-6 text-slate-900">Booking History</h2>
                 <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase tracking-wider">
                           <tr>
                             <th className="p-5">Customer</th>
                             <th className="p-5">Date & Time</th>
                             <th className="p-5">Amount</th>
                             <th className="p-5">Status</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {pastBookings.length === 0 ? (
                            <tr><td colSpan="4" className="text-center p-8 text-slate-500 font-medium">No past bookings found.</td></tr>
                          ) : pastBookings.map((b, i) => (
                             <tr key={i} className="hover:bg-slate-50 transition-colors">
                                <td className="p-5 font-bold text-slate-900">{b.user?.name || "Guest User"}</td>
                                <td className="p-5 text-slate-600 font-medium text-sm">{b.date || (b.time ? b.time.split(' at ')[0] : '')}</td>
                                <td className="p-5 font-bold text-slate-900">₹{b.totalAmount}</td>
                                <td className="p-5">
                                  <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                    b.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                    b.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                    'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                  }`}>
                                    {b.status}
                                  </span>
                                </td>
                             </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                 </div>
              </div>
            )}
            
            {activeTab === 'services' && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-6">
                  <h2 className="text-2xl font-extrabold text-slate-900">Manage Services</h2>
                  <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition">
                     <Plus size={18} /> Add Service
                  </button>
                </div>
                
                <div className="text-center py-10">
                   <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Store className="text-slate-300" size={32} />
                   </div>
                   <p className="text-slate-500 font-medium mb-2">No custom services added yet.</p>
                   <p className="text-sm text-slate-400">Add a service to allow customers to book it.</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
