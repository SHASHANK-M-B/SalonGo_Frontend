import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import SalonCard from "../components/SalonCard";
import axios from "axios";
import { Search, Sparkles, SlidersHorizontal, MapPin } from "lucide-react";

export default function Home() {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filters = ["All", "Men", "Women", "Unisex", "Home Service"];

  useEffect(() => {
    const fetchSalons = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/salons");
        setSalons(res.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSalons();
  }, []);

  const filteredSalons = salons.filter((s) => {
    const matchesFilter = activeFilter === "All" || s.category === activeFilter;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* PREMIUM HERO */}
      <section className="bg-white px-6 pt-12 pb-16 md:pt-24 md:pb-32 border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:items-center text-left md:text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8">
            <Sparkles size={14} /> Book Top Rated Salons
          </div>

          <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-8">
            Your style, <br />
            <span className="text-indigo-600 font-outline-2">reimagined.</span>
          </h1>

          <p className="text-slate-500 text-lg md:text-xl max-w-2xl font-medium mb-12 leading-relaxed">
            Discover and book premium grooming services instantly. No more waiting lines, just pure style.
          </p>

          {/* RESPONSIVE SEARCH BOX */}
          <div className="w-full max-w-3xl bg-slate-50 p-2 rounded-[2.5rem] border border-slate-200 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-50 transition-all flex flex-col md:flex-row items-center gap-2">
            <div className="flex-1 flex items-center w-full px-5 py-2">
              <Search className="text-slate-400" size={22} />
              <input
                type="text"
                placeholder="Search salons or services..."
                className="w-full py-3 px-4 bg-transparent focus:outline-none text-slate-800 font-bold placeholder:text-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="w-full md:w-auto bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black hover:bg-indigo-600 transition-all active:scale-95 shadow-xl">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* STICKY FILTER BAR */}
      <div className="sticky top-[64px] z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 py-4 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar touch-pan-x">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeFilter === f
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                  : "bg-white text-slate-500 border border-slate-200 hover:border-slate-400"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SALONS GRID */}
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Handpicked for you</h2>
            <p className="text-slate-400 font-medium text-sm">Top rated spots in your current area</p>
          </div>
          <button className="bg-white p-3 rounded-2xl border border-slate-200 text-slate-400 hover:text-indigo-600 transition-colors">
            <SlidersHorizontal size={20} />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse space-y-6 bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="aspect-[4/5] bg-slate-100 rounded-[2rem]"></div>
                <div className="h-6 bg-slate-100 rounded-xl w-3/4 mx-2"></div>
                <div className="h-4 bg-slate-100 rounded-xl w-1/2 mx-2"></div>
              </div>
            ))}
          </div>
        ) : filteredSalons.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {filteredSalons.map((salon) => (
              <div key={salon._id} className="hover:-translate-y-2 transition-transform duration-500">
                <SalonCard salon={salon} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin size={32} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No salons found</h3>
            <p className="text-slate-400 mt-2">Try adjusting your filters or search keywords.</p>
          </div>
        )}
      </main>

      <footer className="bg-white py-12 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-xs font-black uppercase tracking-widest">© 2026 SalonLink Global</p>
      </footer>
    </div>
  );
}