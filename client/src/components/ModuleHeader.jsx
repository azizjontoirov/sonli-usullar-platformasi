export default function ModuleHeader({ sarlavha, tavsif }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-black text-slate-900">{sarlavha}</h1>
      {tavsif && (
        <p className="text-slate-500 mt-2 text-base">{tavsif}</p>
      )}
      <div className="h-1 w-16 bg-blue-500 mt-4 rounded-full" />
    </div>
  );
}