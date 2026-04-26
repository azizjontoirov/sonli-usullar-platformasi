import { useState, useEffect } from 'react';
import { calcAPI } from '../services/api.js';
import ModuleHeader from '../components/ModuleHeader.jsx';
import { Trash2, Clock, Calculator, ChevronDown, ChevronUp } from 'lucide-react';

const METHOD_NAMES = {
  'gorner': 'Gorner usuli',
  'taylor-sin': 'Teylor sin(x)',
  'taylor-cos': 'Teylor cos(x)',
  'newton': 'Nyuton usuli',
  'iteration': 'Oddiy iteratsiya',
  'transport-northwest': 'Transport (Sh-G)',
  'transport-leastcost': 'Transport (Min)',
  'transport-vogel': 'Transport (Vogel)',
  'investment': 'Investitsiya'
};

export default function History() {
  const [calculations, setCalculations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await calcAPI.getHistory();
      setCalculations(res.data.calculations);
    } catch (err) {
      console.error('Tarixni yuklashda xatolik:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCalculation = async (id) => {
    if (!confirm("Rostdan ham o'chirmoqchimisiz?")) return;
    try {
      await calcAPI.delete(id);
      setCalculations(calculations.filter(c => c.id !== id));
    } catch (err) {
      console.error("O'chirishda xatolik:", err);
    }
  };

  const filtered = filter 
    ? calculations.filter(c => c.method_name.includes(filter))
    : calculations;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="py-4">
      <ModuleHeader
        sarlavha="Hisoblashlar tarixi"
        tavsif="Siz bajargan barcha hisoblashlar ro'yxati."
      />

      {/* Filter */}
      <div className="mb-6 flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter('')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            filter === '' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-400'
          }`}
        >
          Barchasi
        </button>
        {Object.entries(METHOD_NAMES).map(([key, name]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === key ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-400'
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Clock size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">Hali hisoblashlar mavjud emas</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((calc) => (
            <div key={calc.id} className="card hover:shadow-md transition-shadow">
              <div 
                className="p-5 flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedId(expandedId === calc.id ? null : calc.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calculator size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">
                      {METHOD_NAMES[calc.method_name] || calc.method_name}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {new Date(calc.created_at).toLocaleString('uz-UZ')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCalculation(calc.id);
                    }}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                  {expandedId === calc.id ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                </div>
              </div>

              {expandedId === calc.id && (
                <div className="px-5 pb-5 border-t border-slate-100 pt-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-2">Kirish ma'lumotlari</p>
                      <pre className="text-xs text-slate-600 overflow-x-auto">
                        {JSON.stringify(calc.input_data, null, 2)}
                      </pre>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4">
                      <p className="text-xs font-bold text-blue-400 uppercase mb-2">Natija</p>
                      <pre className="text-xs text-slate-700 overflow-x-auto">
                        {JSON.stringify(calc.result_data, null, 2)}
                      </pre>
                    </div>
                  </div>
                  {calc.steps && calc.steps.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-2">Bosqichlar ({calc.steps.length} ta)</p>
                      <div className="bg-slate-50 rounded-xl p-4 overflow-x-auto">
                        <pre className="text-xs text-slate-600">
                          {JSON.stringify(calc.steps.slice(0, 5), null, 2)}
                          {calc.steps.length > 5 && '...'}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
