import { useState } from 'react';
import { calcAPI } from '../services/api.js';
import ModuleHeader from '../components/ModuleHeader.jsx';
import TheoryCard from '../components/TheoryCard.jsx';
import ResultCard from '../components/ResultCard.jsx';
import StepsTable from '../components/StepsTable.jsx';
import { Calculator, Save, Check } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';

const NAZARIYA = `Nyuton usuli sonning kvadrat ildizini hisoblashda keng tarqalgan algoritmlardan biridir.

Formulasi:
xₙ₊₁ = ½ · (xₙ + S/xₙ)

Bu formula f(x) = x² - S funksiyasi uchun Nyuton-Rafson usulining xususiy holidir.

Xususiyatlari:
- Kvadrat konvergensiya (tez yaqinlashadi)
- Boshlang'ich taxmin x₀ > 0 bo'lishi kerak
- Aniqlik ε ga yetganda to'xtaydi`;

export default function Newton() {
  const [S, setS] = useState("25");
  const [x0, setX0] = useState("1");
  const [aniqlik, setAniqlik] = useState("0.0001");
  const [natija, setNatija] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saqlangan, setSaqlangan] = useState(false);
  const [xato, setXato] = useState('');

  const hisoblash = async () => {
    setXato('');
    setSaqlangan(false);
    const SVal = parseFloat(S);
    const x0Val = parseFloat(x0);
    const tolVal = parseFloat(aniqlik);
    if (isNaN(SVal) || isNaN(x0Val) || isNaN(tolVal) || SVal < 0 || x0Val <= 0 || tolVal <= 0) {
      setXato("S ≥ 0, x₀ > 0, aniqlik > 0 bo'lishi kerak.");
      return;
    }
    setLoading(true);
    try {
      const res = await calcAPI.newton({ S: SVal, x0: x0Val, tolerance: tolVal });
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
        methodName: 'newton',
        inputData: { S: parseFloat(S), x0: parseFloat(x0), tolerance: parseFloat(aniqlik) },
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
        sarlavha="Nyuton usuli (Kvadrat ildiz)"
        tavsif="Sonning kvadrat ildizini iteratsion usulda yuqori aniqlikda hisoblash."
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
              Kirish ma'lumotlari
            </h3>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-1">
                S (Ildiz ostidagi son)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={S}
                onChange={(e) => setS(e.target.value)}
                className="input-field"
                placeholder="25"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-1">
                x₀ (Boshlang'ich yaqinlashish)
              </label>
              <input
                type="number"
                min="0.01"
                step="any"
                value={x0}
                onChange={(e) => setX0(e.target.value)}
                className="input-field"
                placeholder="1"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-1">
                Aniqlik (Tolerance)
              </label>
              <input
                type="number"
                step="0.0000001"
                min="0.0000001"
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
                <><Calculator size={18} /> Hisoblash</>
              )}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {natija && (
            <>
              <div className="flex gap-4 items-start">
                <ResultCard
                  label={`√${S} natijasi`}
                  value={natija.natija.toFixed(10)}
                  color="blue"
                  icon={Calculator}
                />
                <button
                  onClick={saqlash}
                  className={`p-4 rounded-xl transition-all ${saqlangan 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-700'}`}
                >
                  {saqlangan ? <Check size={24} /> : <Save size={24} />}
                </button>
              </div>

              <StepsTable
                title="Iteratsiyalar bosqichlari"
                columns={[
                  { header: '№', key: 'iteratsiya', className: 'text-slate-400 w-16' },
                  { header: 'xₙ qiymati', key: 'x', format: (v) => v.toFixed(10), className: 'font-mono font-bold text-slate-800' },
                  { header: 'Xatolik', key: 'xatolik', format: (v) => v.toExponential(4), className: 'font-mono text-red-500' }
                ]}
                data={natija.qadamlar}
              />

              <div className="card">
                <div className="card-header">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Yaqinlashish grafigi
                  </h3>
                </div>
                <div className="p-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={natija.qadamlar}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis
                        dataKey="iteratsiya"
                        label={{ value: 'Iteratsiya', position: 'insideBottom', offset: -5 }}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        label={{ value: 'xₙ', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip
                        formatter={(value) => [value.toFixed(8), 'xₙ qiymati']}
                        labelFormatter={(label) => `Iteratsiya: ${label}`}
                      />
                      <ReferenceLine
                        y={natija.natija}
                        stroke="#10b981"
                        strokeDasharray="5 5"
                        label={{ value: `√${S} = ${natija.natija.toFixed(4)}`, fill: '#10b981', fontSize: 11 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="x"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}