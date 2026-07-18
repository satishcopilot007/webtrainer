import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBookOpen, FiLayers, FiMessageSquare, FiTrendingUp, FiUserCheck, FiUsers } from 'react-icons/fi';
import { getAdminOverview, getApiError } from '../../api/adminApi';
import { AdminPageHeader, ErrorState, LoadingState, StatusBadge, formatCurrency, formatDate } from '../../components/admin/AdminUI';

const statCards = [
  { key: 'users', label: 'Active users', icon: FiUsers, color: 'from-sky-500 to-cyan-400', to: '/admin/records' },
  { key: 'tutors', label: 'Active tutors', icon: FiUserCheck, color: 'from-violet-600 to-fuchsia-500', to: '/admin/tutors' },
  { key: 'courses', label: 'Active courses', icon: FiBookOpen, color: 'from-emerald-500 to-teal-400', to: '/admin/courses' },
  { key: 'categories', label: 'Categories', icon: FiLayers, color: 'from-amber-500 to-orange-400', to: '/admin/categories' },
  { key: 'feedback', label: 'Feedback records', icon: FiMessageSquare, color: 'from-rose-500 to-pink-400', to: '/admin/feedback' },
];

const AdminOverviewPage = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      const response = await getAdminOverview();
      setData(response.data.data);
    } catch (requestError) {
      setError(getApiError(requestError, 'Unable to load the admin overview'));
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (!data && !error) return <LoadingState label="Loading dashboard…" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="space-y-7">
      <AdminPageHeader eyebrow="Command center" title="Dashboard overview" description="A live snapshot of TrainerMentors content, activity, and customer operations." />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {statCards.map(({ key, label, icon: Icon, color, to }) => (
          <Link key={key} to={to} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-lg">
            <div className="flex items-start justify-between">
              <span className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${color} text-xl text-white shadow-lg`}><Icon /></span>
              <span className="text-xs font-semibold text-slate-400 transition group-hover:text-violet-600">View →</span>
            </div>
            <p className="mt-5 text-3xl font-bold tracking-tight text-slate-950">{Number(data.stats[key] || 0).toLocaleString('en-IN')}</p>
            <p className="mt-1 text-sm font-medium text-slate-500">{label}</p>
          </Link>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-br from-slate-950 to-violet-950 p-6 text-white shadow-xl md:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-violet-200">Completed payment revenue</p>
              <p className="mt-2 font-display text-4xl font-bold">{formatCurrency(data.stats.revenue)}</p>
            </div>
            <span className="rounded-2xl bg-white/10 p-3 text-2xl text-emerald-300"><FiTrendingUp /></span>
          </div>
          <div className="mt-8 flex flex-wrap gap-6 border-t border-white/10 pt-5 text-sm">
            <p><strong className="block text-xl">{Number(data.stats.enrollments || 0).toLocaleString('en-IN')}</strong><span className="text-slate-400">Total enrollments</span></p>
            <p><strong className="block text-xl">{Number(data.stats.leads || 0).toLocaleString('en-IN')}</strong><span className="text-slate-400">Captured leads</span></p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Quick actions</p>
          <div className="mt-4 space-y-2">
            <Link to="/admin/courses" className="block rounded-xl bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-700 hover:bg-violet-100">Create or update a course</Link>
            <Link to="/admin/tutors" className="block rounded-xl bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-700 hover:bg-sky-100">Manage tutor access</Link>
            <Link to="/admin/feedback" className="block rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 hover:bg-rose-100">Review new feedback</Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="font-bold text-slate-900">Recent enrollments</h2>
            <Link to="/admin/records?tab=enrollments" className="text-sm font-semibold text-violet-600 hover:text-violet-800">View all</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {data.recent_enrollments.length === 0 && <p className="p-6 text-sm text-slate-500">No enrollment activity is available.</p>}
            {data.recent_enrollments.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-800">{item.student_name || 'Unknown student'}</p><p className="truncate text-xs text-slate-500">{item.course_title || 'Unknown course'} · {formatDate(item.enrollment_date)}</p></div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="font-bold text-slate-900">Recent feedback</h2>
            <Link to="/admin/feedback" className="text-sm font-semibold text-violet-600 hover:text-violet-800">View all</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {data.recent_feedback.length === 0 && <p className="p-6 text-sm text-slate-500">No feedback has been recorded.</p>}
            {data.recent_feedback.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-800">{item.subject || `Feedback from ${item.name}`}</p><p className="truncate text-xs text-slate-500">{item.email} · {item.rating ? `${item.rating}/5` : 'No rating'}</p></div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminOverviewPage;
