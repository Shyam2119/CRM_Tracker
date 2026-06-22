import { useState, useEffect } from 'react';

const STAGES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];
const PRIORITIES = ['Low', 'Medium', 'High'];

const emptyForm = {
  customerName: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  requirement: '',
  estimatedValue: '',
  stage: 'New',
  priority: 'Medium',
  nextFollowUpDate: '',
  notes: '',
};

export default function OpportunityForm({ initialData, onSubmit, onCancel, loading, showActivityNote = false }) {
  const [form, setForm] = useState(emptyForm);
  const [activityNote, setActivityNote] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        customerName: initialData.customerName || '',
        contactName: initialData.contactName || '',
        contactEmail: initialData.contactEmail || '',
        contactPhone: initialData.contactPhone || '',
        requirement: initialData.requirement || '',
        estimatedValue: initialData.estimatedValue ?? '',
        stage: initialData.stage || 'New',
        priority: initialData.priority || 'Medium',
        nextFollowUpDate: initialData.nextFollowUpDate
          ? new Date(initialData.nextFollowUpDate).toISOString().split('T')[0]
          : '',
        notes: initialData.notes || '',
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.customerName.trim()) newErrors.customerName = 'Customer name is required';
    if (!form.requirement.trim()) newErrors.requirement = 'Requirement is required';
    if (form.contactEmail && !/^\S+@\S+\.\S+$/.test(form.contactEmail)) {
      newErrors.contactEmail = 'Invalid email format';
    }
    if (form.estimatedValue !== '' && Number(form.estimatedValue) < 0) {
      newErrors.estimatedValue = 'Value must be non-negative';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...form,
      estimatedValue: form.estimatedValue === '' ? 0 : Number(form.estimatedValue),
      nextFollowUpDate: form.nextFollowUpDate || null,
      contactEmail: form.contactEmail || undefined,
      contactPhone: form.contactPhone || undefined,
      contactName: form.contactName || undefined,
      notes: form.notes || undefined,
      ...(showActivityNote && activityNote.trim() && { activityNote: activityNote.trim() }),
    };

    onSubmit(payload);
  };

  const inputClass = (field) =>
    `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
      errors[field] ? 'border-red-400' : 'border-slate-300'
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Customer / Company Name *
          </label>
          <input
            name="customerName"
            value={form.customerName}
            onChange={handleChange}
            className={inputClass('customerName')}
            placeholder="Acme Corp"
          />
          {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Contact Person</label>
          <input
            name="contactName"
            value={form.contactName}
            onChange={handleChange}
            className={inputClass('contactName')}
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email</label>
          <input
            name="contactEmail"
            type="email"
            value={form.contactEmail}
            onChange={handleChange}
            className={inputClass('contactEmail')}
            placeholder="john@acme.com"
          />
          {errors.contactEmail && <p className="text-red-500 text-xs mt-1">{errors.contactEmail}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Contact Phone</label>
          <input
            name="contactPhone"
            value={form.contactPhone}
            onChange={handleChange}
            className={inputClass('contactPhone')}
            placeholder="+91 98765 43210"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Requirement / Need Summary *
          </label>
          <textarea
            name="requirement"
            value={form.requirement}
            onChange={handleChange}
            rows={3}
            className={inputClass('requirement')}
            placeholder="Describe the customer's need..."
          />
          {errors.requirement && <p className="text-red-500 text-xs mt-1">{errors.requirement}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Estimated Deal Value (₹)</label>
          <input
            name="estimatedValue"
            type="number"
            min="0"
            value={form.estimatedValue}
            onChange={handleChange}
            className={inputClass('estimatedValue')}
            placeholder="50000"
          />
          {errors.estimatedValue && <p className="text-red-500 text-xs mt-1">{errors.estimatedValue}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Next Follow-up Date</label>
          <input
            name="nextFollowUpDate"
            type="date"
            value={form.nextFollowUpDate}
            onChange={handleChange}
            className={inputClass('nextFollowUpDate')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Stage</label>
          <select name="stage" value={form.stage} onChange={handleChange} className={inputClass('stage')}>
            {STAGES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
          <select name="priority" value={form.priority} onChange={handleChange} className={inputClass('priority')}>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={2}
            className={inputClass('notes')}
            placeholder="Additional notes..."
          />
        </div>

        {showActivityNote && (
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Add Follow-up Note
            </label>
            <textarea
              value={activityNote}
              onChange={(e) => setActivityNote(e.target.value)}
              rows={2}
              className={inputClass('activityNote')}
              placeholder="Log a follow-up call, meeting, or update..."
            />
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2.5 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Saving...' : initialData ? 'Update Opportunity' : 'Create Opportunity'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
