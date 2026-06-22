import { Link } from 'react-router-dom';
import {
  STAGE_COLORS,
  PRIORITY_COLORS,
  formatCurrency,
  formatDate,
} from '../constants/opportunity';

export default function OpportunityCard({ opportunity, isOwner, onDelete }) {
  const { _id, customerName, requirement, estimatedValue, stage, priority, nextFollowUpDate, owner, createdAt } = opportunity;

  return (
    <div className={`bg-white rounded-xl border shadow-sm p-5 flex flex-col gap-3 transition-shadow hover:shadow-md ${isOwner ? 'border-indigo-200 ring-1 ring-indigo-100' : 'border-slate-200'}`}>
      <div className="flex justify-between items-start gap-2">
        <div>
          <h3 className="font-semibold text-slate-900 text-lg">{customerName}</h3>
          {isOwner && (
            <span className="inline-flex items-center gap-1 text-xs text-indigo-600 font-medium mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              Your opportunity
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1.5 items-end">
          <span className={`text-xs px-2 py-1 rounded-full border font-medium ${STAGE_COLORS[stage]}`}>
            {stage}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full border font-medium ${PRIORITY_COLORS[priority]}`}>
            {priority}
          </span>
        </div>
      </div>

      <p className="text-sm text-slate-600 line-clamp-2">{requirement}</p>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-slate-400 text-xs">Deal Value</span>
          <p className="font-medium text-slate-800">{formatCurrency(estimatedValue)}</p>
        </div>
        <div>
          <span className="text-slate-400 text-xs">Next Follow-up</span>
          <p className="font-medium text-slate-800">{formatDate(nextFollowUpDate)}</p>
        </div>
        <div>
          <span className="text-slate-400 text-xs">Created By</span>
          <p className="font-medium text-slate-800">{owner?.name || 'Unknown'}</p>
        </div>
        <div>
          <span className="text-slate-400 text-xs">Created Date</span>
          <p className="font-medium text-slate-800">{formatDate(createdAt)}</p>
        </div>
      </div>

      {isOwner && (
        <div className="flex gap-2 pt-2 border-t border-slate-100">
          <Link
            to={`/opportunities/${_id}/edit`}
            className="flex-1 text-center text-sm py-2 px-3 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={() => onDelete(_id)}
            className="flex-1 text-sm py-2 px-3 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
