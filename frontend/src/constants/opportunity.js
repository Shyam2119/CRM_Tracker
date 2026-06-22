export const STAGES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];
export const PRIORITIES = ['Low', 'Medium', 'High'];

export const STAGE_COLORS = {
  New: 'bg-blue-100 text-blue-800 border-blue-200',
  Contacted: 'bg-purple-100 text-purple-800 border-purple-200',
  Qualified: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  'Proposal Sent': 'bg-amber-100 text-amber-800 border-amber-200',
  Won: 'bg-green-100 text-green-800 border-green-200',
  Lost: 'bg-red-100 text-red-800 border-red-200',
};

export const PRIORITY_COLORS = {
  Low: 'bg-slate-100 text-slate-600 border-slate-200',
  Medium: 'bg-orange-100 text-orange-700 border-orange-200',
  High: 'bg-red-100 text-red-700 border-red-200',
};

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'value', label: 'Highest value' },
  { value: 'priority', label: 'Priority' },
  { value: 'followUp', label: 'Follow-up date' },
];

export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value || 0);

export const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '—';

export const formatDateTime = (date) =>
  date
    ? new Date(date).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';
