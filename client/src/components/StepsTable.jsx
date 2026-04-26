export default function StepsTable({ title, columns, data }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
          {title}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {columns.map((col, i) => (
                <th key={i} className="px-6 py-3 text-left text-xs font-bold uppercase tracking-widest text-slate-400">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                {columns.map((col, j) => (
                  <td key={j} className={`px-6 py-4 ${col.className || 'text-slate-700'}`}>
                    {col.format ? col.format(row[col.key], row, i) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}