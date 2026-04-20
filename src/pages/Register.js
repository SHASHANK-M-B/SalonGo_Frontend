import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, UserCircle, Store, ChevronRight } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { name, email, password, role } = formData;
    const res = await register(name, email, password, role);

    if (res.success) {
      navigate(role === 'shopkeeper' ? '/shop-dashboard' : '/');
    } else {
      alert(res.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-white md:bg-[#F9FAFB] flex items-center justify-center font-sans antialiased py-12">
      <div className="w-full max-w-[480px] px-6 py-10 md:bg-white md:rounded-[40px] md:shadow-[0_20px_50px_rgba(0,0,0,0.04)] md:border md:border-slate-100">

        {/* HEADER */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
            Join Slon<span className="text-indigo-600">.</span>
          </h1>
          <p className="text-slate-500 font-medium">Create an account to start your journey.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ROLE SELECTOR (Segmented Control - Much more professional than a dropdown) */}
          <div className="bg-slate-50 p-1.5 rounded-2xl flex gap-1 mb-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'user' })}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${formData.role === 'user'
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-400 hover:text-slate-600"
                }`}
            >
              <UserCircle size={16} /> Customer
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'shopkeeper' })}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${formData.role === 'shopkeeper'
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-400 hover:text-slate-600"
                }`}
            >
              <Store size={16} /> Shopkeeper
            </button>
          </div>

          {/* NAME FIELD */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
              <input
                name="name"
                required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-600/10 text-slate-900 font-semibold transition-all outline-none"
                placeholder="John Doe"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* EMAIL FIELD */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
              <input
                name="email"
                type="email"
                required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-600/10 text-slate-900 font-semibold transition-all outline-none"
                placeholder="john@example.com"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* PASSWORD FIELD */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
              <input
                name="password"
                type="password"
                required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-600/10 text-slate-900 font-semibold transition-all outline-none"
                placeholder="••••••••"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* REGISTER BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-[0.98] disabled:opacity-70 mt-4"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
            <ChevronRight size={18} />
          </button>
        </form>

        {/* FOOTER */}
        <div className="mt-10 text-center">
          <p className="text-slate-500 text-sm font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-black hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}