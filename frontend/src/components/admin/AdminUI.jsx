import { useEffect } from 'react';
import { FiAlertCircle, FiInbox, FiSearch, FiX } from 'react-icons/fi';

export const AdminPageHeader = ({ eyebrow, title, description, action }) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      {eyebrow && <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-violet-600">{eyebrow}</p>}
      <h1 className="font-display text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{title}</h1>
      {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>}
    </div>
    {action}
  </div>
);

export const SearchToolbar = ({ value, onChange, onSubmit, placeholder = 'Search records…', children }) => (
  <form
    onSubmit={(event) => {
      event.preventDefault();
      onSubmit?.();
    }}
    className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center"
  >
    <div className="relative min-w-0 flex-1">
      <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
      />
    </div>
    {children}
    <button type="submit" className="h-11 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-200">
      Search
    </button>
  </form>
);

const statusStyles = {
  active: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  completed: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  resolved: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  inactive: 'bg-slate-100 text-slate-600 ring-slate-500/20',
  dropped: 'bg-slate-100 text-slate-600 ring-slate-500/20',
  new: 'bg-sky-50 text-sky-700 ring-sky-600/20',
  reviewed: 'bg-violet-50 text-violet-700 ring-violet-600/20',
  pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  contacted: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  qualified: 'bg-violet-50 text-violet-700 ring-violet-600/20',
  failed: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  lost: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  refunded: 'bg-orange-50 text-orange-700 ring-orange-600/20',
};

export const StatusBadge = ({ status, children }) => {
  const normalized = String(status ?? '').toLowerCase();
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${statusStyles[normalized] || 'bg-slate-100 text-slate-700 ring-slate-500/20'}`}>
      {children || normalized || 'Unknown'}
    </span>
  );
};

export const Modal = ({ open, onClose, title, description, children, size = 'max-w-2xl' }) => {
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKeyDown);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/55 p-0 backdrop-blur-sm sm:items-center sm:p-6" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section role="dialog" aria-modal="true" aria-labelledby="admin-modal-title" className={`max-h-[96vh] w-full overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl ${size}`}>
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
          <div>
            <h2 id="admin-modal-title" className="text-lg font-bold text-slate-950">{title}</h2>
            {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-4 focus:ring-violet-100">
            <FiX className="text-xl" />
          </button>
        </header>
        <div className="max-h-[calc(96vh-78px)] overflow-y-auto p-5 sm:p-6">{children}</div>
      </section>
    </div>
  );
};

export const ConfirmDialog = ({ open, title, message, confirmLabel = 'Confirm', busy, tone = 'danger', onConfirm, onClose }) => (
  <Modal open={open} onClose={busy ? () => {} : onClose} title={title} size="max-w-md">
    <div className="flex gap-3 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
      <FiAlertCircle className={`mt-0.5 shrink-0 text-xl ${tone === 'danger' ? 'text-rose-600' : 'text-amber-600'}`} />
      <p>{message}</p>
    </div>
    <div className="mt-6 flex justify-end gap-3">
      <button type="button" disabled={busy} onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50">Cancel</button>
      <button type="button" disabled={busy} onClick={onConfirm} className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-50 ${tone === 'danger' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-amber-600 hover:bg-amber-700'}`}>
        {busy ? 'Working…' : confirmLabel}
      </button>
    </div>
  </Modal>
);

export const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) return null;
  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p className="text-slate-500">Page <strong className="text-slate-800">{pagination.page}</strong> of <strong className="text-slate-800">{pagination.totalPages}</strong> · {pagination.total} records</p>
      <div className="flex gap-2">
        <button type="button" disabled={!pagination.hasPreviousPage} onClick={() => onPageChange(pagination.page - 1)} className="rounded-lg border border-slate-200 px-3 py-2 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
        <button type="button" disabled={!pagination.hasNextPage} onClick={() => onPageChange(pagination.page + 1)} className="rounded-lg border border-slate-200 px-3 py-2 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">Next</button>
      </div>
    </div>
  );
};

export const LoadingState = ({ label = 'Loading records…' }) => (
  <div className="flex min-h-64 items-center justify-center gap-3 text-sm font-medium text-slate-500" role="status">
    <span className="h-5 w-5 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />
    {label}
  </div>
);

export const ErrorState = ({ message, onRetry }) => (
  <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
    <FiAlertCircle className="text-3xl text-rose-500" />
    <p className="mt-3 text-sm text-slate-600">{message}</p>
    {onRetry && <button type="button" onClick={onRetry} className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700">Try again</button>}
  </div>
);

export const EmptyState = ({ title = 'No records found', description = 'Try changing the current search or filters.' }) => (
  <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
    <span className="rounded-2xl bg-slate-100 p-4 text-slate-400"><FiInbox className="text-3xl" /></span>
    <p className="mt-4 font-semibold text-slate-800">{title}</p>
    <p className="mt-1 text-sm text-slate-500">{description}</p>
  </div>
);

export const Field = ({ label, required, hint, error, children }) => (
  <label className="block text-sm font-semibold text-slate-700">
    <span>{label}{required && <span className="ml-1 text-rose-500">*</span>}</span>
    <span className="mt-1.5 block">{children}</span>
    {hint && !error && <span className="mt-1 block text-xs font-normal text-slate-400">{hint}</span>}
    {error && <span className="mt-1 block text-xs font-normal text-rose-600">{error}</span>}
  </label>
);

export const inputClass = 'h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:bg-slate-100';
export const textareaClass = `${inputClass} h-auto min-h-24 py-3`;

export const formatDate = (value) => value
  ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
  : '—';

export const formatCurrency = (value) => new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR', maximumFractionDigits: 0,
}).format(Number(value || 0));
