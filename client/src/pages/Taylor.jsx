import { useState } from 'react';
import { calcAPI } from '../services/api.js';
import ModuleHeader from '../components/ModuleHeader.jsx';
import TheoryCard from '../components/TheoryCard.jsx';
import ResultCard from '../components/ResultCard.jsx';
import StepsTable from '../components/StepsTable.jsx';
import { FunctionSquare, Save, Check } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Legend, ResponsiveContainer } from 'recharts';

export default function Taylor({ tur }) {
  const [x, setX] = useState("0.5");
  const [n, setN] = useState("5");
  const [natija, setNatija] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saqlangan, setSaqlangan] = useState(false);
  const [xato, setXato] = useState('');

  const nazariya = tur === "sin"
    ? `sin(x) funksiyasining Teylor qatori:

sin(x) = x - x³/3! + x⁵/5! - x⁷/7! + ...

= Σ (-1)ᵏ · x²ᵏ⁺¹ / (2k+1)!

Bu ko'phadlar ko'rinishida funksiyani taqribiy hisoblash imkonini beradi.`
    : `cos(x) funksiyasining Teylor qatori:

cos(x) = 1 - x²/2! + x⁴/4! - x⁶/6! + ...

= Σ (-1)ᵏ · x²ᵏ / (2k)!

Katta n (iteratsiyalar soni) aniqlikni oshiradi.`;

  const hisoblash = async () => {
    setXato('');
    setSaqlangan(false);
    const xVal = parseFloat(x);
    const nVal = parseInt(n);
    if (isNaN(xVal) || isNaN(nVal) || nVal < 1) {
      setXato("To'g'ri qiymat kiriting. n > 0 bo'lishi kerak.");
      return;
    }
    setLoading(true);
    try {
      const res = await calcAPI.taylor({ x: xVal, n: nVal, type: tur });
      setNatija(res.data);
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
        methodName: `taylor-${tur}`,
        inputData: { x: parseFloat(x), n: parseInt(n), type: tur },
        resultData: { taqribiy: natija.taqribiy, aniq: natija.aniq },
        steps: natija.qadamlar
      });
      setSaqlangan(true);
      setTimeout(() => setSaqlangan(false), 2000);
    } catch (err) {
      console.error('Saqlash xatosi:', err);
    }
  };

  const grafikMalumot = natija?.qadamlar?.map((q, i) => ({
    n: i + 1,
    taqribiy: q.joriyYigindi,
    aniq: natija.aniq,
    xatolik: Math.abs(q.xatolik)
  }));

  return (
    <div className="py-4">
      <ModuleHeader
        sarlavha={`${tur.toUpperCase()}(x) — Teylor qatori`}
        tavsif="Funksiyani ko'phad yordamida taqribiy hisoblash va aniq qiymat bilan solishtirish."
      />
      <TheoryCard mazmun={nazariya} />

      {xato && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          ⚠️ {xato}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="card lg:col-span-1">
          <div className="card-header">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Kirish ma'lumotlari
            </h3>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-1">
                X qiymati (radianlarda)
              </label>
              <input
                type="number"
                step="0.1"
                value={x}
                onChange={(e) => setX(e.target.value)}
                className="input-field"
                placeholder="0.5"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-1">
                Iteratsiyalar soni (n)
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={n}
                onChange={(e) => setN(e.target.value)}
                className="input-field"
                placeholder="5"
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
                <><FunctionSquare size={18} /> Hisoblash</>
              )}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {natija && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <ResultCard
                  label="Aniq qiymat"
                  value={natija.aniq.toFixed(8)}
                  color="green"
                  icon={FunctionSquare}
                />
                <ResultCard
                  label="Taqribiy qiymat"
                  value={natija.taqribiy.toFixed(8)}
                  color="blue"
                  icon={FunctionSquare}
                />
              </div>

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

              <div className="card">
                <div className="card-header">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Yaqinlashish grafigi
                  </h3>
                </div>
                <div className="p-6">
                   <div className="p-6">
                  <ResponsiveContainer width="100%" height={320}>
                    <LineChart data={grafikMalumot} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis
                        dataKey="n"
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip
                        formatter={(value, name) => [
                          value.toFixed(8),
                          name === 'taqribiy' ? "Taqribiy qiymat" : "Aniq qiymat"
                        ]}
                        labelFormatter={(label) => `Iteratsiya: ${label}`}
                      />
                      <Legend
                        verticalAlign="top"
                        height={36}
                        formatter={(value) => value === 'taqribiy' ? "Taqribiy qiymat" : "Aniq qiymat"}
                      />
                      <ReferenceLine
                        y={natija.aniq}
                        stroke="#10b981"
                        strokeDasharray="5 5"
                      />
                      <Line
                        type="monotone"
                        dataKey="taqribiy"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6', r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="aniq"
                        stroke="#10b981"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                </div>
              </div>

              <StepsTable
                title="Iteratsiyalar jadvali"
                columns={[
                  { header: '#', key: 'iteratsiya', format: (v) => v + 1, className: 'text-slate-400 w-12' },
                  { header: 'Had qiymati', key: 'had', format: (v) => v.toFixed(8), className: 'font-mono text-slate-700' },
                  { header: "Yig'indi", key: 'joriyYigindi', format: (v) => v.toFixed(8), className: 'font-mono font-bold text-blue-600' },
                  { header: 'Xatolik', key: 'xatolik', format: (v) => v.toExponential(3), className: 'font-mono text-red-500 text-xs' }
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