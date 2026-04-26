import { useState } from 'react';
import { calcAPI } from '../services/api.js';
import ModuleHeader from '../components/ModuleHeader.jsx';
import TheoryCard from '../components/TheoryCard.jsx';
import ResultCard from '../components/ResultCard.jsx';
import StepsTable from '../components/StepsTable.jsx';
import { RefreshCw, Save, Check } from 'lucide-react';

const NAZARIYA = `Oddiy iteratsiya usuli f(x) = 0 tenglamani x = g(x) ko'rinishiga keltirib echadi.

xₙ₊₁ = g(xₙ) ketma-ketligi |g'(x)| < 1 sharti bajarilganda ildizga yaqinlashadi.

Formulada ishlatish mumkin bo'lgan funksiyalar:
  sin(x), cos(x), tan(x), sqrt(x), abs(x), 
  log(x), exp(x), pow(x, n), cbrt(x)

Konstantalar: PI, E

Misol: x = cos(x) tenglamani echish uchun formula: cos(x)`;

const MISOLLAR = [
  { yorliq: "cos(x)", qiymat: "cos(x)" },
  { yorliq: "√(x+2)", qiymat: "sqrt(x + 2)" },
  { yorliq: "(x²+2)/3", qiymat: "(pow(x, 2) + 2) / 3" },
  { yorliq: "eˣ/5", qiymat: "exp(x) / 5" },
  { yorliq: "ln(x+3)", qiymat: "log(x + 3)" },
];

export default function Iteration() {
  const [x0, setX0] = useState("0.5");
  const [aniqlik, setAniqlik] = useState("0.0001");
  const [formula, setFormula] = useState("cos(x)");
  const [natija, setNatija] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saqlangan, setSaqlangan] = useState(false);
  const [xato, setXato] = useState('');

  const hisoblash = async () => {
    setXato('');
    setSaqlangan(false);
    setNatija(null);

    if (!formula.trim()) {
      setXato("Formula bo'sh bo'lishi mumkin emas.");
      return;
    }

    const x0Val = parseFloat(x0);
    const tolVal = parseFloat(aniqlik);

    if (isNaN(x0Val) || isNaN(tolVal) || tolVal <= 0) {
      setXato("To'g'ri boshlang'ich qiymat va aniqlik kiriting.");
      return;
    }

    setLoading(true);
    try {
      const res = await calcAPI.iteration({ 
        x0: x0Val, 
        tolerance: tolVal, 
        formula: formula.trim() 
      });

      if (res.data.xato) {
        setXato(res.data.xato);
      } else {
        setNatija(res.data);
      }
    } catch (err) {
      setXato(err.response?.data?.xato || 'Hisoblashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const saqlash = async () => {
    if (!natija) return;
    try {
      await calcAPI.save({
        methodName: 'iteration',
        inputData: { x0: parseFloat(x0), tolerance: parseFloat(aniqlik), formula },
        resultData: { natija: natija.natija },
        steps: natija.qadamlar
      });
      setSaqlangan(true);
      setTimeout(() => setSaqlangan(false), 2000);
    } catch (err) {
      console.error('Saqlash xatosi:', err);
    }
  };

  return (
    <div className="py-4">
      <ModuleHeader
        sarlavha="Oddiy iteratsiya usuli"
        tavsif="Tenglamalarni taqribiy echishning universal usuli."
      />
      <TheoryCard mazmun={NAZARIYA} />

      {xato && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          ⚠️ {xato}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="card lg:col-span-1">
          <div className="card-header">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Konfiguratsiya
            </h3>
          </div>
          <div className="p-6 space-y-5">
            {/* Formula */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-1">
                g(x) formulasi
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm select-none">
                  x =
                </span>
                <input
                  value={formula}
                  onChange={(e) => setFormula(e.target.value)}
                  placeholder="masalan: cos(x)"
                  className="input-field pl-12 font-mono"
                />
              </div>

              <div className="mt-2">
                <p className="text-xs text-slate-400 ml-1 mb-1">Tez kiritish:</p>
                <div className="flex flex-wrap gap-2">
                  {MISOLLAR.map((m) => (
                    <button
                      key={m.qiymat}
                      onClick={() => setFormula(m.qiymat)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono border transition-all ${
                        formula === m.qiymat
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-600"
                      }`}
                    >
                      {m.yorliq}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-1">
                x₀ (Boshlang'ich qiymat)
              </label>
              <input
                type="number"
                step="0.1"
                value={x0}
                onChange={(e) => setX0(e.target.value)}
                className="input-field"
                placeholder="0.5"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-1">
                Aniqlik (ε)
              </label>
              <input
                type="number"
                step="0.00001"
                value={aniqlik}
                onChange={(e) => setAniqlik(e.target.value)}
                className="input-field"
                placeholder="0.0001"
              />
            </div>
            <button
              onClick={hisoblash}
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><RefreshCw size={18} /> Boshlash</>
              )}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {natija && (
            <>
              <ResultCard
                label={`x = ${formula}`}
                value={natija.natija.toFixed(8)}
                color="gradient"
                icon={RefreshCw}
              />
              <p className="text-sm text-slate-500 text-center">
                {natija.qadamlar.length} iteratsiyada topildi
              </p>

              <div className="flex justify-end">
                <button
                  onClick={saqlash}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${saqlangan 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-700'}`}
                >
                  {saqlangan ? <><Check size={16} /> Saqlandi</> : <><Save size={16} /> Tarixga saqlash</>}
                </button>
              </div>

              <StepsTable
                title="Hisoblash bosqichlari"
                columns={[
                  { header: '#', key: 'iteratsiya', className: 'text-slate-400 w-12' },
                  { header: 'xₙ', key: 'x', format: (v) => v.toFixed(10), className: 'font-mono text-slate-800' },
                  { header: 'Xatolik |xₙ - xₙ₋₁|', key: 'xatolik', format: (v) => v.toExponential(4), className: 'font-mono text-slate-500 text-xs' }
                ]}
                data={natija.qadamlar}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
