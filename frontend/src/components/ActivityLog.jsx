import { formatDateTime } from '../constants/opportunity';

const ACTION_LABELS = {
  created: 'Created',
  updated: 'Updated',
  note_added: 'Note',
  stage_changed: 'Stage Change',
  follow_up: 'Follow-up',
};

export default function ActivityLog({ activities = [] }) {
  if (!activities.length) {
    return (
      <div className="text-sm text-slate-500 bg-slate-50 rounded-lg p-4 border border-slate-200">
        No activity recorded yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-800">Activity & Follow-up History</h3>
      <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-64 overflow-y-auto">
        {[...activities].reverse().map((item, i) => (
          <div key={item._id || i} className="p-3 bg-white">
            <div className="flex justify-between items-start gap-2">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                {ACTION_LABELS[item.action] || 'Activity'}
              </span>
              <span className="text-xs text-slate-400 shrink-0">
                {formatDateTime(item.createdAt)}
              </span>
            </div>
            <p className="text-sm text-slate-700 mt-2">{item.note}</p>
            <p className="text-xs text-slate-400 mt-1">
              by {item.updatedBy?.name || 'Unknown'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
