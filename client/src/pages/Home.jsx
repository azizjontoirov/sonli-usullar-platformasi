import { useNavigate } from 'react-router-dom';
import { 
  Calculator, FunctionSquare, RefreshCw, 
  Truck, TrendingUp, BookOpen, ArrowRight 
} from 'lucide-react';

const KARTALAR = [
  {
    sarlavha: "Gorner usuli",
    tavsif: "Ko'phadni hisoblashning samarali sxemasi. Kam ko'paytirish bilan natija.",
    kalit: "/gorner",
    rang: "bg-blue-500",
    icon: Calculator
  },
  {
    sarlavha: "Teylor sin(x)",
    tavsif: "sin funksiyasini qator yordamida taqribiy hisoblash.",
    kalit: "/taylor-sin",
    rang: "bg-indigo-500",
    icon: FunctionSquare
  },
  {
    sarlavha: "Teylor cos(x)",
    tavsif: "cos funksiyasini qator yordamida taqribiy hisoblash.",
    kalit: "/taylor-cos",
    rang: "bg-violet-500",
    icon: FunctionSquare
  },
  {
    sarlavha: "Nyuton usuli",
    tavsif: "Sonning kvadrat ildizini iteratsion usulda hisoblash.",
    kalit: "/nyuton",
    rang: "bg-cyan-500",
    icon: Calculator
  },
  {
    sarlavha: "Oddiy iteratsiya",
    tavsif: "Tenglamalarni taqribiy echishning universal usuli.",
    kalit: "/iteratsiya",
    rang: "bg-teal-500",
    icon: RefreshCw
  },
  {
    sarlavha: "Transport masalasi",
    tavsif: "Yuk tashish xarajatlarini optimallashtirish. 3 ta usul.",
    kalit: "/transport",
    rang: "bg-emerald-500",
    icon: Truck
  },
  {
    sarlavha: "Investitsiya taqsimlash",
    tavsif: "Resurslarni loyihalar o'rtasida optimal taqsimlash.",
    kalit: "/investitsiya",
    rang: "bg-orange-500",
    icon: TrendingUp
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="space-y-10 py-4">
      {/* Hero */}
      <header className="max-w-2xl space-y-5">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
          <BookOpen size={16} />
          Talabalar uchun o'quv platformasi
        </div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Sonli usullar va{" "}
          <span className="text-blue-600 underline decoration-blue-200 underline-offset-8">
            chiziqli dasturlash
          </span>
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          Matematik usullarni bosqichma-bosqich o'rganing, masalalarni yeching
          va natijalarni tahlil qiling. Hisoblashlaringiz avtomatik saqlanadi.
        </p>
      </header>

      {/* Kartalar */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4">Mavjud modullar</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {KARTALAR.map((karta) => {
            const Icon = karta.icon;
            return (
              <button
                key={karta.kalit}
                onClick={() => navigate(karta.kalit)}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all text-left group"
              >
                <div className={`w-12 h-12 ${karta.rang} rounded-xl mb-4 flex items-center justify-center shadow-lg`}>
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{karta.sarlavha}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{karta.tavsif}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-blue-600 text-sm font-semibold group-hover:gap-2 transition-all">
                  Ochish <ArrowRight size={16} />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Statistika */}
      <div className="grid grid-cols-3 gap-4 max-w-lg">
        <div className="text-center p-4 bg-white rounded-xl border border-slate-100">
          <p className="text-3xl font-black text-blue-600">7</p>
          <p className="text-xs text-slate-500 mt-1">Modullar</p>
        </div>
        <div className="text-center p-4 bg-white rounded-xl border border-slate-100">
          <p className="text-3xl font-black text-emerald-600">3</p>
          <p className="text-xs text-slate-500 mt-1">Transport usullari</p>
        </div>
        <div className="text-center p-4 bg-white rounded-xl border border-slate-100">
          <p className="text-3xl font-black text-violet-600">∞</p>
          <p className="text-xs text-slate-500 mt-1">Misolalar</p>
        </div>
      </div>
    </div>
  );
}
