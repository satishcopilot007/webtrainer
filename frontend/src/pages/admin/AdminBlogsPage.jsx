import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiEdit2, FiExternalLink, FiPlus, FiTrash2 } from 'react-icons/fi';
import { createBlog, deleteBlog, getAdminBlogs, getApiError, updateBlog } from '../../api/adminApi';
import {
  AdminPageHeader, ConfirmDialog, EmptyState, ErrorState, Field, LoadingState, Modal,
  Pagination, SearchToolbar, StatusBadge, inputClass, textareaClass,
} from '../../components/admin/AdminUI';

const today = () => new Date().toISOString().slice(0, 10);
const initialForm = {
  title: '', slug: '', excerpt: '', content: '', image_url: '', author: 'TrainerMentors Team',
  category: '', read_time: '5 min read', source_platform: 'website', external_url: '', reference_url: '',
  published_at: today(), is_published: true,
};

const AdminBlogsPage = () => {
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
      const response = await getAdminBlogs({ page, pageSize: 20, search });
      setRows(response.data.data); setPagination(response.data.pagination);
    } catch (requestError) { setError(getApiError(requestError, 'Unable to load blogs')); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const openForm = (blog = null) => {
    setEditing(blog);
    setForm(blog ? {
      title: blog.title || '', slug: blog.slug || '', excerpt: blog.excerpt || '', content: blog.content || '',
      image_url: blog.image_url || '', author: blog.author || '', category: blog.category || '',
      read_time: blog.read_time || '', source_platform: blog.source_platform || 'website',
      external_url: blog.external_url || '', reference_url: blog.reference_url || '',
      published_at: String(blog.published_at || today()).slice(0, 10), is_published: Boolean(Number(blog.is_published)),
    } : { ...initialForm, published_at: today() });
    setFormOpen(true);
  };

  const submit = async (event) => {
    event.preventDefault(); setSaving(true);
    try {
      if (editing) { await updateBlog(editing.id, form); toast.success('Blog updated'); }
      else { await createBlog(form); toast.success('Blog created'); }
      setFormOpen(false); setEditing(null); await load();
    } catch (requestError) { toast.error(getApiError(requestError, 'Unable to save blog')); }
    finally { setSaving(false); }
  };

  const remove = async () => {
    setSaving(true);
    try { await deleteBlog(target.id); toast.success('Blog deleted'); setTarget(null); await load(); }
    catch (requestError) { toast.error(getApiError(requestError, 'Unable to delete blog')); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader eyebrow="Publishing" title="Blogs" description="Publish full website articles or curate LinkedIn, Facebook, and other external posts." action={<button type="button" onClick={() => openForm()} className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 hover:bg-violet-700"><FiPlus /> Add blog</button>} />
      <SearchToolbar value={query} onChange={setQuery} onSubmit={() => { setPage(1); setSearch(query.trim()); }} placeholder="Search title, category, author, or content…" />

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={load} /> : rows.length === 0 ? <EmptyState title="No blogs found" /> : (
          <div className="divide-y divide-slate-100">
            {rows.map((blog) => (
              <article key={blog.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
                <div className="h-28 w-full shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-violet-100 to-cyan-100 sm:w-44">{blog.image_url && <img src={blog.image_url} alt="" className="h-full w-full object-cover" />}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap gap-2"><StatusBadge status={Number(blog.is_published) ? 'published' : 'draft'} /><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{blog.source_platform || 'website'}</span></div>
                  <h2 className="mt-2 font-display text-lg font-bold text-slate-900">{blog.title}</h2>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-500">{blog.excerpt}</p>
                  <p className="mt-2 text-xs text-slate-400">{blog.category} · {blog.author} · {String(blog.published_at || '').slice(0, 10)}</p>
                </div>
                <div className="flex shrink-0 gap-2">{blog.external_url && <a href={blog.external_url} target="_blank" rel="noreferrer" className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:text-cyan-700" aria-label="Open source post"><FiExternalLink /></a>}<button type="button" onClick={() => openForm(blog)} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:text-violet-700" aria-label={`Edit ${blog.title}`}><FiEdit2 /></button><button type="button" onClick={() => setTarget(blog)} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:text-rose-700" aria-label={`Delete ${blog.title}`}><FiTrash2 /></button></div>
              </article>
            ))}
          </div>
        )}
        <Pagination pagination={pagination} onPageChange={setPage} />
      </section>

      <Modal open={formOpen} onClose={() => !saving && setFormOpen(false)} title={editing ? 'Edit blog' : 'Create blog'}>
        <form onSubmit={submit} className="space-y-5">
          <Field label="Title" required><input required maxLength={255} className={inputClass} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Slug" hint="Leave blank when creating to generate from title."><input maxLength={255} pattern="[a-z0-9-]*" className={inputClass} value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })} /></Field>
            <Field label="Category" required><input required maxLength={100} className={inputClass} value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} /></Field>
            <Field label="Author" required><input required maxLength={255} className={inputClass} value={form.author} onChange={(event) => setForm({ ...form, author: event.target.value })} /></Field>
            <Field label="Read time"><input maxLength={50} className={inputClass} value={form.read_time} onChange={(event) => setForm({ ...form, read_time: event.target.value })} /></Field>
            <Field label="Source platform"><select className={inputClass} value={form.source_platform} onChange={(event) => setForm({ ...form, source_platform: event.target.value })}><option value="website">Website article</option><option value="linkedin">LinkedIn</option><option value="facebook">Facebook</option><option value="instagram">Instagram</option><option value="youtube">YouTube</option><option value="other">Other</option></select></Field>
            <Field label="Publish date"><input required type="date" className={inputClass} value={form.published_at} onChange={(event) => setForm({ ...form, published_at: event.target.value })} /></Field>
          </div>
          <Field label="External post link" hint="Paste a LinkedIn, Facebook, or other source post URL."><input type="url" maxLength={1000} className={inputClass} value={form.external_url} onChange={(event) => setForm({ ...form, external_url: event.target.value })} placeholder="https://www.linkedin.com/posts/…" /></Field>
          <Field label="Image URL"><input type="url" maxLength={1000} className={inputClass} value={form.image_url} onChange={(event) => setForm({ ...form, image_url: event.target.value })} placeholder="https://…" /></Field>
          <Field label="Excerpt" required><textarea required maxLength={1000} rows={3} className={textareaClass} value={form.excerpt} onChange={(event) => setForm({ ...form, excerpt: event.target.value })} /></Field>
          <Field label="Website article content" hint="Add full content to publish directly on TrainerMentors. Separate paragraphs with blank lines."><textarea maxLength={50000} rows={12} className={textareaClass} value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} /></Field>
          <Field label="Reference link" hint="Optional source, citation, or related resource URL."><input type="url" maxLength={1000} className={inputClass} value={form.reference_url} onChange={(event) => setForm({ ...form, reference_url: event.target.value })} placeholder="https://…" /></Field>
          <label className="flex items-center justify-between rounded-xl border border-slate-200 p-4 text-sm"><span><strong className="block text-slate-800">Published</strong><span className="text-slate-500">Drafts are hidden from the public blog.</span></span><input type="checkbox" className="h-5 w-5 accent-violet-600" checked={form.is_published} onChange={(event) => setForm({ ...form, is_published: event.target.checked })} /></label>
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5"><button type="button" disabled={saving} onClick={() => setFormOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700">Cancel</button><button type="submit" disabled={saving} className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving…' : editing ? 'Save changes' : 'Create blog'}</button></div>
        </form>
      </Modal>
      <ConfirmDialog open={Boolean(target)} title="Delete blog?" message={`${target?.title || 'This blog'} will be permanently removed.`} confirmLabel="Delete blog" busy={saving} onClose={() => setTarget(null)} onConfirm={remove} />
    </div>
  );
};

export default AdminBlogsPage;
