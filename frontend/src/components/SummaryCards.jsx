import { formatCurrency } from '../constants/opportunity';

export default function SummaryCards({ summary }) {
  if (!summary) return null;

  const cards = [
    { label: 'Total Opportunities', value: summary.total, color: 'text-slate-800', bg: 'from-slate-50 to-white' },
    { label: 'Pipeline Value', value: formatCurrency(summary.totalPipeline), color: 'text-indigo-600', bg: 'from-indigo-50 to-white' },
    { label: 'Won Value', value: formatCurrency(summary.wonValue), color: 'text-green-600', bg: 'from-green-50 to-white' },
    { label: 'High Priority', value: summary.highPriority, color: 'text-red-600', bg: 'from-red-50 to-white' },
    { label: 'My Opportunities', value: summary.myOpportunities, color: 'text-violet-600', bg: 'from-violet-50 to-white' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`bg-gradient-to-br ${card.bg} rounded-xl border border-slate-200 p-4 shadow-sm`}
        >
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{card.label}</p>
          <p className={`text-xl sm:text-2xl font-bold mt-1 ${card.color}`}>{card.value}</p>
        </div>
      ))}
    </div>
  );
}
