import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiEdit2, FiPlus, FiTrash2, FiUser } from 'react-icons/fi';
import { createFounder, deleteFounder, getAdminFounders, getApiError, updateFounder } from '../../api/adminApi';
import {
  AdminPageHeader, ConfirmDialog, EmptyState, ErrorState, Field, LoadingState, Modal,
  Pagination, SearchToolbar, StatusBadge, inputClass, textareaClass,
} from '../../components/admin/AdminUI';

const initialForm = {
  name: '', role: '', expertise: '', experience: '', location: '', country: '', photo_url: '',
  linkedin_url: '', bio: '', quote: '', sort_order: 0, is_active: true,
};

const AdminFoundersPage = () => {
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
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
      const response = await getAdminFounders({ page, pageSize: 20, search });
      setRows(response.data.data); setPagination(response.data.pagination);
    } catch (requestError) { setError(getApiError(requestError, 'Unable to load founders')); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const openForm = (founder = null) => {
    setEditing(founder);
    setForm(founder ? {
      name: founder.name || '', role: founder.role || '', expertise: founder.expertise || '',
      experience: founder.experience || '', location: founder.location || '', country: founder.country || '',
      photo_url: founder.photo_url || '', linkedin_url: founder.linkedin_url || '', bio: founder.bio || '',
      quote: founder.quote || '', sort_order: Number(founder.sort_order) || 0,
      is_active: Boolean(Number(founder.is_active)),
    } : { ...initialForm });
    setFormOpen(true);
  };

  const submit = async (event) => {
    event.preventDefault(); setSaving(true);
    const payload = { ...form, sort_order: Number(form.sort_order) || 0 };
    try {
      if (editing) { await updateFounder(editing.id, payload); toast.success('Founder updated'); }
      else { await createFounder(payload); toast.success('Founder added'); }
      setFormOpen(false); setEditing(null); await load();
    } catch (requestError) { toast.error(getApiError(requestError, 'Unable to save founder')); }
    finally { setSaving(false); }
  };

  const remove = async () => {
    setSaving(true);
    try { await deleteFounder(target.id); toast.success('Founder deleted'); setTarget(null); await load(); }
    catch (requestError) { toast.error(getApiError(requestError, 'Unable to delete founder')); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader eyebrow="Leadership" title="Founders" description="Manage founder and leadership profiles displayed on the TrainerMentors public website." action={<button type="button" onClick={() => openForm()} className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 hover:bg-violet-700"><FiPlus /> Add founder</button>} />
      <SearchToolbar value={query} onChange={setQuery} onSubmit={() => { setPage(1); setSearch(query.trim()); }} placeholder="Search name, role, expertise, or location…" />

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={load} /> : rows.length === 0 ? <EmptyState title="No founders found" /> : (
          <div className="grid gap-px bg-slate-200 sm:grid-cols-2 xl:grid-cols-3">
            {rows.map((founder) => (
              <article key={founder.id} className="bg-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <span className="grid h-16 w-16 place-items-center overflow-hidden rounded-2xl bg-violet-100 text-2xl text-violet-700">{founder.photo_url ? <img src={founder.photo_url} alt="" className="h-full w-full object-cover" /> : <FiUser />}</span>
                  <StatusBadge status={Number(founder.is_active) ? 'active' : 'inactive'} />
                </div>
                <h2 className="mt-4 font-display text-lg font-bold text-slate-900">{founder.name}</h2>
                <p className="text-sm font-semibold text-violet-600">{founder.role}</p>
                <p className="mt-2 text-sm text-slate-500">{founder.expertise || founder.bio || 'No profile summary added.'}</p>
                <p className="mt-3 text-xs text-slate-400">{[founder.experience, founder.location].filter(Boolean).join(' · ')}</p>
                <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-4"><button type="button" onClick={() => openForm(founder)} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-violet-50 hover:text-violet-700" aria-label={`Edit ${founder.name}`}><FiEdit2 /></button><button type="button" onClick={() => setTarget(founder)} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-rose-50 hover:text-rose-700" aria-label={`Delete ${founder.name}`}><FiTrash2 /></button></div>
              </article>
            ))}
          </div>
        )}
        <Pagination pagination={pagination} onPageChange={setPage} />
      </section>

      <Modal open={formOpen} onClose={() => !saving && setFormOpen(false)} title={editing ? 'Edit founder' : 'Add founder'}>
        <form onSubmit={submit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name" required><input required maxLength={255} className={inputClass} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></Field>
            <Field label="Role / title" required><input required maxLength={255} className={inputClass} value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} placeholder="Founder & Lead Mentor" /></Field>
            <Field label="Expertise"><input maxLength={500} className={inputClass} value={form.expertise} onChange={(event) => setForm({ ...form, expertise: event.target.value })} placeholder="Full Stack · Career Strategy" /></Field>
            <Field label="Experience"><input maxLength={100} className={inputClass} value={form.experience} onChange={(event) => setForm({ ...form, experience: event.target.value })} placeholder="12+ years" /></Field>
            <Field label="Location"><input maxLength={255} className={inputClass} value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} /></Field>
            <Field label="Country code"><input maxLength={2} pattern="[A-Za-z]{0,2}" className={inputClass} value={form.country} onChange={(event) => setForm({ ...form, country: event.target.value.toUpperCase() })} placeholder="IN" /></Field>
            <Field label="Photo URL"><input type="url" maxLength={1000} className={inputClass} value={form.photo_url} onChange={(event) => setForm({ ...form, photo_url: event.target.value })} placeholder="https://…" /></Field>
            <Field label="LinkedIn URL"><input type="url" maxLength={1000} className={inputClass} value={form.linkedin_url} onChange={(event) => setForm({ ...form, linkedin_url: event.target.value })} placeholder="https://linkedin.com/in/…" /></Field>
            <Field label="Display order"><input type="number" min="0" max="9999" className={inputClass} value={form.sort_order} onChange={(event) => setForm({ ...form, sort_order: event.target.value })} /></Field>
          </div>
          <Field label="Biography"><textarea maxLength={5000} rows={4} className={textareaClass} value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} /></Field>
          <Field label="Quote"><textarea maxLength={1000} rows={3} className={textareaClass} value={form.quote} onChange={(event) => setForm({ ...form, quote: event.target.value })} /></Field>
          <label className="flex items-center justify-between rounded-xl border border-slate-200 p-4 text-sm"><span><strong className="block text-slate-800">Visible on website</strong><span className="text-slate-500">Inactive profiles remain in admin but are hidden publicly.</span></span><input type="checkbox" className="h-5 w-5 accent-violet-600" checked={form.is_active} onChange={(event) => setForm({ ...form, is_active: event.target.checked })} /></label>
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5"><button type="button" disabled={saving} onClick={() => setFormOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700">Cancel</button><button type="submit" disabled={saving} className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving…' : editing ? 'Save changes' : 'Add founder'}</button></div>
        </form>
      </Modal>
      <ConfirmDialog open={Boolean(target)} title="Delete founder?" message={`${target?.name || 'This founder'} will be permanently removed.`} confirmLabel="Delete founder" busy={saving} onClose={() => setTarget(null)} onConfirm={remove} />
    </div>
  );
};

export default AdminFoundersPage;
