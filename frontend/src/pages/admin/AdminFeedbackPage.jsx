import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiEdit2, FiPlus, FiStar, FiTrash2 } from 'react-icons/fi';
import {
  createFeedback, deleteFeedback, getAdminCourses, getApiError, getFeedback, updateFeedback,
} from '../../api/adminApi';
import {
  AdminPageHeader, ConfirmDialog, EmptyState, ErrorState, Field, LoadingState, Modal,
  Pagination, SearchToolbar, StatusBadge, formatDate, inputClass, textareaClass,
} from '../../components/admin/AdminUI';

const initialForm = { name: '', email: '', role: '', phone: '', course_id: '', subject: '', message: '', rating: '', status: 'new', is_published: false };

const AdminFeedbackPage = () => {
  const [rows, setRows] = useState([]);
  const [courses, setCourses] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [target, setTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const response = await getFeedback({ page, pageSize: 20, search, status });
      setRows(response.data.data); setPagination(response.data.pagination);
    } catch (requestError) { setError(getApiError(requestError, 'Unable to load feedback')); }
    finally { setLoading(false); }
  }, [page, search, status]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    getAdminCourses({ page: 1, pageSize: 100, status: 'all' })
      .then((response) => setCourses(response.data.data))
      .catch(() => setCourses([]));
  }, []);

  const openForm = (feedback = null) => {
    setEditing(feedback);
    setForm(feedback ? {
      name: feedback.name || '', email: feedback.email || '', role: feedback.role || '', phone: feedback.phone || '', course_id: feedback.course_id || '',
      subject: feedback.subject || '', message: feedback.message || '', rating: feedback.rating || '', status: feedback.status || 'new',
      is_published: Boolean(Number(feedback.is_published)),
    } : { ...initialForm });
    setFormOpen(true);
  };

  const submit = async (event) => {
    event.preventDefault(); setSaving(true);
    const payload = { ...form, course_id: form.course_id ? Number(form.course_id) : null, rating: form.rating ? Number(form.rating) : null };
    try {
      if (editing) { await updateFeedback(editing.id, payload); toast.success('Feedback updated'); }
      else { await createFeedback(payload); toast.success('Feedback created'); }
      setFormOpen(false); setEditing(null); await load();
    } catch (requestError) { toast.error(getApiError(requestError, 'Unable to save feedback')); }
    finally { setSaving(false); }
  };

  const remove = async () => {
    setSaving(true);
    try { await deleteFeedback(target.id); toast.success('Feedback permanently deleted'); setTarget(null); await load(); }
    catch (requestError) { toast.error(getApiError(requestError, 'Unable to delete feedback')); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader eyebrow="Voice of customer" title="Feedback records" description="Review new website submissions, create managed feedback, publish approved entries, or mark them resolved." action={<button type="button" onClick={() => openForm()} className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 hover:bg-violet-700"><FiPlus /> Add feedback</button>} />
      <SearchToolbar value={query} onChange={setQuery} onSubmit={() => { setPage(1); setSearch(query.trim()); }} placeholder="Search name, email, role, subject, or message…">
        <select value={status} onChange={(event) => { setPage(1); setStatus(event.target.value); }} className={`${inputClass} sm:w-40`} aria-label="Filter feedback status"><option value="all">All statuses</option><option value="new">New</option><option value="reviewed">Reviewed</option><option value="resolved">Resolved</option></select>
      </SearchToolbar>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={load} /> : rows.length === 0 ? <EmptyState title="No feedback found" /> : (
          <div className="divide-y divide-slate-100">
            {rows.map((feedback) => (
              <article key={feedback.id} className="p-5 transition hover:bg-slate-50/60 sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2"><StatusBadge status={feedback.status} />{Number(feedback.is_published) === 1 && <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700 ring-1 ring-cyan-600/20">Published</span>}{feedback.rating && <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-600"><FiStar className="fill-current" /> {feedback.rating}/5</span>}</div>
                    <h2 className="mt-3 font-display text-lg font-bold text-slate-900">{feedback.subject || `Feedback from ${feedback.name}`}</h2>
                    <p className="mt-2 max-w-4xl whitespace-pre-wrap text-sm leading-6 text-slate-600">{feedback.message}</p>
                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-400"><span><strong className="text-slate-600">{feedback.name}</strong> · {feedback.email}</span>{feedback.role && <span>Role: <strong className="text-slate-600">{feedback.role}</strong></span>}<span>{feedback.course_title || 'General feedback'}</span><span>{formatDate(feedback.created_at)}</span></div>
                  </div>
                  <div className="flex shrink-0 gap-2"><button type="button" onClick={() => openForm(feedback)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-violet-50 hover:text-violet-700"><FiEdit2 /> Edit</button><button type="button" onClick={() => setTarget(feedback)} className="rounded-lg border border-slate-200 p-2.5 text-slate-600 hover:bg-rose-50 hover:text-rose-700" aria-label="Delete feedback"><FiTrash2 /></button></div>
                </div>
              </article>
            ))}
          </div>
        )}
        <Pagination pagination={pagination} onPageChange={setPage} />
      </section>

      <Modal open={formOpen} onClose={() => !saving && setFormOpen(false)} title={editing ? 'Edit feedback' : 'Create feedback'}>
        <form onSubmit={submit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name" required><input required maxLength={255} className={inputClass} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></Field>
            <Field label="Email" required><input required type="email" maxLength={255} className={inputClass} value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></Field>
            <Field label="Role / I am"><input maxLength={100} className={inputClass} value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} placeholder="Student, Trainer, Job Support, or other" /></Field>
            <Field label="Phone"><input maxLength={30} className={inputClass} value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></Field>
            <Field label="Course"><select className={inputClass} value={form.course_id} onChange={(event) => setForm({ ...form, course_id: event.target.value })}><option value="">General / no course</option>{courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}</select></Field>
            <Field label="Subject"><input maxLength={255} className={inputClass} value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} /></Field>
            <Field label="Rating"><select className={inputClass} value={form.rating} onChange={(event) => setForm({ ...form, rating: event.target.value })}><option value="">No rating</option>{[1, 2, 3, 4, 5].map((rating) => <option key={rating} value={rating}>{rating} / 5</option>)}</select></Field>
            <div className="sm:col-span-2"><Field label="Message" required><textarea required maxLength={20000} rows={5} className={textareaClass} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} /></Field></div>
            <Field label="Workflow status"><select className={inputClass} value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}><option value="new">New</option><option value="reviewed">Reviewed</option><option value="resolved">Resolved</option></select></Field>
            <label className="flex items-center justify-between self-end rounded-xl border border-slate-200 p-3 text-sm"><span><strong className="block text-slate-800">Published</strong><span className="text-xs text-slate-500">Approved for public use</span></span><input type="checkbox" className="h-5 w-5 accent-violet-600" checked={form.is_published} onChange={(event) => setForm({ ...form, is_published: event.target.checked })} /></label>
          </div>
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5"><button type="button" disabled={saving} onClick={() => setFormOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700">Cancel</button><button type="submit" disabled={saving} className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50">{saving ? 'Saving…' : editing ? 'Save changes' : 'Create feedback'}</button></div>
        </form>
      </Modal>
      <ConfirmDialog open={Boolean(target)} title="Permanently delete feedback?" message="This feedback record will be hard-deleted and cannot be recovered. An audit-log entry will remain." confirmLabel="Delete permanently" busy={saving} onClose={() => setTarget(null)} onConfirm={remove} />
    </div>
  );
};

export default AdminFeedbackPage;
