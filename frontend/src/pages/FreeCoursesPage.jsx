import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaBookOpen, FaCheckCircle, FaClock } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { FREE_COURSE_LIST } from '../data/freeCourseContent';
import { getFreeTutorialCourses } from '../api/courseApi';

const FreeCoursesPage = () => {
  const [adminCourses, setAdminCourses] = useState([]);

  useEffect(() => {
    let active = true;
    getFreeTutorialCourses()
      .then((response) => active && setAdminCourses(Array.isArray(response.data?.data) ? response.data.data : []))
      .catch(() => active && setAdminCourses([]));
    return () => { active = false; };
  }, []);

  const staticSlugs = new Set(FREE_COURSE_LIST.map((course) => course.slug));
  const dynamicCourses = adminCourses
    .filter((course) => course.slug && !staticSlugs.has(course.slug))
    .map((course) => ({
      ...course,
      icon: '📘',
      color: 'from-emerald-600 to-teal-500',
      duration: `${course.duration_weeks || 1} weeks`,
      modules: Array.isArray(course.modules) ? course.modules : [],
    }));
  const freeCourses = [...FREE_COURSE_LIST, ...dynamicCourses];

  return (
    <>
      <Helmet>
        <title>Free Courses | TrainerMentors</title>
        <meta name="description" content="Learn Generative AI, machine learning, and cloud computing through free structured lessons and practical exercises." />
      </Helmet>

      <section className="pt-32 pb-20 bg-gradient-to-br from-purple-900 via-dark-800 to-dark-900">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="text-6xl mb-4">🎓</div>
            <span className="inline-flex rounded-full bg-emerald-500/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300 ring-1 ring-emerald-400/30">No payment · No sign-up required</span>
            <h1 className="mt-5 text-4xl lg:text-5xl font-bold text-white mb-4">Free Online Courses</h1>
            <p className="mx-auto max-w-3xl text-xl leading-8 text-gray-300">Learn in-demand technology through clear tutorials, structured modules, and practical exercises.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-gray-300">
              <span className="flex items-center gap-2"><FaCheckCircle className="text-emerald-400" />Original learning content</span>
              <span className="flex items-center gap-2"><FaCheckCircle className="text-emerald-400" />Beginner-friendly paths</span>
              <span className="flex items-center gap-2"><FaCheckCircle className="text-emerald-400" />Hands-on practice</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-10 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-violet-600">Choose a learning path</p>
            <h2 className="mt-2 text-3xl font-black text-slate-900">Start learning today</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {freeCourses.map((course) => {
              const moduleCount = Number(course.module_count ?? course.modules.length);
              const lessonCount = Number(course.lesson_count ?? course.modules.reduce((total, module) => total + (module.lessons?.length || 0), 0));
              return (
              <motion.article
                key={course.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className={`h-36 bg-gradient-to-br ${course.color} flex items-center justify-center`}>
                  <span className="text-6xl transition-transform group-hover:scale-110" aria-hidden="true">{course.icon}</span>
                </div>
                <div className="p-6">
                  <div className="inline-block bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold mb-3">100% FREE</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{course.title}</h3>
                  <p className="min-h-20 text-sm leading-6 text-slate-600">{course.description}</p>
                  <div className="mt-5 flex flex-wrap gap-3 text-xs font-semibold text-slate-500">
                    <span className="flex items-center gap-1.5"><FaBookOpen className="text-violet-500" />{moduleCount} modules · {lessonCount} lessons</span>
                    <span className="flex items-center gap-1.5"><FaClock className="text-violet-500" />{course.duration}</span>
                  </div>
                  <Link to={`/free-courses/${course.slug}`} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-bold text-white transition hover:bg-violet-700">Start free course <FaArrowRight /></Link>
                </div>
              </motion.article>
            );})}
          </div>
        </div>
      </section>
    </>
  );
};

export default FreeCoursesPage;
