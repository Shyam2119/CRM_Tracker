import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = [
    { to: '/', label: 'Dashboard' },
    { to: '/opportunities/new', label: 'New Opportunity' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CRM</span>
            </div>
            <span className="font-semibold text-slate-800 hidden sm:block">
              Opportunity Tracker
            </span>
          </Link>

          {user && (
            <>
              <div className="hidden md:flex items-center gap-1">
                {links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                      isActive(link.to)
                        ? 'bg-indigo-50 text-indigo-700 font-medium'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="hidden md:flex items-center gap-4">
                <span className="text-sm text-slate-600">
                  Hi, <span className="font-medium text-slate-800">{user.name}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Logout
                </button>
              </div>

              <button
                className="md:hidden p-2 rounded-lg hover:bg-slate-100"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </>
          )}
        </div>

        {menuOpen && user && (
          <div className="md:hidden border-t border-slate-100 py-3 space-y-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`block px-3 py-2 text-sm rounded-lg ${
                  isActive(link.to) ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-3 pt-2 border-t border-slate-100 mt-2">
              <p className="text-sm text-slate-600 mb-2">Signed in as <strong>{user.name}</strong></p>
              <button
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                className="w-full text-sm px-4 py-2 rounded-lg border border-slate-300 text-slate-700"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
