import { useState } from 'react';
import { calcAPI } from '../services/api.js';
import ModuleHeader from '../components/ModuleHeader.jsx';
import TheoryCard from '../components/TheoryCard.jsx';
import ResultCard from '../components/ResultCard.jsx';
import StepsTable from '../components/StepsTable.jsx';
import { Calculator, Save, Check } from 'lucide-react';

const NAZARIYA = `Gorner usuli ko'phadlarni hisoblashning samarali usulidir.

P(x) = aₙ·xⁿ + aₙ₋₁·xⁿ⁻¹ + ... + a₀ ko'rinishidagi ko'phad
P(x) = (...((aₙ·x + aₙ₋₁)·x + aₙ₋₂)·x + ...)·x + a₀ shaklida qayta yoziladi.

Bu usul ko'paytirish amallari sonini minimal darajaga tushiradi.`;

export default function Gorner() {
  const [koefflar, setKoefflar] = useState("1, -5, 6");
  const [x, setX] = useState("2");
  const [natija, setNatija] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saqlangan, setSaqlangan] = useState(false);
  const [xato, setXato] = useState('');

  const hisoblash = async () => {
    setXato('');
    setSaqlangan(false);

    const koeffArray = koefflar.split(",").map((c) => parseFloat(c.trim()));
    const xVal = parseFloat(x);

    if (koeffArray.some(isNaN) || isNaN(xVal)) {
      setXato("Iltimos, to'g'ri son kiriting.");
      return;
    }

    setLoading(true);
    try {
      const res = await calcAPI.gorner({ coefficients: koeffArray, x: xVal });
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
        methodName: 'gorner',
        inputData: { coefficients: koefflar.split(",").map(c => parseFloat(c.trim())), x: parseFloat(x) },
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
        sarlavha="Gorner usuli"
        tavsif="Ko'phadning berilgan nuqtadagi qiymatini hisoblashning eng samarali sxemasi."
      />
      <TheoryCard mazmun={NAZARIYA} />

      {xato && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          ⚠️ {xato}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Kirish maydonlari */}
        <div className="card lg:col-span-1">
          <div className="card-header">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Kirish ma'lumotlari
            </h3>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-1">
                Koeffitsientlar (vergul bilan)
              </label>
              <input
                value={koefflar}
                onChange={(e) => setKoefflar(e.target.value)}
                className="input-field font-mono"
                placeholder="1, -5, 6"
              />
              <p className="text-xs text-slate-400 mt-1 ml-1">Misol: 1, -5, 6 (x² - 5x + 6)</p>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-1">
                X qiymati
              </label>
              <input
                type="number"
                value={x}
                onChange={(e) => setX(e.target.value)}
                className="input-field"
                placeholder="2"
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

        {/* Natijalar */}
        <div className="lg:col-span-2 space-y-6">
          {natija && (
            <>
              <div className="flex gap-4 items-start">
                <ResultCard
                  label={`P(${x}) qiymati`}
                  value={natija.natija}
                  color="blue"
                  icon={Calculator}
                />
                <button
                  onClick={saqlash}
                  className={`p-4 rounded-xl transition-all ${saqlangan 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-700'}`}
                  title="Tarixga saqlash"
                >
                  {saqlangan ? <Check size={24} /> : <Save size={24} />}
                </button>
              </div>

              <StepsTable
                title="Bosqichma-bosqich yechim"
                columns={[
                  { header: '№', key: 'qadam', format: (v) => v + 1, className: 'text-slate-400 w-16' },
                  { header: 'Koeffitsient', key: 'koeffitsient', className: 'font-mono text-slate-700' },
                  { header: 'Natija', key: 'natija', className: 'font-bold text-blue-600 font-mono' }
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
