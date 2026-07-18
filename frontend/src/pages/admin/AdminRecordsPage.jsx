import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiCreditCard, FiTarget, FiUserPlus, FiUsers } from 'react-icons/fi';
import { getAdminRecords, getApiError } from '../../api/adminApi';
import {
  AdminPageHeader, EmptyState, ErrorState, LoadingState, Pagination, SearchToolbar,
  StatusBadge, formatCurrency, formatDate,
} from '../../components/admin/AdminUI';

const tabs = [
  { id: 'users', label: 'Users', icon: FiUsers },
  { id: 'leads', label: 'Leads', icon: FiTarget },
  { id: 'enrollments', label: 'Enrollments', icon: FiUserPlus },
  { id: 'payments', label: 'Payments', icon: FiCreditCard },
];

const cells = {
  users: [
    ['User', (row) => <><p className="font-semibold text-slate-900">{row.name}</p><p className="text-xs text-slate-400">{row.email}</p></>],
    ['Phone', (row) => row.phone || '—'], ['Role', (row) => <StatusBadge status={row.role}>{row.role}</StatusBadge>],
    ['Status', (row) => <StatusBadge status={Number(row.is_active) ? 'active' : 'inactive'} />], ['Created', (row) => formatDate(row.created_at)],
  ],
  leads: [
    ['Lead', (row) => <><p className="font-semibold text-slate-900">{row.name}</p><p className="text-xs text-slate-400">{row.email}</p></>],
    ['Phone', (row) => row.phone || '—'], ['Interest', (row) => row.course_interested || 'General'],
    ['Source', (row) => row.source || '—'], ['Status', (row) => <StatusBadge status={row.status} />], ['Created', (row) => formatDate(row.created_at)],
  ],
  enrollments: [
    ['Student', (row) => <><p className="font-semibold text-slate-900">{row.student_name || 'Unknown'}</p><p className="text-xs text-slate-400">{row.student_email}</p></>],
    ['Course', (row) => row.course_title || 'Unknown'], ['Progress', (row) => `${row.progress_percentage || 0}%`],
    ['Status', (row) => <StatusBadge status={row.status} />], ['Enrolled', (row) => formatDate(row.enrollment_date)],
  ],
  payments: [
    ['Customer', (row) => <><p className="font-semibold text-slate-900">{row.student_name || 'Unknown'}</p><p className="text-xs text-slate-400">{row.student_email}</p></>],
    ['Course', (row) => row.course_title || 'Unknown'], ['Amount', (row) => <strong>{formatCurrency(row.amount)}</strong>],
    ['Method', (row) => row.payment_method || '—'], ['Transaction', (row) => row.transaction_id || '—'],
    ['Status', (row) => <StatusBadge status={row.status} />], ['Created', (row) => formatDate(row.created_at)],
  ],
};

const AdminRecordsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get('tab');
  const activeTab = tabs.some((tab) => tab.id === requestedTab) ? requestedTab : 'users';
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const response = await getAdminRecords(activeTab, { page, pageSize: 20, search });
      setRows(response.data.data); setPagination(response.data.pagination);
    } catch (requestError) { setError(getApiError(requestError, `Unable to load ${activeTab}`)); }
    finally { setLoading(false); }
  }, [activeTab, page, search]);

  useEffect(() => { load(); }, [load]);

  const changeTab = (tab) => {
    setPage(1); setQuery(''); setSearch(''); setSearchParams({ tab });
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader eyebrow="Operations" title="Business records" description="Read-only operational visibility into users, captured leads, enrollments, and payment history." />
      <div className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm sm:flex">
        {tabs.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => changeTab(id)} className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${activeTab === id ? 'bg-slate-950 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}><Icon /> {label}</button>)}
      </div>
      <SearchToolbar value={query} onChange={setQuery} onSubmit={() => { setPage(1); setSearch(query.trim()); }} placeholder={`Search ${activeTab}…`} />
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={load} /> : rows.length === 0 ? <EmptyState title={`No ${activeTab} found`} description="No matching records are available in the live database." /> : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>{cells[activeTab].map(([label]) => <th key={label} className="whitespace-nowrap px-5 py-4 font-semibold">{label}</th>)}</tr></thead>
              <tbody className="divide-y divide-slate-100">{rows.map((row) => <tr key={row.id} className="hover:bg-slate-50/70">{cells[activeTab].map(([label, render]) => <td key={label} className="max-w-sm whitespace-nowrap px-5 py-4 text-slate-600">{render(row)}</td>)}</tr>)}</tbody>
            </table>
          </div>
        )}
        <Pagination pagination={pagination} onPageChange={setPage} />
      </section>
    </div>
  );
};

export default AdminRecordsPage;
