import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiEdit2, FiFolder, FiPlus, FiPower } from 'react-icons/fi';
import { createCategory, deactivateCategory, getAdminCategories, getApiError, updateCategory } from '../../api/adminApi';
import {
  AdminPageHeader, ConfirmDialog, EmptyState, ErrorState, Field, LoadingState, Modal,
  Pagination, SearchToolbar, StatusBadge, inputClass, textareaClass,
} from '../../components/admin/AdminUI';

const initialForm = { name: '', slug: '', description: '', image: '', is_active: true };

const AdminCategoriesPage = () => {
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
      const response = await getAdminCategories({ page, pageSize: 20, search });
      setRows(response.data.data); setPagination(response.data.pagination);
    } catch (requestError) {
      setError(getApiError(requestError, 'Unable to load categories'));
    } finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const openForm = (category = null) => {
    setEditing(category);
    setForm(category ? {
      name: category.name || '', slug: category.slug || '', description: category.description || '',
      image: category.image || '', is_active: Boolean(Number(category.is_active)),
    } : { ...initialForm });
    setFormOpen(true);
  };

  const submit = async (event) => {
    event.preventDefault(); setSaving(true);
    try {
      if (editing) { await updateCategory(editing.id, form); toast.success('Category updated'); }
      else { await createCategory(form); toast.success('Category created'); }
      setFormOpen(false); setEditing(null); await load();
    } catch (requestError) { toast.error(getApiError(requestError, 'Unable to save category')); }
    finally { setSaving(false); }
  };

  const deactivate = async () => {
    setSaving(true);
    try {
      const response = await deactivateCategory(target.id);
      const count = response.data.data?.retained_course_count || 0;
      toast.success(count ? `Category deactivated; ${count} linked course(s) retained` : 'Category deactivated');
      setTarget(null); await load();
    } catch (requestError) { toast.error(getApiError(requestError, 'Unable to deactivate category')); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader eyebrow="Taxonomy" title="Course categories" description="Organize the catalog with reusable categories. Deactivation never destroys linked course records." action={<button type="button" onClick={() => openForm()} className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 hover:bg-violet-700"><FiPlus /> Add category</button>} />
      <SearchToolbar value={query} onChange={setQuery} onSubmit={() => { setPage(1); setSearch(query.trim()); }} placeholder="Search category name, slug, or description…" />

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={load} /> : rows.length === 0 ? <EmptyState title="No categories found" /> : (
          <div className="grid gap-px bg-slate-200 sm:grid-cols-2 xl:grid-cols-3">
            {rows.map((category) => (
              <article key={category.id} className="bg-white p-5 transition hover:bg-slate-50/70">
                <div className="flex items-start justify-between gap-3">
                  <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-xl bg-amber-100 text-xl text-amber-700">{category.image ? <img src={category.image} alt="" className="h-full w-full object-cover" /> : <FiFolder />}</span>
                  <StatusBadge status={Number(category.is_active) ? 'active' : 'inactive'} />
                </div>
                <h2 className="mt-5 font-display text-lg font-bold text-slate-900">{category.name}</h2>
                <p className="mt-1 text-xs font-semibold text-violet-600">/{category.slug}</p>
                <p className="mt-3 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">{category.description || 'No description added.'}</p>
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <p className="text-sm text-slate-500"><strong className="text-slate-900">{category.active_course_count || 0}</strong> active · {category.course_count || 0} total</p>
                  <div className="flex gap-2"><button type="button" onClick={() => openForm(category)} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-violet-50 hover:text-violet-700" aria-label={`Edit ${category.name}`}><FiEdit2 /></button>{Number(category.is_active) === 1 && <button type="button" onClick={() => setTarget(category)} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-rose-50 hover:text-rose-700" aria-label={`Deactivate ${category.name}`}><FiPower /></button>}</div>
                </div>
              </article>
            ))}
          </div>
        )}
        <Pagination pagination={pagination} onPageChange={setPage} />
      </section>

      <Modal open={formOpen} onClose={() => !saving && setFormOpen(false)} title={editing ? 'Edit category' : 'Create category'}>
        <form onSubmit={submit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name" required><input required maxLength={255} className={inputClass} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></Field>
            <Field label="Slug" hint="Leave blank when creating to generate from the name."><input maxLength={255} pattern="[a-z0-9-]*" className={inputClass} value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })} placeholder="technical-training" /></Field>
          </div>
          <Field label="Description"><textarea maxLength={5000} className={textareaClass} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></Field>
          <Field label="Image URL"><input type="url" maxLength={255} className={inputClass} value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} placeholder="https://…" /></Field>
          <label className="flex items-center justify-between rounded-xl border border-slate-200 p-4 text-sm"><span><strong className="block text-slate-800">Active category</strong><span className="text-slate-500">Active categories are available for catalog organization.</span></span><input type="checkbox" className="h-5 w-5 accent-violet-600" checked={form.is_active} onChange={(event) => setForm({ ...form, is_active: event.target.checked })} /></label>
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5"><button type="button" disabled={saving} onClick={() => setFormOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700">Cancel</button><button type="submit" disabled={saving} className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50">{saving ? 'Saving…' : editing ? 'Save changes' : 'Create category'}</button></div>
        </form>
      </Modal>
      <ConfirmDialog open={Boolean(target)} title="Deactivate category?" message={`${target?.name || 'This category'} will be marked inactive. Linked courses are retained and can be reassigned.`} confirmLabel="Deactivate category" busy={saving} onClose={() => setTarget(null)} onConfirm={deactivate} />
    </div>
  );
};

export default AdminCategoriesPage;
