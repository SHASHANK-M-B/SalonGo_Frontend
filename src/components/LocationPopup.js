import { useState, useContext } from "react";
import { LocationContext } from "../context/LocationContext";
import { Navigation, MapPin, Search, X, Map as MapIcon, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function LocationPopup() {
  const { showPopup, setShowPopup, saveLocation } = useContext(LocationContext);
  const [manualAddress, setManualAddress] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);

  if (!showPopup) return null;

  const handleDetectLocation = () => {
    setIsDetecting(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();

            let city = data.address.city || data.address.town || data.address.village || "Current Location";
            let area = data.address.suburb || data.address.neighborhood || "";

            const formattedLocation = area ? `${area}, ${city}` : city;
            saveLocation(formattedLocation);
            toast.success("Location set to " + formattedLocation);
          } catch (error) {
            saveLocation("Current Location");
            toast.success("Location detected!");
          } finally {
            setIsDetecting(false);
          }
        },
        () => {
          toast.error("Location access denied. Please enter manually.");
          setIsDetecting(false);
        }
      );
    } else {
      toast.error("Geolocation not supported.");
      setIsDetecting(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualAddress.trim().length > 2) {
      saveLocation(manualAddress);
      toast.success("Location saved!");
    } else {
      toast.error("Please enter a valid area name.");
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        onClick={() => setShowPopup(false)}
      />

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden transform transition-all animate-in slide-in-from-bottom-10 duration-500">

        {/* Visual Header */}
        <div className="h-32 bg-gradient-to-br from-indigo-600 to-violet-700 relative flex items-center justify-center">
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setShowPopup(false)}
              className="bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/30 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="bg-white p-4 rounded-3xl shadow-xl shadow-indigo-900/20 translate-y-8">
            <MapIcon size={40} className="text-indigo-600" strokeWidth={1.5} />
          </div>
        </div>

        <div className="p-8 pt-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Set your location</h2>
            <p className="text-slate-500 mt-2 text-sm font-medium">
              Find the best stylists and grooming spots in your neighborhood.
            </p>
          </div>

          <div className="space-y-4">
            {/* Auto Detect Button */}
            <button
              onClick={handleDetectLocation}
              disabled={isDetecting}
              className="w-full group relative flex items-center justify-center gap-3 bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:active:scale-100"
            >
              {isDetecting ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Navigation size={18} className="group-hover:animate-bounce" />
              )}
              {isDetecting ? "Fetching Location..." : "Use Current Location"}
            </button>

            <div className="flex items-center gap-4 py-2">
              <div className="h-px bg-slate-100 flex-1" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Or search manually</span>
              <div className="h-px bg-slate-100 flex-1" />
            </div>

            {/* Manual Form */}
            <form onSubmit={handleManualSubmit} className="space-y-3">
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Search size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Enter your city or neighborhood..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all"
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 active:scale-[0.98] transition-all"
              >
                Confirm Location
              </button>
            </form>
          </div>

          <p className="text-center mt-6 text-[11px] text-slate-400 font-medium">
            We use your location only to find nearby services.
            <span className="text-indigo-500 ml-1 cursor-pointer hover:underline">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}