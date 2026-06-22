import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { opportunityAPI } from '../services/api';
import OpportunityCard from '../components/OpportunityCard';
import OpportunityTable from '../components/OpportunityTable';
import KanbanBoard from '../components/KanbanBoard';
import SummaryCards from '../components/SummaryCards';
import FilterBar from '../components/FilterBar';
import ViewToggle from '../components/ViewToggle';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Dashboard() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [summary, setSummary] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [view, setView] = useState('cards');
  const [filters, setFilters] = useState({
    stage: '',
    priority: '',
    search: '',
    sort: 'newest',
    page: 1,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page: filters.page,
        limit: view === 'kanban' ? 100 : 12,
        sort: filters.sort,
      };
      if (filters.stage) params.stage = filters.stage;
      if (filters.priority) params.priority = filters.priority;
      if (filters.search) params.search = filters.search;

      const [oppRes, summaryRes] = await Promise.all([
        opportunityAPI.getAll(params),
        opportunityAPI.getSummary(),
      ]);

      setOpportunities(oppRes.data.data);
      setPagination(oppRes.data.pagination);
      setSummary(summaryRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  }, [filters, view]);

  useEffect(() => {
    const timer = setTimeout(fetchData, filters.search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [fetchData, filters.search]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this opportunity?')) return;
    try {
      await opportunityAPI.delete(id);
      setSuccessMsg('Opportunity deleted successfully.');
      setTimeout(() => setSuccessMsg(''), 3000);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete opportunity');
    }
  };

  const handleStageChange = async (id, stage) => {
    try {
      await opportunityAPI.update(id, { stage, activityNote: `Stage updated to ${stage} via Kanban` });
      setSuccessMsg('Stage updated.');
      setTimeout(() => setSuccessMsg(''), 2000);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update stage');
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...newFilters, page: 1 });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Opportunity Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Shared sales pipeline for your team</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <ViewToggle view={view} onChange={setView} />
          <Link
            to="/opportunities/new"
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors whitespace-nowrap shadow-sm"
          >
            + New Opportunity
          </Link>
        </div>
      </div>

      <SummaryCards summary={summary} />

      <div className="mb-6">
        <FilterBar filters={filters} onChange={handleFilterChange} />
      </div>

      <Alert type="success" message={successMsg} onDismiss={() => setSuccessMsg('')} />
      <Alert type="error" message={error} onDismiss={() => setError('')} />

      {loading ? (
        <LoadingSpinner className="py-20" />
      ) : opportunities.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            📋
          </div>
          <h3 className="text-lg font-medium text-slate-700">No opportunities found</h3>
          <p className="text-slate-500 text-sm mt-1 mb-4">
            {filters.search || filters.stage || filters.priority
              ? 'No opportunities match your filters.'
              : 'Create your first opportunity to get started.'}
          </p>
          {!filters.search && !filters.stage && !filters.priority && (
            <Link
              to="/opportunities/new"
              className="inline-block px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
            >
              Create Opportunity
            </Link>
          )}
        </div>
      ) : (
        <>
          {view === 'cards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {opportunities.map((opp) => (
                <OpportunityCard
                  key={opp._id}
                  opportunity={opp}
                  isOwner={(opp.owner?._id || opp.owner)?.toString() === user?._id?.toString()}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          {view === 'table' && (
            <OpportunityTable
              opportunities={opportunities}
              userId={user?._id}
              onDelete={handleDelete}
            />
          )}

          {view === 'kanban' && (
            <KanbanBoard
              opportunities={opportunities}
              userId={user?._id}
              onStageChange={handleStageChange}
            />
          )}

          {view !== 'kanban' && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-8">
              <button
                disabled={filters.page <= 1}
                onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
                className="px-4 py-2 text-sm border border-slate-300 rounded-lg disabled:opacity-40 hover:bg-white"
              >
                Previous
              </button>
              <span className="text-sm text-slate-600">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
              </span>
              <button
                disabled={filters.page >= pagination.totalPages}
                onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
                className="px-4 py-2 text-sm border border-slate-300 rounded-lg disabled:opacity-40 hover:bg-white"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
