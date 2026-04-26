import { useState } from 'react';
import { calcAPI } from '../services/api.js';
import ModuleHeader from '../components/ModuleHeader.jsx';
import TheoryCard from '../components/TheoryCard.jsx';
import ResultCard from '../components/ResultCard.jsx';
import StepsTable from '../components/StepsTable.jsx';
import { TrendingUp, Save, Check, Plus, X } from 'lucide-react';

const NAZARIYA = `Investitsiyalarni taqsimlash masalasi dinamik dasturlash yordamida echiladi.

Berilgan cheklangan byudjetni turli loyihalar o'rtasida shunday taqsimlash kerakki, umumiy foyda maksimal bo'lsin.

Har bir loyiha uchun investitsiya qilingan har bir birlik uchun kutilayotgan foyda ma'lum bo'lishi lozim.

Formula: dp[i][b] = max(dp[i-1][b-x] + revenue[i][x])`;

export default function Investment() {
  const [byudjet, setByudjet] = useState("5");
  const [loyihalar, setLoyihalar] = useState([
    { nomi: "Kichik biznes", daromadlarMatn: "0, 10, 20, 30, 40, 50" },
    { nomi: "Ko'chmas mulk", daromadlarMatn: "0, 15, 25, 35, 45, 55" },
    { nomi: "Aksiyalar", daromadlarMatn: "0, 5, 18, 32, 45, 60" },
  ]);
  const [natija, setNatija] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saqlangan, setSaqlangan] = useState(false);
  const [xato, setXato] = useState('');

  const hisoblash = async () => {
    setXato('');
    setSaqlangan(false);

    const byudjetVal = parseInt(byudjet);
    if (isNaN(byudjetVal) || byudjetVal < 0) {
      setXato("To'g'ri byudjet kiriting.");
      return;
    }

    const loyihaData = loyihalar.map((l) => {
      const daromadlar = l.daromadlarMatn.split(",").map((r) => parseInt(r.trim()));
      if (daromadlar.some(isNaN)) {
        setXato(`'${l.nomi}' loyihasida noto'g'ri ma'lumot.`);
        return null;
      }
      return { nomi: l.nomi, daromadlar };
    });

    if (loyihaData.some(l => l === null)) return;

    setLoading(true);
    try {
      const res = await calcAPI.investment({ budget: byudjetVal, projects: loyihaData });
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
        methodName: 'investment',
        inputData: { budget: parseInt(byudjet), projects: loyihalar },
        resultData: { umumiyFoyda: natija.umumiyFoyda, taqsimlash: natija.taqsimlash },
        steps: natija.dpJadvali
      });
      setSaqlangan(true);
      setTimeout(() => setSaqlangan(false), 2000);
    } catch (err) {
      console.error('Saqlash xatosi:', err);
    }
  };

  const loyihaQoshish = () => {
    setLoyihalar([...loyihalar, { nomi: "Yangi loyiha", daromadlarMatn: "0, 5, 10, 15, 20" }]);
  };

  const loyihaYangilash = (index, maydon, qiymat) => {
    const yangi = [...loyihalar];
    yangi[index][maydon] = qiymat;
    setLoyihalar(yangi);
  };

  const loyihaOchirish = (index) => {
    if (loyihalar.length <= 1) {
      setXato("Kamida bitta loyiha bo'lishi kerak!");
      return;
    }
    setLoyihalar(loyihalar.filter((_, i) => i !== index));
  };

  return (
    <div className="py-4">
      <ModuleHeader
        sarlavha="Investitsiyalarni taqsimlash"
        tavsif="Maksimal foyda olish uchun resurslarni loyihalar o'rtasida optimal taqsimlash."
      />
      <TheoryCard mazmun={NAZARIYA} />

      {xato && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          ⚠️ {xato}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          {/* Byudjet */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Global sozlamalar
              </h3>
            </div>
            <div className="p-6">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-1">
                Umumiy byudjet (birliklarda)
              </label>
              <input
                type="number"
                min="0"
                value={byudjet}
                onChange={(e) => setByudjet(e.target.value)}
                className="input-field"
                placeholder="5"
              />
            </div>
          </div>

          {/* Loyihalar */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Loyihalar
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {loyihalar.map((loyiha, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-center mb-3">
                    <input
                      className="bg-transparent font-bold text-slate-800 outline-none flex-1 text-sm"
                      value={loyiha.nomi}
                      onChange={(e) => loyihaYangilash(i, "nomi", e.target.value)}
                    />
                    <button
                      onClick={() => loyihaOchirish(i)}
                      className="text-slate-400 hover:text-red-500 transition-colors ml-2"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div>
                    <label className="text-xs uppercase font-bold text-slate-400 block mb-1">
                      Foyda qatori (0 dan boshlab)
                    </label>
                    <input
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono outline-none focus:ring-2 focus:ring-blue-500"
                      value={loyiha.daromadlarMatn}
                      onChange={(e) => loyihaYangilash(i, "daromadlarMatn", e.target.value)}
                      placeholder="0, 10, 20..."
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={loyihaQoshish}
                className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-all text-sm font-medium flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Loyiha qo'shish
              </button>
              <button
                onClick={hisoblash}
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><TrendingUp size={18} /> Taqsimlash</>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {natija && (
            <>
              <div className="flex gap-4 items-start">
                <ResultCard
                  label="Maksimal kutilayotgan foyda"
                  value={`${natija.umumiyFoyda} birlik`}
                  color="blue"
                  icon={TrendingUp}
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

              {/* Taqsimlash kartalari */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {natija.taqsimlash.map((elem, i) => (
                  <div key={i} className="card hover:border-blue-200 transition-colors">
                    <div className="p-6">
                      <p className="text-slate-400 text-xs font-bold uppercase mb-2">{elem.loyiha}</p>
                      <div className="flex items-end gap-2">
                        <span className="text-3xl font-black text-slate-800">{elem.sarmoya}</span>
                        <span className="text-slate-500 mb-1 text-sm">birlik sarmoya</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* DP jadvali */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Dinamik dasturlash jadvali (DP Table)
                  </h3>
                </div>
                <div className="p-6 overflow-x-auto">
                  <table className="border-collapse text-xs">
                    <tbody>
                      {natija.dpJadvali.map((satr, i) => (
                        <tr key={i}>
                          <td className="p-2 border border-slate-100 bg-slate-50 font-bold text-slate-400 whitespace-nowrap w-12 text-center">
                            L{i}
                          </td>
                          {satr.map((val, j) => (
                            <td key={j} className={`p-2 border border-slate-100 text-center font-mono w-12 ${
                              val === natija.umumiyFoyda ? 'bg-blue-100 text-blue-700 font-bold' : 'text-slate-600'
                            }`}>
                              {val}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
