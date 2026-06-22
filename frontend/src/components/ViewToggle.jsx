const views = [
  { id: 'cards', label: 'Cards', icon: '▦' },
  { id: 'table', label: 'Table', icon: '☰' },
  { id: 'kanban', label: 'Kanban', icon: '▥' },
];

export default function ViewToggle({ view, onChange }) {
  return (
    <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
      {views.map((v) => (
        <button
          key={v.id}
          type="button"
          onClick={() => onChange(v.id)}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-1.5 ${
            view === v.id
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <span>{v.icon}</span>
          <span className="hidden sm:inline">{v.label}</span>
        </button>
      ))}
    </div>
  );
}
