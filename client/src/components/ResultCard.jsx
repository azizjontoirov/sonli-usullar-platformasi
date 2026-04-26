export default function ResultCard({ label, value, color = 'blue', icon: Icon }) {
  const colors = {
    blue: 'bg-blue-50 border-blue-100 text-blue-700',
    green: 'bg-emerald-50 border-emerald-100 text-emerald-700',
    orange: 'bg-orange-50 border-orange-100 text-orange-700',
  };

  return (
    <div className={`flex-1 p-6 rounded-2xl border ${colors[color]}`}>
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon size={18} />}
        <p className="text-xs font-bold uppercase tracking-widest opacity-70">{label}</p>
      </div>
      <p className="text-3xl font-black">{value}</p>
    </div>
  );
}