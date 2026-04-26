import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function TheoryCard({ mazmun }) {
  const [ochiq, setOchiq] = useState(false);

  return (
    <div className="card mb-6">
      <button
        onClick={() => setOchiq(!ochiq)}
        className="w-full card-header flex justify-between items-center text-left"
      >
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
          Nazariya
        </span>
        {ochiq ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
      </button>
      {ochiq && (
        <div className="p-6">
          <pre className="text-sm text-slate-600 whitespace-pre-wrap font-sans leading-relaxed">
            {mazmun}
          </pre>
        </div>
      )}
    </div>
  );
}