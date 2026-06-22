import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OpportunityForm from '../components/OpportunityForm';
import Alert from '../components/Alert';
import { opportunityAPI } from '../services/api';

export default function CreateOpportunity() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await opportunityAPI.create(data);
      setSuccess('Opportunity created successfully!');
      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create opportunity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/" className="text-sm text-indigo-600 hover:underline">
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">Create Opportunity</h1>
        <p className="text-slate-500 text-sm mt-1">Add a new lead to the shared pipeline</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <Alert type="error" message={error} />
        <Alert type="success" message={success} />
        <OpportunityForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}
