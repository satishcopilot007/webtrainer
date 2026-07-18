import { FiBook, FiChevronDown, FiFileText, FiPlus, FiTrash2 } from 'react-icons/fi';
import { Field, inputClass, textareaClass } from './AdminUI';

export const emptyCourse = {
  title: '', slug: '', description: '', category_id: '', mentor_id: '', price: 0,
  duration_weeks: 8, level: 'all-levels', mode: 'Online, Classroom, Hybrid',
  certification: '', batch_options: 'Weekday / Weekend / Flexible', locations: '',
  max_students: 50, thumbnail: '', is_active: true, is_free_tutorial: false, modules: [],
};

const newLesson = () => ({ title: '', description: '', content: '', video_url: '', duration_minutes: '', sequence: 1 });
const newModule = () => ({ title: '', description: '', sequence: 1, lessons: [] });

const AdminCourseForm = ({ value, onChange, categories, tutors, saving, onCancel, onSubmit, editing, freeTutorialMode = false }) => {
  const patch = (updates) => onChange({ ...value, ...updates });
  const selectedCourseType = value._course_type || categories.find((item) => String(item.id) === String(value.category_id))?.course_type || 'tech';
  const visibleCategories = freeTutorialMode
    ? categories.filter((item) => (item.course_type || 'tech') === selectedCourseType)
    : categories;
  const updateModule = (moduleIndex, updates) => {
    const modules = value.modules.map((module, index) => index === moduleIndex ? { ...module, ...updates } : module);
    patch({ modules });
  };
  const addModule = () => patch({ modules: [...value.modules, { ...newModule(), sequence: value.modules.length + 1 }] });
  const removeModule = (moduleIndex) => patch({ modules: value.modules.filter((_, index) => index !== moduleIndex).map((module, index) => ({ ...module, sequence: index + 1 })) });
  const addLesson = (moduleIndex) => {
    const module = value.modules[moduleIndex];
    updateModule(moduleIndex, { lessons: [...(module.lessons || []), { ...newLesson(), sequence: (module.lessons?.length || 0) + 1 }] });
  };
  const updateLesson = (moduleIndex, lessonIndex, updates) => {
    const module = value.modules[moduleIndex];
    const lessons = module.lessons.map((lesson, index) => index === lessonIndex ? { ...lesson, ...updates } : lesson);
    updateModule(moduleIndex, { lessons });
  };
  const removeLesson = (moduleIndex, lessonIndex) => {
    const module = value.modules[moduleIndex];
    updateModule(moduleIndex, { lessons: module.lessons.filter((_, index) => index !== lessonIndex).map((lesson, index) => ({ ...lesson, sequence: index + 1 })) });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <section>
        <div className="mb-4 flex items-center gap-2"><span className="rounded-lg bg-violet-100 p-2 text-violet-700"><FiBook /></span><div><h3 className="font-bold text-slate-900">Course details</h3><p className="text-xs text-slate-500">Catalog, pricing, delivery, and assignment information.</p></div></div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <div className="md:col-span-2 xl:col-span-2"><Field label={freeTutorialMode ? 'Course name' : 'Title'} required><input required maxLength={255} className={inputClass} value={value.title} onChange={(event) => patch({ title: event.target.value })} placeholder={freeTutorialMode ? 'Java, .NET, Python…' : undefined} /></Field></div>
          <Field label="Slug" hint="Leave blank on create to generate from title."><input maxLength={255} pattern="[a-z0-9-]*" className={inputClass} value={value.slug} onChange={(event) => patch({ slug: event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })} /></Field>
          <div className="md:col-span-2 xl:col-span-3"><Field label={freeTutorialMode ? 'Course overview' : 'Description'} required hint={freeTutorialMode ? 'Explain what learners will study and what they can achieve.' : undefined}><textarea required maxLength={100000} rows={5} className={textareaClass} value={value.description} onChange={(event) => patch({ description: event.target.value })} /></Field></div>
          {freeTutorialMode && <Field label="Course type" required><select required className={inputClass} value={selectedCourseType} onChange={(event) => patch({ _course_type: event.target.value, category_id: '' })}><option value="tech">Technical</option><option value="non-tech">Non-technical</option></select></Field>}
          <Field label="Category" required><select required className={inputClass} value={value.category_id} onChange={(event) => patch({ category_id: event.target.value })}><option value="">Select category</option>{visibleCategories.filter((item) => Number(item.is_active) === 1 || String(item.id) === String(value.category_id)).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Field>
          {!freeTutorialMode && <Field label="Tutor" required><select required className={inputClass} value={value.mentor_id} onChange={(event) => patch({ mentor_id: event.target.value })}><option value="">Select tutor</option>{tutors.filter((item) => Number(item.is_active) === 1 || String(item.id) === String(value.mentor_id)).map((item) => <option key={item.id} value={item.id}>{item.name} · {item.email}</option>)}</select></Field>}
          <Field label="Level" required><select required className={inputClass} value={value.level} onChange={(event) => patch({ level: event.target.value })}><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option><option value="all-levels">All levels</option></select></Field>
          {!freeTutorialMode && <Field label="Price (INR)" required><input required type="number" min="0" max="99999999.99" step="0.01" className={inputClass} value={value.price} onChange={(event) => patch({ price: event.target.value })} /></Field>}
          <Field label="Duration (weeks)" required><input required type="number" min="1" max="520" className={inputClass} value={value.duration_weeks} onChange={(event) => patch({ duration_weeks: event.target.value })} /></Field>
          {!freeTutorialMode && <Field label="Maximum students" required><input required type="number" min="1" max="100000" className={inputClass} value={value.max_students} onChange={(event) => patch({ max_students: event.target.value })} /></Field>}
          {!freeTutorialMode && <Field label="Delivery mode"><input maxLength={255} className={inputClass} value={value.mode} onChange={(event) => patch({ mode: event.target.value })} /></Field>}
          <Field label="Certification"><input maxLength={500} className={inputClass} value={value.certification} onChange={(event) => patch({ certification: event.target.value })} /></Field>
          {!freeTutorialMode && <Field label="Batch options"><input maxLength={255} className={inputClass} value={value.batch_options} onChange={(event) => patch({ batch_options: event.target.value })} /></Field>}
          {!freeTutorialMode && <div className="md:col-span-2"><Field label="Locations"><textarea rows={2} maxLength={10000} className={textareaClass} value={value.locations} onChange={(event) => patch({ locations: event.target.value })} /></Field></div>}
          <Field label="Thumbnail URL"><input type="url" maxLength={255} className={inputClass} value={value.thumbnail} onChange={(event) => patch({ thumbnail: event.target.value })} placeholder="https://…" /></Field>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="flex items-center justify-between rounded-xl border border-slate-200 p-4 text-sm"><span><strong className="block text-slate-800">Active course</strong><span className="text-slate-500">Only active courses appear publicly.</span></span><input type="checkbox" className="h-5 w-5 accent-violet-600" checked={value.is_active} onChange={(event) => patch({ is_active: event.target.checked })} /></label>
          <label className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 text-sm"><span><strong className="block text-emerald-900">Free tutorial course</strong><span className="text-emerald-700">Show this course, modules, and lessons in Free Courses and the first navigation row.</span></span><input type="checkbox" disabled={freeTutorialMode} className="h-5 w-5 accent-emerald-600 disabled:cursor-not-allowed" checked={freeTutorialMode || Boolean(value.is_free_tutorial)} onChange={(event) => patch({ is_free_tutorial: event.target.checked, ...(event.target.checked ? { price: 0 } : {}) })} /></label>
        </div>
      </section>

      <section className="border-t border-slate-200 pt-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div><h3 className="font-bold text-slate-900">{freeTutorialMode ? 'Tutorial content' : 'Nested syllabus'}</h3><p className="text-xs leading-5 text-slate-500">{freeTutorialMode ? 'Create up to 100 modules, 200 lessons per module, and 200,000 characters of content per lesson.' : 'Saving replaces this course’s module and lesson tree atomically.'}</p></div>
          <button type="button" onClick={addModule} className="inline-flex items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm font-semibold text-violet-700 hover:bg-violet-100"><FiPlus /> Add module</button>
        </div>
        {value.modules.length === 0 && <div className="mt-5 rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">No syllabus modules yet. Add a module to begin.</div>}
        <div className="mt-5 space-y-5">
          {value.modules.map((module, moduleIndex) => (
            <details key={module.id || `module-${moduleIndex}`} open={moduleIndex === value.modules.length - 1} className="group rounded-2xl border border-slate-200 bg-slate-50/60">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 sm:p-5"><span className="flex min-w-0 items-center gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet-100 font-bold text-violet-700">{moduleIndex + 1}</span><span className="truncate font-bold text-slate-800">{module.title || `New module ${moduleIndex + 1}`}</span></span><span className="flex items-center gap-2"><span className="hidden text-xs font-medium text-slate-400 sm:inline">{module.lessons?.length || 0} lessons</span><FiChevronDown className="text-slate-500 transition group-open:rotate-180" /></span></summary>
              <div className="border-t border-slate-200 p-4 sm:p-5">
              <div className="flex justify-end"><button type="button" onClick={() => removeModule(moduleIndex)} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50" aria-label={`Remove module ${moduleIndex + 1}`}><FiTrash2 /> Remove module</button></div>
              <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_110px]">
                <Field label="Module title" required><input required maxLength={255} className={inputClass} value={module.title} onChange={(event) => updateModule(moduleIndex, { title: event.target.value })} /></Field>
                <Field label="Order"><input type="number" min="0" className={inputClass} value={module.sequence} onChange={(event) => updateModule(moduleIndex, { sequence: event.target.value })} /></Field>
                <div className="sm:col-span-2"><Field label="Module description"><textarea rows={2} maxLength={10000} className={textareaClass} value={module.description || ''} onChange={(event) => updateModule(moduleIndex, { description: event.target.value })} /></Field></div>
              </div>
              <div className="mt-5 space-y-3 border-l-2 border-violet-200 pl-3 sm:pl-5">
                {(module.lessons || []).map((lesson, lessonIndex) => (
                  <details key={lesson.id || `lesson-${lessonIndex}`} open={lessonIndex === (module.lessons?.length || 0) - 1} className="group/lesson rounded-xl border border-slate-200 bg-white">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4"><span className="flex min-w-0 items-center gap-2"><FiFileText className="shrink-0 text-violet-600" /><span className="truncate text-sm font-bold text-slate-800">{lesson.title || `New lesson ${lessonIndex + 1}`}</span></span><FiChevronDown className="text-slate-400 transition group-open/lesson:rotate-180" /></summary>
                    <div className="border-t border-slate-100 p-4">
                    <div className="mb-3 flex justify-end"><button type="button" onClick={() => removeLesson(moduleIndex, lessonIndex)} className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50" aria-label={`Remove lesson ${lessonIndex + 1}`}><FiTrash2 /> Remove lesson</button></div>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <div className="md:col-span-2"><Field label="Lesson title" required><input required maxLength={255} className={inputClass} value={lesson.title} onChange={(event) => updateLesson(moduleIndex, lessonIndex, { title: event.target.value })} /></Field></div>
                      <Field label="Duration (minutes)"><input type="number" min="0" className={inputClass} value={lesson.duration_minutes ?? ''} onChange={(event) => updateLesson(moduleIndex, lessonIndex, { duration_minutes: event.target.value })} /></Field>
                      <Field label="Order"><input type="number" min="0" className={inputClass} value={lesson.sequence} onChange={(event) => updateLesson(moduleIndex, lessonIndex, { sequence: event.target.value })} /></Field>
                      <div className="md:col-span-2"><Field label="Video URL"><input type="url" maxLength={255} className={inputClass} value={lesson.video_url || ''} onChange={(event) => updateLesson(moduleIndex, lessonIndex, { video_url: event.target.value })} /></Field></div>
                      <div className="md:col-span-2"><Field label="Description"><textarea rows={2} maxLength={10000} className={textareaClass} value={lesson.description || ''} onChange={(event) => updateLesson(moduleIndex, lessonIndex, { description: event.target.value })} /></Field></div>
                      <div className="md:col-span-2 xl:col-span-4"><Field label="Lesson content" hint={`${(lesson.content || '').length.toLocaleString()} / 200,000 characters`}><textarea rows={freeTutorialMode ? 10 : 3} maxLength={200000} className={textareaClass} value={lesson.content || ''} onChange={(event) => updateLesson(moduleIndex, lessonIndex, { content: event.target.value })} placeholder={freeTutorialMode ? 'Write the complete tutorial lesson here. Use paragraphs and line breaks for long-form content.' : undefined} /></Field></div>
                    </div>
                    </div>
                  </details>
                ))}
                <button type="button" onClick={() => addLesson(moduleIndex)} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-50"><FiPlus /> Add lesson</button>
              </div>
              </div>
            </details>
          ))}
        </div>
      </section>

      <div className="sticky bottom-0 -mx-5 flex justify-end gap-3 border-t border-slate-200 bg-white/95 px-5 py-4 backdrop-blur sm:-mx-6 sm:px-6">
        <button type="button" disabled={saving} onClick={onCancel} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700">Cancel</button>
        <button type="submit" disabled={saving} className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50">{saving ? 'Saving transaction…' : editing ? 'Save course' : 'Create course'}</button>
      </div>
    </form>
  );
};

export default AdminCourseForm;
