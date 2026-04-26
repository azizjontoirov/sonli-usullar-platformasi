import { useState } from 'react';
import { calcAPI } from '../services/api.js';
import ModuleHeader from '../components/ModuleHeader.jsx';
import TheoryCard from '../components/TheoryCard.jsx';
import ResultCard from '../components/ResultCard.jsx';
import { Truck, Save, Check } from 'lucide-react';

const NAZARIYA = `Transport masalasi — tovarlarni manbalardan iste'molchilarga minimal xarajat bilan etkazib berish masalasidir.

1. Shimoli-g'arbiy burchak usuli — eng sodda usul, lekin optimal emas.
2. Minimal xarajat usuli — arzon yo'llardan boshlanadi, yaxshiroq natija.
3. Vogel aproksimatsiyasi — jarima usuli, ko'proq optimal echimni topadi.`;

export default function Transport() {
  const [taminot, setTaminot] = useState("20, 30, 25");
  const [ehtiyoj, setEhtiyoj] = useState("25, 25, 25");
  const [xarajatlar, setXarajatlar] = useState("8, 6, 10\n9, 12, 13\n14, 9, 16");
  const [usul, setUsul] = useState("vogel");
  const [natija, setNatija] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saqlangan, setSaqlangan] = useState(false);
  const [xato, setXato] = useState('');

  const hisoblash = async () => {
    setXato('');
    setSaqlangan(false);

    const sArr = taminot.split(",").map((s) => parseInt(s.trim()));
    const dArr = ehtiyoj.split(",").map((d) => parseInt(d.trim()));
    const cMat = xarajatlar.split("\n").map((satr) =>
      satr.split(",").map((c) => parseInt(c.trim()))
    );

    if (sArr.some(isNaN) || dArr.some(isNaN) || cMat.some((r) => r.some(isNaN))) {
      setXato("Ma'lumotlar formatini tekshiring. Vergul bilan ajrating.");
      return;
    }

    const sSum = sArr.reduce((a, b) => a + b, 0);
    const dSum = dArr.reduce((a, b) => a + b, 0);
    if (sSum !== dSum) {
      setXato(`Ta'minot (${sSum}) va ehtiyoj (${dSum}) teng bo'lishi kerak!`);
      return;
    }

    setLoading(true);
    try {
      const res = await calcAPI.transport({ 
        supply: sArr, 
        demand: dArr, 
        costs: cMat, 
        method: usul 
      });
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
        methodName: `transport-${usul}`,
        inputData: { supply: taminot, demand: ehtiyoj, costs: xarajatlar, method: usul },
        resultData: { umumiyXarajat: natija.umumiyXarajat, taqsimlash: natija.taqsimlash },
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
        sarlavha="Transport masalasi"
        tavsif="Yuk tashish xarajatlarini optimallashtirish va optimal rejani tuzish."
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
                Ta'minot (Supply)
              </label>
              <textarea
                className="input-field h-16 resize-none"
                value={taminot}
                onChange={(e) => setTaminot(e.target.value)}
                placeholder="20, 30, 25"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-1">
                Ehtiyoj (Demand)
              </label>
              <textarea
                className="input-field h-16 resize-none"
                value={ehtiyoj}
                onChange={(e) => setEhtiyoj(e.target.value)}
                placeholder="25, 25, 25"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-1">
                Xarajatlar matritsasi
              </label>
              <p className="text-xs text-slate-400 ml-1 mb-1">Har bir qator yangi satrda, vergul bilan</p>
              <textarea
                className="input-field h-28 font-mono resize-none"
                value={xarajatlar}
                onChange={(e) => setXarajatlar(e.target.value)}
                placeholder="8, 6, 10&#10;9, 12, 13&#10;14, 9, 16"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-1">
                Usul
              </label>
              <select
                value={usul}
                onChange={(e) => setUsul(e.target.value)}
                className="input-field bg-white"
              >
                <option value="northwest">Shimoli-g'arbiy burchak</option>
                <option value="leastcost">Minimal xarajat usuli</option>
                <option value="vogel">Vogel aproksimatsiyasi</option>
              </select>
            </div>
            <button
              onClick={hisoblash}
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><Truck size={18} /> Rejani tuzish</>
              )}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {natija && (
            <>
              <div className="flex gap-4 items-start">
                <ResultCard
                  label="Umumiy xarajat"
                  value={`${natija.umumiyXarajat} birlik`}
                  color="emerald"
                  icon={Truck}
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

              {/* Taqsimot matritsasi */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Optimal taqsimot matritsasi
                  </h3>
                </div>
                <div className="p-6 overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr>
                        <th className="p-3 border border-slate-100 bg-slate-50" />
                        {natija.taqsimlash[0].map((_, j) => (
                          <th key={j} className="p-3 border border-slate-100 bg-slate-50 text-slate-500 text-xs">
                            Mijoz {j + 1}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {natija.taqsimlash.map((satr, i) => (
                        <tr key={i}>
                          <th className="p-3 border border-slate-100 bg-slate-50 text-slate-500 text-xs">
                            Manba {i + 1}
                          </th>
                          {satr.map((val, j) => (
                            <td key={j} className="p-3 border border-slate-100 text-center">
                              {val > 0 ? (
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg font-bold text-sm">
                                  {val}
                                </span>
                              ) : (
                                <span className="text-slate-300">—</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Qadamlar */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Hisoblash qadamlari
                  </h3>
                </div>
                <div className="p-6 space-y-3">
                  {natija.qadamlar.map((q, i) => (
                    <div key={i} className="flex gap-4 items-start p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-200 text-xs font-bold text-slate-400 shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-sm text-slate-800">
                          <strong>Manba {q.i + 1}</strong> dan <strong>Mijoz {q.j + 1}</strong> ga{" "}
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs font-bold">
                            {q.miqdor} ta
                          </span>{" "}
                          mahsulot yuborildi.
                        </p>
                        <p className="text-xs text-slate-500 mt-1">Xarajat: {q.xarajat} birlik/dona</p>
                        {q.jarima !== undefined && (
                          <p className="text-xs text-orange-500 mt-0.5">Jarima: {q.jarima}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
