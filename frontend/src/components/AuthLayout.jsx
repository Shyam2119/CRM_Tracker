export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-12 flex-col justify-between text-white">
        <div>
          <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mb-8">
            <span className="font-bold text-lg">CRM</span>
          </div>
          <h2 className="text-3xl font-bold leading-tight">Mini CRM Opportunity Tracker</h2>
          <p className="text-indigo-100 mt-4 text-lg max-w-md">
            Track leads, follow-ups, and deal stages for your sales team — all in one shared pipeline.
          </p>
        </div>
        <ul className="space-y-3 text-indigo-100 text-sm">
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-white" /> Secure JWT authentication</li>
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-white" /> Shared opportunity pipeline</li>
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-white" /> Ownership-based access control</li>
        </ul>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold">CRM</span>
            </div>
          </div>
          <div className="text-center lg:text-left mb-8">
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            <p className="text-slate-500 mt-1">{subtitle}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
