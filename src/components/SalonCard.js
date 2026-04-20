import { useNavigate } from "react-router-dom";
import { Star, MapPin, Clock } from "lucide-react";

export default function SalonCard({ salon }) {
  const navigate = useNavigate();

  return (
    <div 
      className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col group"
      onClick={() => navigate("/booking", { state: salon })}
    >
      <div className="relative h-56 overflow-hidden">
        <img 
          src={salon.image || "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80"} 
          alt={salon.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-slate-900 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-sm">
          <Star size={14} className="text-amber-400 fill-amber-400" /> {salon.rating || "4.8"}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow relative">
        <div className="flex justify-between items-start mb-2">
           <h3 className="text-lg font-extrabold text-slate-900 leading-tight pr-4 group-hover:text-indigo-600 transition-colors">{salon.name}</h3>
        </div>
        
        <p className="text-slate-500 text-sm flex items-center gap-1.5 mb-4 line-clamp-1">
          <MapPin size={14} className="text-slate-400" /> {salon.address || "1.2 km away"}
        </p>
        
        <div className="mt-auto">
          <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{salon.category || "Unisex"}</span>
            <button 
              className="bg-slate-900 text-white px-5 py-2 rounded-xl font-bold shadow-sm hover:bg-slate-800 transition-colors flex items-center gap-2 text-sm"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/booking", { state: salon });
              }}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}