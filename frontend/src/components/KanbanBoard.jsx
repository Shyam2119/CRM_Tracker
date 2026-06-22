import { Link } from 'react-router-dom';
import { STAGES, formatCurrency, formatDate } from '../constants/opportunity';

export default function KanbanBoard({ opportunities, userId, onStageChange }) {
  const grouped = STAGES.reduce((acc, stage) => {
    acc[stage] = opportunities.filter((o) => o.stage === stage);
    return acc;
  }, {});

  const stageHeaderColors = {
    New: 'border-t-blue-500',
    Contacted: 'border-t-purple-500',
    Qualified: 'border-t-cyan-500',
    'Proposal Sent': 'border-t-amber-500',
    Won: 'border-t-green-500',
    Lost: 'border-t-red-500',
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {STAGES.map((stage) => (
        <div
          key={stage}
          className={`flex-shrink-0 w-72 bg-slate-100/80 rounded-xl border border-slate-200 border-t-4 ${stageHeaderColors[stage]}`}
        >
          <div className="p-3 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800 text-sm">{stage}</h3>
            <span className="text-xs bg-white px-2 py-0.5 rounded-full text-slate-500 border border-slate-200">
              {grouped[stage].length}
            </span>
          </div>
          <div className="p-2 space-y-2 min-h-[120px] max-h-[calc(100vh-320px)] overflow-y-auto">
            {grouped[stage].length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No deals</p>
            ) : (
              grouped[stage].map((opp) => {
                const isOwner = (opp.owner?._id || opp.owner)?.toString() === userId?.toString();
                return (
                  <div
                    key={opp._id}
                    className={`bg-white rounded-lg border p-3 shadow-sm ${
                      isOwner ? 'border-indigo-200' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-1 mb-1">
                      <p className="font-medium text-sm text-slate-900 leading-tight">{opp.customerName}</p>
                      {isOwner && <span className="text-[10px] text-indigo-600 shrink-0">Yours</span>}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-2">{opp.requirement}</p>
                    <div className="flex justify-between text-xs text-slate-600 mb-2">
                      <span className="font-medium">{formatCurrency(opp.estimatedValue)}</span>
                      <span className={`px-1.5 py-0.5 rounded ${
                        opp.priority === 'High' ? 'bg-red-100 text-red-700' :
                        opp.priority === 'Medium' ? 'bg-orange-100 text-orange-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {opp.priority}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mb-2">
                      Follow-up: {formatDate(opp.nextFollowUpDate)} · {opp.owner?.name}
                    </p>
                    {isOwner && (
                      <div className="flex gap-2 pt-2 border-t border-slate-100">
                        <select
                          value={opp.stage}
                          onChange={(e) => onStageChange(opp._id, e.target.value)}
                          className="flex-1 text-xs border border-slate-200 rounded px-1.5 py-1"
                        >
                          {STAGES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <Link
                          to={`/opportunities/${opp._id}/edit`}
                          className="text-xs text-indigo-600 hover:underline self-center"
                        >
                          Edit
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
