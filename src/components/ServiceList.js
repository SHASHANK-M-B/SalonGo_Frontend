import { useState, useEffect } from "react";
import axios from "axios";
import { Check } from "lucide-react";

export default function ServiceList({ salonId, onSelectionChange }) {
  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (salonId) {
      axios.get(`http://localhost:5000/api/services/${salonId}`)
        .then(res => setServices(res.data))
        .catch(err => console.error(err));
    } else {
      setServices([{ _id: "1", name: "Haircut", price: 200, duration: 30 }, { _id: "2", name: "Beard Trim", price: 100, duration: 15 }, { _id: "3", name: "Facial Spa", price: 500, duration: 60 }]);
    }
  }, [salonId]);

  const toggleService = (service) => {
    const isSelected = selected.some(s => s._id === service._id);
    const newSelection = isSelected 
      ? selected.filter((s) => s._id !== service._id)
      : [...selected, service];
      
    setSelected(newSelection);
    onSelectionChange(newSelection);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 mt-6">
      <h2 className="text-2xl font-extrabold mb-6 text-slate-900">Select Services</h2>

      <div className="space-y-4">
        {services.map((service) => {
          const isSelected = selected.some(s => s._id === service._id);
          return (
            <div
              key={service._id}
              onClick={() => toggleService(service)}
              className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border-2 group ${
                isSelected
                  ? "border-indigo-600 bg-indigo-50/50 shadow-sm"
                  : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-md"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-6 h-6 rounded flex items-center justify-center border-2 transition-colors shrink-0 ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 group-hover:border-indigo-300'}`}>
                  {Array.isArray(selected) && isSelected && <Check size={16} className="text-white" />}
                </div>
                <div>
                  <h3 className={`text-base font-bold transition-colors ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>{service.name}</h3>
                  <p className="text-sm text-slate-500">{service.duration} mins</p>
                </div>
              </div>
              <span className={`font-extrabold text-lg ${isSelected ? 'text-indigo-600' : 'text-slate-900'}`}>₹{service.price}</span>
            </div>
          );
        })}
      </div>
      {services.length === 0 && (
         <p className="text-slate-500 text-center py-6 bg-slate-50 rounded-2xl">No services available for this salon.</p>
      )}
    </div>
  );
}