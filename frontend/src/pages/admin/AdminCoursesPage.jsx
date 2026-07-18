import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiBookOpen, FiEdit2, FiExternalLink, FiFolderPlus, FiPlus, FiPower } from 'react-icons/fi';
import {
  createAdminCourse, createCategory, deactivateAdminCourse, getAdminCategories, getAdminCourse,
  getAdminCourses, getApiError, getTutors, updateAdminCourse,
} from '../../api/adminApi';
import AdminCourseForm, { emptyCourse } from '../../components/admin/AdminCourseForm';
import { FREE_COURSE_LIST } from '../../data/freeCourseContent';
import {
  AdminPageHeader, ConfirmDialog, EmptyState, ErrorState, LoadingState, Modal,
  Field, Pagination, SearchToolbar, StatusBadge, formatCurrency, formatDate, inputClass, textareaClass,
} from '../../components/admin/AdminUI';

const AdminCoursesPage = ({ freeTutorialOnly = false }) => {
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ...emptyCourse });
  const [saving, setSaving] = useState(false);
  const [target, setTarget] = useState(null);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ name: '', slug: '', course_type: 'tech', description: '', image: '', is_active: true });

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const response = await getAdminCourses({ page, pageSize: 20, search, status, ...(freeTutorialOnly ? { is_free_tutorial: 1 } : {}) });
      setRows(response.data.data); setPagination(response.data.pagination);
    } catch (requestError) { setError(getApiError(requestError, 'Unable to load courses')); }
    finally { setLoading(false); }
  }, [page, search, status, freeTutorialOnly]);

  const loadReferences = useCallback(async () => {
    try {
      const [categoryResponse, tutorResponse] = await Promise.all([
        getAdminCategories({ page: 1, pageSize: 100 }), getTutors({ page: 1, pageSize: 100, status: 'all' }),
      ]);
      setCategories(categoryResponse.data.data); setTutors(tutorResponse.data.data);
    } catch (requestError) { toast.error(getApiError(requestError, 'Unable to load course options')); }
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { loadReferences(); }, [loadReferences]);

  const openCreate = () => {
    setEditing(null); setForm({ ...emptyCourse, is_free_tutorial: freeTutorialOnly, price: 0, mentor_id: freeTutorialOnly ? (tutors.find((item) => Number(item.is_active) === 1)?.id || '') : '', _course_type: 'tech', modules: [] }); setFormOpen(true);
  };

  const openEdit = async (course) => {
    setEditing(course); setFormOpen(true); setFormLoading(true);
    try {
      const response = await getAdminCourse(course.id);
      const detail = response.data.data;
      setForm({
        title: detail.title || '', slug: detail.slug || '', description: detail.description || '',
        category_id: detail.category_id || '', mentor_id: detail.mentor_id || '', price: detail.price ?? 0,
        duration_weeks: detail.duration_weeks || 8, level: detail.level || 'all-levels', mode: detail.mode || '',
        certification: detail.certification || '', batch_options: detail.batch_options || '', locations: detail.locations || '',
        max_students: detail.max_students || 50, thumbnail: detail.thumbnail || '', is_active: Boolean(Number(detail.is_active)),
        is_free_tutorial: Boolean(Number(detail.is_free_tutorial)),
        _course_type: categories.find((item) => String(item.id) === String(detail.category_id))?.course_type || 'tech',
        modules: detail.modules || [],
      });
    } catch (requestError) {
      toast.error(getApiError(requestError, 'Unable to load course details')); setFormOpen(false); setEditing(null);
    } finally { setFormLoading(false); }
  };

  const payload = () => ({
    title: form.title, slug: form.slug, description: form.description,
    level: form.level, mode: form.mode, certification: form.certification,
    batch_options: form.batch_options, locations: form.locations, thumbnail: form.thumbnail,
    is_active: form.is_active, is_free_tutorial: form.is_free_tutorial,
    ...(freeTutorialOnly ? { is_free_tutorial: true } : {}),
    category_id: Number(form.category_id), mentor_id: Number(form.mentor_id), price: freeTutorialOnly ? 0 : Number(form.price),
    duration_weeks: Number(form.duration_weeks), max_students: Number(form.max_students),
    modules: form.modules.map((module, moduleIndex) => ({
      title: module.title, description: module.description || '', sequence: Number(module.sequence || moduleIndex + 1),
      lessons: (module.lessons || []).map((lesson, lessonIndex) => ({
        title: lesson.title, description: lesson.description || '', content: lesson.content || '', video_url: lesson.video_url || '',
        sequence: Number(lesson.sequence || lessonIndex + 1),
        duration_minutes: lesson.duration_minutes === '' || lesson.duration_minutes == null ? null : Number(lesson.duration_minutes),
      })),
    })),
  });

  const submit = async (event) => {
    event.preventDefault(); setSaving(true);
    try {
      if (editing) { await updateAdminCourse(editing.id, payload()); toast.success('Course and syllabus updated'); }
      else { await createAdminCourse(payload()); toast.success('Course and syllabus created'); }
      setFormOpen(false); setEditing(null); await load();
    } catch (requestError) { toast.error(getApiError(requestError, 'Unable to save course')); }
    finally { setSaving(false); }
  };

  const deactivate = async () => {
    setSaving(true);
    try { await deactivateAdminCourse(target.id); toast.success('Course deactivated'); setTarget(null); await load(); }
    catch (requestError) { toast.error(getApiError(requestError, 'Unable to deactivate course')); }
    finally { setSaving(false); }
  };

  const submitCategory = async (event) => {
    event.preventDefault(); setSaving(true);
    try {
      await createCategory(categoryForm);
      toast.success('Free course category created');
      setCategoryOpen(false);
      setCategoryForm({ name: '', slug: '', course_type: 'tech', description: '', image: '', is_active: true });
      await loadReferences();
    } catch (requestError) { toast.error(getApiError(requestError, 'Unable to create category')); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow={freeTutorialOnly ? 'Free learning library' : 'Catalog'}
        title={freeTutorialOnly ? 'Free courses & content' : 'Courses & syllabus'}
        description={freeTutorialOnly ? 'Create tutorial categories, courses, modules, and long-form lessons. Active courses appear automatically in the free-course hub and first navigation row.' : 'Manage catalog visibility, tutor/category assignments, commercial details, and transactional module/lesson trees.'}
        action={<div className="flex flex-wrap gap-2">{freeTutorialOnly && <button type="button" onClick={() => setCategoryOpen(true)} className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-4 py-3 text-sm font-semibold text-violet-700 hover:bg-violet-50"><FiFolderPlus /> Add category</button>}<button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 hover:bg-violet-700"><FiPlus /> {freeTutorialOnly ? 'Add free course' : 'Add course'}</button></div>}
      />
      {freeTutorialOnly && <section className="grid gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900 sm:grid-cols-3"><div><strong className="block text-lg">100</strong>modules per course</div><div><strong className="block text-lg">200</strong>lessons per module</div><div><strong className="block text-lg">200,000</strong>characters per lesson</div></section>}
      {freeTutorialOnly && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="font-bold text-slate-900">Built-in free courses</h2>
            <p className="mt-1 text-sm text-slate-500">These starter tutorials are included with the website. Courses you create, such as Java or .NET, are managed in the table below.</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {FREE_COURSE_LIST.map((course) => {
              const lessonCount = course.modules.reduce((total, module) => total + (module.lessons?.length || 0), 0);
              return (
                <article key={course.slug} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${course.color} text-xl text-white shadow-sm`}>{course.icon}</span>
                    <span className="rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-violet-700">Built-in</span>
                  </div>
                  <h3 className="mt-4 font-bold text-slate-900">{course.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{course.description}</p>
                  <div className="mt-4 flex items-center gap-3 text-xs font-semibold text-slate-600">
                    <span>{course.modules.length} modules</span><span className="text-slate-300">•</span><span>{lessonCount} lessons</span>
                  </div>
                  <a href={`/free-courses/${course.slug}`} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-violet-700 hover:text-violet-900">View course <FiExternalLink /></a>
                </article>
              );
            })}
          </div>
        </section>
      )}
      <SearchToolbar value={query} onChange={setQuery} onSubmit={() => { setPage(1); setSearch(query.trim()); }} placeholder="Search course, slug, category, or tutor…">
        <select value={status} onChange={(event) => { setPage(1); setStatus(event.target.value); }} className={`${inputClass} sm:w-40`} aria-label="Filter course status"><option value="all">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option></select>
      </SearchToolbar>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={load} /> : rows.length === 0 ? <EmptyState title="No courses found" /> : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-4 font-semibold">Course</th><th className="px-5 py-4 font-semibold">Assignment</th><th className="px-5 py-4 font-semibold">Pricing</th><th className="px-5 py-4 font-semibold">Syllabus</th><th className="px-5 py-4 font-semibold">Status</th><th className="px-5 py-4 text-right font-semibold">Actions</th></tr></thead>
              <tbody className="divide-y divide-slate-100">{rows.map((course) => (
                <tr key={course.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-4"><div className="flex items-center gap-3"><span className="grid h-11 w-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-emerald-100 text-emerald-700">{course.thumbnail ? <img src={course.thumbnail} alt="" className="h-full w-full object-cover" /> : <FiBookOpen />}</span><div className="max-w-sm"><div className="flex flex-wrap items-center gap-2"><p className="font-semibold text-slate-900">{course.title}</p>{Number(course.is_free_tutorial) === 1 && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">Free tutorial</span>}</div><p className="truncate text-xs text-slate-400">/{course.slug} · Updated {formatDate(course.updated_at)}</p></div></div></td>
                  <td className="px-5 py-4"><p className="font-medium text-slate-700">{course.category_name || 'Uncategorized'}</p><p className="text-xs text-slate-400">{course.mentor_name || 'No tutor'}</p></td>
                  <td className="whitespace-nowrap px-5 py-4"><p className={`font-semibold ${Number(course.is_free_tutorial) === 1 ? 'text-emerald-700' : 'text-slate-800'}`}>{Number(course.is_free_tutorial) === 1 ? 'FREE' : formatCurrency(course.price)}</p><p className="text-xs capitalize text-slate-400">{course.level} · {course.duration_weeks} weeks</p></td>
                  <td className="whitespace-nowrap px-5 py-4"><p className="font-semibold text-slate-800">{course.module_count || 0} modules</p><p className="text-xs text-slate-400">{course.lesson_count || 0} lessons</p></td>
                  <td className="px-5 py-4"><StatusBadge status={Number(course.is_active) ? 'active' : 'inactive'} /></td>
                  <td className="px-5 py-4"><div className="flex justify-end gap-2"><button type="button" onClick={() => openEdit(course)} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-violet-50 hover:text-violet-700" aria-label={`Edit ${course.title}`}><FiEdit2 /></button>{Number(course.is_active) === 1 && <button type="button" onClick={() => setTarget(course)} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-rose-50 hover:text-rose-700" aria-label={`Deactivate ${course.title}`}><FiPower /></button>}</div></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
        <Pagination pagination={pagination} onPageChange={setPage} />
      </section>

      <Modal open={formOpen} onClose={() => !saving && setFormOpen(false)} title={editing ? `Edit ${freeTutorialOnly ? 'free ' : ''}course` : `Create ${freeTutorialOnly ? 'free ' : ''}course`} description={freeTutorialOnly ? 'Add course details, then create all modules, lessons, videos, and long-form content in the same editor.' : 'Course and syllabus changes are validated and saved together.'} size="max-w-6xl">
        {formLoading ? <LoadingState label="Loading complete course…" /> : <AdminCourseForm value={form} onChange={setForm} categories={categories} tutors={tutors} saving={saving} onCancel={() => setFormOpen(false)} onSubmit={submit} editing={Boolean(editing)} freeTutorialMode={freeTutorialOnly} />}
      </Modal>
      <Modal open={categoryOpen} onClose={() => !saving && setCategoryOpen(false)} title="Add free course category" description="The new category becomes available immediately in the free course editor.">
        <form onSubmit={submitCategory} className="space-y-5">
          <Field label="Course type" required><select required className={inputClass} value={categoryForm.course_type} onChange={(event) => setCategoryForm({ ...categoryForm, course_type: event.target.value })}><option value="tech">Technical</option><option value="non-tech">Non-technical</option></select></Field>
          <Field label="Category name" required><input required maxLength={255} className={inputClass} value={categoryForm.name} onChange={(event) => setCategoryForm({ ...categoryForm, name: event.target.value })} placeholder="Programming" /></Field>
          <Field label="Slug" hint="Leave blank to generate it from the name."><input maxLength={255} pattern="[a-z0-9-]*" className={inputClass} value={categoryForm.slug} onChange={(event) => setCategoryForm({ ...categoryForm, slug: event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })} placeholder="programming" /></Field>
          <Field label="Description"><textarea rows={4} maxLength={5000} className={textareaClass} value={categoryForm.description} onChange={(event) => setCategoryForm({ ...categoryForm, description: event.target.value })} /></Field>
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5"><button type="button" disabled={saving} onClick={() => setCategoryOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700">Cancel</button><button type="submit" disabled={saving} className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Creating…' : 'Create category'}</button></div>
        </form>
      </Modal>
      <ConfirmDialog open={Boolean(target)} title="Deactivate course?" message={`${target?.title || 'This course'} will disappear from active catalog results. Its data, syllabus, enrollments, and payment history remain intact.`} confirmLabel="Deactivate course" busy={saving} onClose={() => setTarget(null)} onConfirm={deactivate} />
    </div>
  );
};

export default AdminCoursesPage;
