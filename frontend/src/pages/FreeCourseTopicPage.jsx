import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, Navigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaBookOpen, FaCheckCircle, FaClock, FaLightbulb } from 'react-icons/fa';
import { FREE_COURSE_LIST, FREE_COURSE_TOPICS } from '../data/freeCourseContent';
import { getFreeTutorialBySlug } from '../api/courseApi';

const lessonId = (moduleIndex, lessonIndex) => `lesson-${moduleIndex + 1}-${lessonIndex + 1}`;

const adminCourseToTopic = (course) => ({
  title: course.title,
  icon: '📘',
  color: 'from-emerald-600 to-teal-500',
  description: course.description,
  level: String(course.level || 'all levels').replace('-', ' '),
  duration: `${course.duration_weeks || 1} weeks`,
  prerequisites: 'Review the course description and begin with the first module. No payment is required.',
  outcomes: [
    `Understand the core concepts covered in ${course.title}`,
    'Apply each lesson through structured practice',
    'Progress through the complete module sequence',
    course.certification || 'Build practical, job-relevant knowledge',
  ],
  modules: (Array.isArray(course.modules) ? course.modules : []).map((module) => ({
    ...module,
    summary: module.description || 'Study the lessons in this module in sequence.',
    lessons: Array.isArray(module.lessons) ? module.lessons : [],
  })),
});

const FreeCourseTopicPage = () => {
  const { topicSlug } = useParams();
  const staticTopic = FREE_COURSE_TOPICS[topicSlug];
  const [topic, setTopic] = useState(staticTopic || null);
  const [loading, setLoading] = useState(!staticTopic);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    const builtInTopic = FREE_COURSE_TOPICS[topicSlug];
    if (builtInTopic) {
      setTopic(builtInTopic);
      setLoading(false);
      setNotFound(false);
      return undefined;
    }

    let active = true;
    setLoading(true);
    setNotFound(false);
    getFreeTutorialBySlug(topicSlug)
      .then((course) => active && setTopic(adminCourseToTopic(course)))
      .catch(() => active && setNotFound(true))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [topicSlug]);

  if (loading) return <div className="grid min-h-[60vh] place-items-center bg-slate-50 text-sm font-semibold text-slate-500">Loading free course…</div>;

  if (notFound || !topic) return <Navigate to="/free-courses" replace />;

  const lessonCount = topic.modules.reduce((total, module) => total + (module.lessons?.length || 0), 0);

  return (
    <>
      <Helmet>
        <title>Free {topic.title} Course | TrainerMentors</title>
        <meta name="description" content={`${topic.description} Study ${lessonCount} free lessons with practical exercises.`} />
        <link rel="canonical" href={`https://trainermentors.com/free-courses/${topicSlug}`} />
      </Helmet>

      <section className={`bg-gradient-to-br ${topic.color} pt-28 pb-16 text-white`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Link to="/free-courses" className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white">
            <FaArrowLeft /> All free courses
          </Link>
          <div className="max-w-4xl">
            <span className="inline-flex rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider backdrop-blur">100% free learning path</span>
            <div className="mt-5 flex items-start gap-4">
              <span className="text-5xl" aria-hidden="true">{topic.icon}</span>
              <div>
                <h1 className="text-4xl font-black tracking-tight sm:text-5xl">{topic.title} Course</h1>
                <p className="mt-4 max-w-3xl text-lg leading-8 text-white/85">{topic.description}</p>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold">
              <span className="rounded-full bg-black/15 px-4 py-2"><FaBookOpen className="mr-2 inline" />{topic.modules.length} modules · {lessonCount} lessons</span>
              <span className="rounded-full bg-black/15 px-4 py-2"><FaClock className="mr-2 inline" />{topic.duration}</span>
              <span className="rounded-full bg-black/15 px-4 py-2">{topic.level}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-12 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-bold text-slate-900">Course contents</h2>
              <nav className="mt-4 space-y-4" aria-label={`${topic.title} course contents`}>
                {topic.modules.map((module, moduleIndex) => (
                  <div key={module.title}>
                    <p className="text-xs font-bold uppercase tracking-wide text-violet-600">Module {moduleIndex + 1}</p>
                    <ul className="mt-2 space-y-1.5">
                      {(module.lessons || []).map((lesson, lessonIndex) => (
                        <li key={lesson.title}>
                          <a href={`#${lessonId(moduleIndex, lessonIndex)}`} className="block text-sm leading-5 text-slate-600 hover:text-violet-700">{lesson.title}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
            </div>
          </aside>

          <main className="min-w-0 space-y-8">
            <section className="grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">What you will learn</h2>
                <ul className="mt-4 space-y-3">
                  {topic.outcomes.map((outcome) => <li key={outcome} className="flex gap-3 text-sm leading-6 text-slate-600"><FaCheckCircle className="mt-1 shrink-0 text-emerald-500" />{outcome}</li>)}
                </ul>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">Before you begin</h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">{topic.prerequisites}</p>
                <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-900"><FaLightbulb className="mr-2 inline text-amber-500" />Complete each practice task before moving to the next lesson.</p>
              </div>
            </section>

            {topic.modules.map((module, moduleIndex) => (
              <section key={module.title} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <header className="border-b border-slate-200 bg-slate-900 px-6 py-5 text-white sm:px-8">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">Module {moduleIndex + 1}</p>
                  <h2 className="mt-1 text-2xl font-black">{module.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{module.summary}</p>
                </header>
                <div className="divide-y divide-slate-100">
                  {(module.lessons || []).map((lesson, lessonIndex) => (
                    <article id={lessonId(moduleIndex, lessonIndex)} key={lesson.title} className="scroll-mt-28 px-6 py-7 sm:px-8">
                      <div className="flex gap-4">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-violet-100 text-sm font-black text-violet-700">{moduleIndex + 1}.{lessonIndex + 1}</span>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">{lesson.title}</h3>
                          <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-600">{lesson.content || lesson.description || 'Lesson content will be available soon.'}</p>
                          {lesson.video_url && <a href={lesson.video_url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex rounded-lg bg-violet-100 px-3 py-2 text-sm font-bold text-violet-700 hover:bg-violet-200">Watch lesson video</a>}
                          {lesson.practice && <div className="mt-5 rounded-xl border border-cyan-100 bg-cyan-50 p-4">
                            <p className="text-xs font-bold uppercase tracking-wide text-cyan-800">Practice exercise</p>
                            <p className="mt-1 text-sm leading-6 text-cyan-950">{lesson.practice}</p>
                          </div>}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}

            <section className="rounded-2xl bg-slate-900 p-7 text-white sm:p-9">
              <h2 className="text-2xl font-black">Continue learning for free</h2>
              <p className="mt-2 text-slate-300">Explore another structured learning path and build connected skills.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {FREE_COURSE_LIST.filter((item) => item.slug !== topicSlug).map((item) => (
                  <Link key={item.slug} to={`/free-courses/${item.slug}`} className="rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold hover:bg-white/20">{item.icon} {item.title}</Link>
                ))}
              </div>
            </section>
          </main>
        </div>
      </section>
    </>
  );
};

export default FreeCourseTopicPage;
