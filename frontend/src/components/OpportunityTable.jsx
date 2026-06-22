import { Link } from 'react-router-dom';
import {
  STAGE_COLORS,
  PRIORITY_COLORS,
  formatCurrency,
  formatDate,
} from '../constants/opportunity';

export default function OpportunityTable({ opportunities, userId, onDelete }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {['Customer', 'Requirement', 'Value', 'Stage', 'Priority', 'Follow-up', 'Owner', 'Created', 'Actions'].map(
                (h) => (
                  <th key={h} className="text-left px-4 py-3 font-semibold text-slate-600 whitespace-nowrap">
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {opportunities.map((opp) => {
              const isOwner = (opp.owner?._id || opp.owner)?.toString() === userId?.toString();
              return (
                <tr key={opp._id} className={isOwner ? 'bg-indigo-50/30' : 'hover:bg-slate-50'}>
                  <td className="px-4 py-3 font-medium text-slate-900 whitespace-nowrap">
                    {opp.customerName}
                    {isOwner && (
                      <span className="ml-2 text-xs text-indigo-600 font-normal">(Yours)</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600 max-w-xs truncate">{opp.requirement}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatCurrency(opp.estimatedValue)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full border ${STAGE_COLORS[opp.stage]}`}>
                      {opp.stage}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full border ${PRIORITY_COLORS[opp.priority]}`}>
                      {opp.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatDate(opp.nextFollowUpDate)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{opp.owner?.name || '—'}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatDate(opp.createdAt)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {isOwner ? (
                      <div className="flex gap-2">
                        <Link
                          to={`/opportunities/${opp._id}/edit`}
                          className="text-indigo-600 hover:underline text-xs font-medium"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => onDelete(opp._id)}
                          className="text-red-600 hover:underline text-xs font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs">View only</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
