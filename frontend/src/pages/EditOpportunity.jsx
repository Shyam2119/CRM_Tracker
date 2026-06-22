import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import OpportunityForm from '../components/OpportunityForm';
import ActivityLog from '../components/ActivityLog';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import { opportunityAPI } from '../services/api';

export default function EditOpportunity() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const { data } = await opportunityAPI.getById(id);
        const ownerId = (data.owner?._id || data.owner)?.toString();
        if (ownerId !== user?._id?.toString()) {
          setError('You can only edit opportunities you created.');
          return;
        }
        setOpportunity(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load opportunity');
      } finally {
        setLoading(false);
      }
    };
    fetchOpportunity();
  }, [id, user]);

  const handleSubmit = async (data) => {
    setSaving(true);
    setError('');
    try {
      const { data: updated } = await opportunityAPI.update(id, data);
      setOpportunity(updated);
      setSuccess('Opportunity updated successfully!');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update opportunity');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/" className="text-sm text-indigo-600 hover:underline">
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">Edit Opportunity</h1>
        <p className="text-slate-500 text-sm mt-1">
          Update stage, priority, follow-up date, value, and notes
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <Alert type="error" message={error} />
          <Alert type="success" message={success} />
          {opportunity && (
            <OpportunityForm
              initialData={opportunity}
              onSubmit={handleSubmit}
              loading={saving}
              showActivityNote
            />
          )}
          {!opportunity && error && (
            <Link to="/" className="text-sm text-indigo-600 hover:underline">Return to dashboard</Link>
          )}
        </div>

        {opportunity?.activityLog && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <ActivityLog activities={opportunity.activityLog} />
          </div>
        )}
      </div>
    </div>
  );
}
