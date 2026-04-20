import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ChevronRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await login(email, password);

    if (res.success) {
      res.role === 'shopkeeper' ? navigate('/shop-dashboard') : navigate('/');
    } else {
      alert(res.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-white md:bg-[#F9FAFB] flex items-center justify-center font-sans antialiased">
      <div className="w-full max-w-[440px] px-6 py-12 md:bg-white md:rounded-[40px] md:shadow-[0_20px_50px_rgba(0,0,0,0.04)] md:border md:border-slate-100">

        {/* BRANDING */}
        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
            Sign in<span className="text-indigo-600">.</span>
          </h1>
          <p className="text-slate-500 font-medium text-base">
            Enter your credentials to access your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* EMAIL FIELD */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 flex justify-center border-r border-slate-100 group-focus-within:border-indigo-600 transition-colors">
                <Mail size={18} className="text-slate-300 group-focus-within:text-indigo-600" />
              </div>
              <input
                required
                className="w-full pl-16 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-600/10 text-slate-900 font-semibold transition-all outline-none placeholder:text-slate-300"
                type="email"
                placeholder="you@example.com"
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* PASSWORD FIELD */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Password
              </label>
            </div>
            <div className="relative group">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 flex justify-center border-r border-slate-100 group-focus-within:border-indigo-600 transition-colors">
                <Lock size={18} className="text-slate-300 group-focus-within:text-indigo-600" />
              </div>
              <input
                required
                className="w-full pl-16 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-600/10 text-slate-900 font-semibold transition-all outline-none placeholder:text-slate-300"
                type="password"
                placeholder="••••••••"
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all active:scale-[0.98] shadow-xl shadow-slate-200 disabled:opacity-70"
            >
              {isLoading ? "Authenticating..." : "Continue"}
              <ChevronRight size={18} />
            </button>
          </div>
        </form>

        {/* BOTTOM NAV */}
        <div className="mt-12 pt-8 border-t border-slate-50 text-center">
          <p className="text-slate-500 text-sm">
            New here?{' '}
            <Link to="/register" className="text-indigo-600 font-bold hover:text-slate-900 transition-colors">
              Create an account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}