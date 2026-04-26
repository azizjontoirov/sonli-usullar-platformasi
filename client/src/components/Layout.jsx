import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Home, Calculator, FunctionSquare, RefreshCw, Truck, TrendingUp, LogOut, Menu, X, User, Clock } from 'lucide-react';

const MENYU = [
  { sarlavha: "Bosh sahifa", emoji: Home, kalit: "/", bolim: "Asosiy" },
  { sarlavha: "Gorner usuli", emoji: Calculator, kalit: "/gorner", bolim: "Sonli usullar" },
  { sarlavha: "sin(x) — Teylor", emoji: FunctionSquare, kalit: "/taylor-sin", bolim: "Sonli usullar" },
  { sarlavha: "cos(x) — Teylor", emoji: FunctionSquare, kalit: "/taylor-cos", bolim: "Sonli usullar" },
  { sarlavha: "Nyuton usuli (√S)", emoji: Calculator, kalit: "/nyuton", bolim: "Sonli usullar" },
  { sarlavha: "Oddiy iteratsiya", emoji: RefreshCw, kalit: "/iteratsiya", bolim: "Sonli usullar" },
  { sarlavha: "Transport masalasi", emoji: Truck, kalit: "/transport", bolim: "Chiziqli dasturlash" },
  { sarlavha: "Investitsiya taqsimlash", emoji: TrendingUp, kalit: "/investitsiya", bolim: "Chiziqli dasturlash" },
  { sarlavha: "Hisoblash tarixi", emoji: Clock, kalit: "/tarix", bolim: "Asosiy" },
];

const BOLIMLAR = ["Asosiy", "Sonli usullar", "Chiziqli dasturlash"];

export default function Layout({ children }) {
  const [sidebarOchiq, setSidebarOchiq] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOchiq ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-black leading-tight tracking-tight">
            Sonli<br />
            <span className="text-blue-400">Usullar</span>
          </h1>
          <div className="h-1 w-12 bg-blue-500 mt-3 rounded-full" />
        </div>

        {/* Foydalanuvchi ma'lumotlari */}
        {user && (
          <div className="px-6 py-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <User size={20} />
              </div>
              <div>
                <p className="font-semibold text-sm">{user.fullName || user.username}</p>
                <p className="text-xs text-slate-400 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigatsiya */}
        <nav className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
          {BOLIMLAR.map((bolim) => (
            <div key={bolim}>
              <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1 ml-2">
                {bolim}
              </p>
              <div className="space-y-1">
                {MENYU.filter((m) => m.bolim === bolim).map((element) => {
                  const Icon = element.emoji;
                  const faol = location.pathname === element.kalit;
                  return (
                    <button
                      key={element.kalit}
                      onClick={() => {
                        navigate(element.kalit);
                        setSidebarOchiq(false);
                      }}
                      className={`sidebar-link ${faol ? 'sidebar-link-active' : 'sidebar-link-inactive'}`}
                    >
                      <Icon size={18} />
                      <span>{element.sarlavha}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-red-400 hover:bg-red-900/30 transition-all text-left"
          >
            <LogOut size={18} />
            <span>Chiqish</span>
          </button>
        </div>

        <div className="p-4 text-xs text-slate-600 text-center">
          v2.0 • Talabalar Platformasi
        </div>
      </aside>

      {/* Mobil menu tugmasi */}
      <button
        onClick={() => setSidebarOchiq(!sidebarOchiq)}
        className="lg:hidden fixed top-4 left-4 z-[60] p-2.5 bg-slate-900 text-white rounded-xl shadow-lg border border-slate-700"
      >
        {sidebarOchiq ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay (mobil) */}
      {sidebarOchiq && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOchiq(false)}
        />
      )}

      {/* Asosiy kontent */}
      <main className="flex-1 lg:ml-72 min-h-screen">
        <div className="p-6 md:p-10 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
