import { useState } from "react";
import { Calendar, Clock } from "lucide-react";

export default function SlotPicker({ onSelect }) {
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null);

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      dayName: i === 0 ? "Today" : date.toLocaleDateString('en-US', { weekday: 'short' }),
      dateNum: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      fullDate: date.toLocaleDateString('en-US', { day: 'numeric', month: 'long' })
    };
  });

  const timeSlots = ["10:00 AM", "11:30 AM", "01:00 PM", "02:30 PM", "04:00 PM", "05:30 PM"];

  const handleSelection = (time) => {
    setSelectedTime(time);
    onSelect(`${days[selectedDate].fullDate} at ${time}`);
  };

  return (
    <div className="space-y-6">
      {/* COMPACT DATE STRIP */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h4 className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 flex items-center gap-2">
            <Calendar size={12} /> Select Date
          </h4>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar snap-x">
          {days.map((day, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedDate(idx)}
              className={`snap-center flex flex-col items-center min-w-[60px] py-3 rounded-2xl border transition-all duration-300 ${selectedDate === idx
                ? "bg-slate-900 border-slate-900 shadow-lg shadow-slate-200"
                : "bg-white border-slate-100"
                }`}
            >
              <span className="text-[9px] font-black uppercase tracking-tighter text-slate-400">
                {day.dayName}
              </span>
              <span className={`text-lg font-black mt-0.5 ${selectedDate === idx ? "text-white" : "text-slate-900"}`}>
                {day.dateNum}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* TIME GRID */}
      <div>
        <h4 className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-3 px-1 flex items-center gap-2">
          <Clock size={12} /> Select Time
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {timeSlots.map((time) => (
            <button
              key={time}
              onClick={() => handleSelection(time)}
              className={`py-3 rounded-xl text-[11px] font-black transition-all border ${selectedTime === time
                ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100"
                : "bg-slate-50 border-transparent text-slate-600 hover:bg-slate-100"
                }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}