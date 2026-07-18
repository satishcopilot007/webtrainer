import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiEdit2, FiExternalLink, FiImage, FiPlus, FiPower, FiTrash2, FiUploadCloud, FiUser } from 'react-icons/fi';
import {
  createTutor, deactivateTutor, getApiError, getTutors, updateTutor, uploadTutorProfileImage,
} from '../../api/adminApi';
import {
  AdminPageHeader, ConfirmDialog, EmptyState, ErrorState, Field, LoadingState, Modal,
  Pagination, SearchToolbar, StatusBadge, formatDate, inputClass, textareaClass,
} from '../../components/admin/AdminUI';

const emptyForm = { name: '', email: '', password: '', phone: '', bio: '', profile_image: '', is_active: true };

const AdminTutorsPage = () => {
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [target, setTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getTutors({ page, pageSize: 20, search, status });
      setRows(response.data.data);
      setPagination(response.data.pagination);
    } catch (requestError) {
      setError(getApiError(requestError, 'Unable to load tutors'));
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm });
    setImagePreview('');
    setFormOpen(true);
  };

  const openEdit = (tutor) => {
    setEditing(tutor);
    setForm({
      name: tutor.name || '', email: tutor.email || '', password: '', phone: tutor.phone || '',
      bio: tutor.bio || '', profile_image: tutor.profile_image || '', is_active: Boolean(Number(tutor.is_active)),
    });
    setImagePreview(tutor.profile_image || '');
    setFormOpen(true);
  };

  const closeForm = () => {
    if (saving) return;
    setFormOpen(false);
    setEditing(null);
    setForm({ ...emptyForm });
    setImagePreview('');
  };

  const uploadProfileImage = async (event) => {
    const input = event.target;
    const file = input.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Choose a JPEG, PNG, or WebP image');
      input.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Profile image must not exceed 5 MB');
      input.value = '';
      return;
    }

    const temporaryPreview = URL.createObjectURL(file);
    setImagePreview(temporaryPreview);
    setUploadingImage(true);
    try {
      const response = await uploadTutorProfileImage(file);
      const imageUrl = response.data.data.url;
      setForm((current) => ({ ...current, profile_image: imageUrl }));
      setImagePreview(imageUrl);
      toast.success('Profile image uploaded');
    } catch (requestError) {
      setImagePreview(form.profile_image || '');
      toast.error(getApiError(requestError, 'Unable to upload profile image'));
    } finally {
      URL.revokeObjectURL(temporaryPreview);
      setUploadingImage(false);
      input.value = '';
    }
  };

  const removeProfileImage = () => {
    setForm((current) => ({ ...current, profile_image: '' }));
    setImagePreview('');
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      if (editing && !payload.password) delete payload.password;
      if (editing) {
        await updateTutor(editing.id, payload);
        toast.success('Tutor updated');
      } else {
        await createTutor(payload);
        toast.success('Tutor created');
      }
      setFormOpen(false);
      setEditing(null);
      setForm({ ...emptyForm });
      await load();
    } catch (requestError) {
      toast.error(getApiError(requestError, 'Unable to save tutor'));
    } finally {
      setSaving(false);
    }
  };

  const deactivate = async () => {
    if (!target) return;
    setSaving(true);
    try {
      const response = await deactivateTutor(target.id);
      const retained = response.data.data?.retained_course_count || 0;
      toast.success(retained ? `Tutor deactivated; ${retained} assigned course(s) retained` : 'Tutor deactivated');
      setTarget(null);
      await load();
    } catch (requestError) {
      toast.error(getApiError(requestError, 'Unable to deactivate tutor'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="People"
        title="Tutor management"
        description="Create mentor accounts and maintain public profiles. Active tutors appear in the public About page mentor section."
        action={<div className="flex flex-wrap gap-2"><a href="/about#mentors" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-200 hover:text-violet-700"><FiExternalLink /> View public profiles</a><button type="button" onClick={openCreate} className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"><FiPlus /> Add tutor</button></div>}
      />
      <SearchToolbar value={query} onChange={setQuery} onSubmit={() => { setPage(1); setSearch(query.trim()); }} placeholder="Search name, email, or phone…">
        <select value={status} onChange={(event) => { setPage(1); setStatus(event.target.value); }} className={`${inputClass} sm:w-40`} aria-label="Filter tutor status">
          <option value="all">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option>
        </select>
      </SearchToolbar>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={load} /> : rows.length === 0 ? <EmptyState title="No tutors found" /> : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-4 font-semibold">Tutor</th><th className="px-5 py-4 font-semibold">Contact</th><th className="px-5 py-4 font-semibold">Courses</th><th className="px-5 py-4 font-semibold">Status</th><th className="px-5 py-4 font-semibold">Joined</th><th className="px-5 py-4 text-right font-semibold">Actions</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((tutor) => (
                  <tr key={tutor.id} className="transition hover:bg-slate-50/70">
                    <td className="px-5 py-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-violet-100 text-violet-700">{tutor.profile_image ? <img src={tutor.profile_image} alt="" className="h-full w-full object-cover" /> : <FiUser />}</span><div><p className="font-semibold text-slate-900">{tutor.name}</p><p className="max-w-xs truncate text-xs text-slate-500">{tutor.bio || 'No bio added'}</p></div></div></td>
                    <td className="px-5 py-4"><p className="text-slate-700">{tutor.email}</p><p className="text-xs text-slate-400">{tutor.phone || 'No phone'}</p></td>
                    <td className="px-5 py-4"><p className="font-semibold text-slate-800">{tutor.active_course_count || 0} active</p><p className="text-xs text-slate-400">{tutor.course_count || 0} total</p></td>
                    <td className="px-5 py-4"><StatusBadge status={Number(tutor.is_active) ? 'active' : 'inactive'} /></td>
                    <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500">{formatDate(tutor.created_at)}</td>
                    <td className="px-5 py-4"><div className="flex justify-end gap-2"><button type="button" onClick={() => openEdit(tutor)} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700" aria-label={`Edit ${tutor.name}`}><FiEdit2 /></button>{Number(tutor.is_active) === 1 && <button type="button" onClick={() => setTarget(tutor)} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700" aria-label={`Deactivate ${tutor.name}`}><FiPower /></button>}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination pagination={pagination} onPageChange={setPage} />
      </section>

      <Modal open={formOpen} onClose={closeForm} title={editing ? 'Edit tutor' : 'Create tutor'} description="Tutor accounts always receive the mentor role.">
        <form onSubmit={submit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name" required><input className={inputClass} required maxLength={255} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></Field>
            <Field label="Email" required><input className={inputClass} type="email" required maxLength={255} value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></Field>
            <Field label={editing ? 'New password' : 'Temporary password'} required={!editing} hint={editing ? 'Leave blank to keep the current password.' : 'Use at least 8 characters and share it securely.'}><input className={inputClass} type="password" minLength={form.password ? 8 : undefined} required={!editing} autoComplete="new-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></Field>
            <Field label="Phone"><input className={inputClass} maxLength={30} value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></Field>
          </div>
          <Field label="Profile image" hint="JPEG, PNG, or WebP. Maximum file size: 5 MB.">
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <span className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white text-3xl text-slate-300 ring-1 ring-slate-200">
                  {imagePreview ? <img src={imagePreview} alt="Tutor profile preview" className="h-full w-full object-cover" /> : <FiImage />}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">Upload from this device</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">Use a square image for the best public profile appearance.</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <label className={`inline-flex cursor-pointer items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 ${uploadingImage ? 'pointer-events-none opacity-50' : ''}`}>
                      <FiUploadCloud /> {uploadingImage ? 'Uploading…' : imagePreview ? 'Replace image' : 'Choose image'}
                      <input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" onChange={uploadProfileImage} disabled={uploadingImage} className="sr-only" />
                    </label>
                    {imagePreview && <button type="button" onClick={removeProfileImage} disabled={uploadingImage} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:border-rose-200 hover:text-rose-600 disabled:opacity-50"><FiTrash2 /> Remove</button>}
                  </div>
                </div>
              </div>
            </div>
          </Field>
          <Field label="Bio"><textarea className={textareaClass} maxLength={10000} value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} /></Field>
          <label className="flex items-center justify-between rounded-xl border border-slate-200 p-4 text-sm"><span><strong className="block text-slate-800">Active account</strong><span className="text-slate-500">Inactive tutors cannot sign in.</span></span><input type="checkbox" checked={form.is_active} onChange={(event) => setForm({ ...form, is_active: event.target.checked })} className="h-5 w-5 accent-violet-600" /></label>
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5"><button type="button" onClick={closeForm} disabled={saving || uploadingImage} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700">Cancel</button><button type="submit" disabled={saving || uploadingImage} className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50">{uploadingImage ? 'Uploading image…' : saving ? 'Saving…' : editing ? 'Save changes' : 'Create tutor'}</button></div>
        </form>
      </Modal>

      <ConfirmDialog open={Boolean(target)} title="Deactivate tutor?" message={`${target?.name || 'This tutor'} will lose sign-in access. Assigned courses remain linked and are not deleted.`} confirmLabel="Deactivate tutor" busy={saving} onClose={() => setTarget(null)} onConfirm={deactivate} />
    </div>
  );
};

export default AdminTutorsPage;
