import { useState, useContext, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import SlotPicker from "../components/SlotPicker";
import ServiceList from "../components/ServiceList";
import axios from "axios";
import {
  ChevronLeft, Star, MapPin, Clock,
  ShieldCheck, Zap, ReceiptText, ChevronRight
} from "lucide-react";

export default function Booking() {
  const [step, setStep] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const salon = location.state;

  const totalAmount = useMemo(() => selectedServices.reduce((s, i) => s + i.price, 0), [selectedServices]);
  const totalDuration = useMemo(() => selectedServices.reduce((s, i) => s + i.duration, 0), [selectedServices]);

  if (!salon) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white px-6">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <MapPin className="text-slate-400" size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Salon location missing</h2>
        <button onClick={() => navigate("/")} className="mt-4 text-indigo-600 font-bold">Browse Salons</button>
      </div>
    );
  }

  return (
    <div className="bg-[#F4F6FB] min-h-screen font-sans antialiased">
      <Navbar />

      {/* HEADER: Zomato Style Sticky Header */}
      <div className="sticky top-[64px] z-50 bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
          <ChevronLeft size={24} className="text-slate-900" />
        </button>
        <div>
          <h1 className="text-base font-black text-slate-900 leading-none">{salon.name}</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{salon.address?.split(',')[0]}</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto pb-32">

        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* BRAND HERO */}
            <div className="bg-white p-4 mb-2">
              <div className="flex gap-4">
                <img src={salon.image} className="w-24 h-24 rounded-2xl object-cover shadow-sm" alt="" />
                <div className="flex-1 py-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-green-600 text-white text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1">
                      {salon.rating || "4.8"} <Star size={10} className="fill-white" />
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">• {totalDuration || 0} mins • ₹₹₹</span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Select Services</h2>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1">
                    <Zap size={12} className="text-amber-500 fill-amber-500" /> Instant Confirmation
                  </p>
                </div>
              </div>
            </div>

            {/* SERVICES SECTION - BENTO CARD */}
            <div className="px-4 mb-3">
              <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-50">
                <ServiceList salonId={salon._id} onSelectionChange={setSelectedServices} />
              </div>
            </div>

            {/* SLOT PICKER SECTION - BENTO CARD */}
            <div className="px-4 mb-6">
              <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Available Slots</h3>
                  <Clock size={16} className="text-slate-400" />
                </div>
                <SlotPicker onSelect={setSelectedSlot} />
              </div>
            </div>

            {/* ZEPTO STYLE FLOATING CART BAR */}
            {selectedServices.length > 0 && (
              <div className="fixed bottom-6 left-4 right-4 z-50">
                <div className="bg-indigo-600 rounded-3xl p-4 flex items-center justify-between shadow-2xl shadow-indigo-200 animate-in slide-in-from-bottom-10">
                  <div className="flex items-center gap-3 pl-2">
                    <div className="bg-white/20 p-2 rounded-xl">
                      <ReceiptText className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="text-white font-black text-lg leading-none">₹{totalAmount}</p>
                      <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest mt-1">{selectedServices.length} Items Selected</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!selectedSlot}
                    className="bg-white text-indigo-600 px-6 py-3 rounded-2xl font-black text-sm uppercase flex items-center gap-2 hover:bg-slate-50 transition-colors disabled:opacity-50"
                  >
                    Next <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CHECKOUT STEP */}
        {step === 3 && (
          <div className="px-4 pt-6 animate-in slide-in-from-right-10 duration-500">
            <h2 className="text-2xl font-black text-slate-900 mb-6 px-2">Final Review</h2>

            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 space-y-6">
              <div className="flex justify-between border-b border-slate-50 pb-4">
                <span className="text-slate-400 font-bold text-xs uppercase">Booking For</span>
                <span className="text-slate-900 font-black text-sm">{selectedSlot}</span>
              </div>

              <div className="space-y-4">
                {selectedServices.map(s => (
                  <div key={s.id} className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-700">{s.name}</span>
                    <span className="text-sm font-black text-slate-900">₹{s.price}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t-2 border-dashed border-slate-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-lg font-black text-slate-900">Grand Total</span>
                  <span className="text-2xl font-black text-indigo-600">₹{totalAmount}</span>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Prices incl. all taxes</p>
              </div>

              <button
                onClick={async () => {
                  setIsProcessing(true);
                  await new Promise(r => setTimeout(r, 2000));
                  setStep(4);
                }}
                className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
              >
                {isProcessing ? "Processing..." : "Place Order & Pay"}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-green-600 uppercase tracking-widest bg-green-50 py-2 rounded-xl">
                <ShieldCheck size={14} /> 100% Safe & Secure Payments
              </div>
            </div>
          </div>
        )}

        {/* SUCCESS STEP */}
        {step === 4 && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6 animate-in zoom-in-95">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
              <Zap size={48} className="fill-green-600" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Order Confirmed!</h2>
            <p className="text-slate-400 font-medium mb-10 max-w-xs">Your stylist is ready for you on {selectedSlot?.split(' at ')[0]}.</p>
            <button onClick={() => navigate("/my-bookings")} className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs">
              Track Appointment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}