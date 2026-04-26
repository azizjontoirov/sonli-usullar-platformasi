import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { LogIn, UserPlus, Eye, EyeOff, Calculator } from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [xato, setXato] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: ''
  });

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setXato('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setXato('');

    try {
      if (isLogin) {
        await login(formData.username, formData.password);
      } else {
        if (!formData.email || !formData.fullName) {
          setXato("Barcha maydonlarni to'ldiring");
          setLoading(false);
          return;
        }
        await register(formData.username, formData.email, formData.password, formData.fullName);
      }
      navigate('/');
    } catch (err) {
      setXato(err.response?.data?.xato || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
            <Calculator size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900">Sonli Usullar</h1>
          <p className="text-slate-500 mt-2">Matematik usullarni o'rganing va hisoblang</p>
        </div>

        {/* Forma */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6">
            {isLogin ? 'Tizimga kirish' : "Ro'yxatdan o'tish"}
          </h2>

          {xato && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              ⚠️ {xato}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-1">
                Username
              </label>
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="input-field"
                placeholder="username"
                required
              />
            </div>

            {!isLogin && (
              <>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-1">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="email@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-1">
                    To'liq ism
                  </label>
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Ali Valiyev"
                    required
                  />
                </div>
              </>
            )}

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-1">
                Parol
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pr-12"
                  placeholder="••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isLogin ? (
                <><LogIn size={18} /> Kirish</>
              ) : (
                <><UserPlus size={18} /> Ro'yxatdan o'tish</>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setXato('');
              }}
              className="text-blue-600 text-sm font-medium hover:underline"
            >
              {isLogin 
                ? "Hisobingiz yo'qmi? Ro'yxatdan o'ting" 
                : "Allaqachon hisobingiz bormi? Kiring"}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          © 2026 Sonli Usullar Platformasi
        </p>
      </div>
    </div>
  );
}
