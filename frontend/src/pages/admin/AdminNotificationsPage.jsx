import { useCallback, useEffect, useState } from 'react';
import { FiBell, FiBookOpen, FiMail, FiPhone, FiRefreshCw } from 'react-icons/fi';
import { getAdminRecords, getApiError } from '../../api/adminApi';
import {
  AdminPageHeader, EmptyState, ErrorState, LoadingState, Pagination, StatusBadge, formatDate,
} from '../../components/admin/AdminUI';

const AdminNotificationsPage = () => {
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getAdminRecords('leads', { page, pageSize: 20 });
      setRows(Array.isArray(response.data?.data) ? response.data.data : []);
      setPagination(response.data?.pagination || null);
    } catch (requestError) {
      setError(getApiError(requestError, 'Unable to load booking notifications'));
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Notifications"
        title="Free session requests"
        description="Every submitted booking appears here immediately and is also sent to the configured administrator email."
        action={(
          <button type="button" onClick={load} disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60">
            <FiRefreshCw className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        )}
      />

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={load} /> : rows.length === 0 ? (
          <EmptyState title="No booking notifications" description="New free-session requests will appear here as soon as users submit the form." />
        ) : (
          <div className="divide-y divide-slate-100">
            {rows.map((notification) => (
              <article key={notification.id} className="p-5 transition hover:bg-slate-50/70 sm:p-6">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="flex min-w-0 gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-violet-100 text-violet-700">
                      <FiBell className="text-xl" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-display text-lg font-bold text-slate-900">{notification.name}</h2>
                        <StatusBadge status={notification.status || 'new'} />
                      </div>
                      <p className="mt-1 text-sm text-slate-500">Requested {formatDate(notification.created_at)}</p>
                      <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2 xl:grid-cols-4">
                        <a href={`mailto:${notification.email}`} className="inline-flex items-center gap-2 hover:text-violet-700"><FiMail /> {notification.email}</a>
                        <a href={`tel:${notification.phone || ''}`} className="inline-flex items-center gap-2 hover:text-violet-700"><FiPhone /> {notification.phone || 'No phone'}</a>
                        <span className="inline-flex items-center gap-2"><FiBookOpen /> {notification.course_interested || 'General enquiry'}</span>
                        <span className="capitalize">Mode: {notification.mode || 'Not specified'}</span>
                      </div>
                      {notification.timeline && <p className="mt-3 text-sm font-medium text-slate-700">Preferred date: {notification.timeline}</p>}
                      {notification.message && <p className="mt-3 max-w-4xl rounded-xl bg-slate-100 px-4 py-3 text-sm leading-6 text-slate-600">{notification.message}</p>}
                    </div>
                  </div>
                  <a href={`mailto:${notification.email}?subject=${encodeURIComponent(`Your TrainerMentors free session - ${notification.course_interested || 'course'}`)}`} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-100">
                    <FiMail /> Reply to learner
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
        <Pagination pagination={pagination} onPageChange={setPage} />
      </section>
    </div>
  );
};

export default AdminNotificationsPage;
