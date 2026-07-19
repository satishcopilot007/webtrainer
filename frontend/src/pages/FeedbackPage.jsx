import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getFeedbackCourseOptions, submitPublicFeedback } from '../api/feedbackApi';

const initialForm = { name: '', email: '', role: '', other_role: '', course_id: '', rating: 0, message: '', website: '' };

const FeedbackPage = () => {
  const [form, setForm] = useState(initialForm);
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    getFeedbackCourseOptions()
      .then((response) => {
        if (!active) return;
        setCourses(Array.isArray(response.data.data) ? response.data.data : []);
        setCoursesError('');
      })
      .catch(() => {
        if (!active) return;
        setCoursesError('Unable to load courses. Please refresh and try again.');
      })
      .finally(() => active && setCoursesLoading(false));
    return () => { active = false; };
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    if (form.role === 'other' && !form.other_role.trim()) {
      toast.error('Please enter your role');
      return;
    }
    if (!form.rating) {
      toast.error('Please select a rating');
      return;
    }

    setSubmitting(true);
    try {
      const response = await submitPublicFeedback({
        ...form,
        role: form.role === 'other' ? form.other_role.trim() : form.role,
        other_role: undefined,
        course_id: Number(form.course_id),
        rating: Number(form.rating),
      });
      toast.success(response.data.message || 'Thank you for your feedback');
      setForm({ ...initialForm });
    } catch (error) {
      const errors = error.response?.data?.errors;
      const detail = errors && typeof errors === 'object' ? Object.values(errors).flat()[0] : null;
      toast.error(detail || error.response?.data?.message || 'Unable to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Feedback | TrainerMentors</title>
        <meta name="description" content="Share your feedback to help us improve" />
      </Helmet>

      <section className="pt-32 pb-16 bg-gradient-to-br from-blue-900 via-dark-800 to-dark-900">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="text-6xl mb-4">💬</div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">We Value Your Feedback</h1>
            <p className="text-xl text-gray-300">Help us improve our learning experience</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-dark-900">
        <div className="max-w-2xl mx-auto px-6">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            onSubmit={submit}
            className="bg-gradient-to-br from-dark-800 to-dark-700 rounded-2xl p-8 shadow-2xl"
          >
            <div className="mb-6">
              <label className="block text-white font-semibold mb-2">Your Name</label>
              <input
                type="text"
                required
                minLength={2}
                maxLength={255}
                autoComplete="name"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className="w-full px-4 py-3 bg-dark-600 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                placeholder="Enter your name"
              />
            </div>

            <div className="mb-6">
              <label className="block text-white font-semibold mb-2">Email Address</label>
              <input
                type="email"
                required
                maxLength={255}
                autoComplete="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                className="w-full px-4 py-3 bg-dark-600 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-6">
              <label className="block text-white font-semibold mb-2" htmlFor="feedback-role">I am</label>
              <select
                id="feedback-role"
                required
                value={form.role}
                onChange={(event) => setForm({ ...form, role: event.target.value, other_role: '' })}
                className="w-full px-4 py-3 bg-dark-600 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
              >
                <option value="">Select your role</option>
                <option value="student">Student</option>
                <option value="trainer">Trainer</option>
                <option value="job support">Job Support</option>
                <option value="other">Other</option>
              </select>
            </div>

            {form.role === 'other' && (
              <div className="mb-6">
                <label className="block text-white font-semibold mb-2" htmlFor="feedback-other-role">Other Role</label>
                <input
                  id="feedback-other-role"
                  type="text"
                  required
                  minLength={2}
                  maxLength={100}
                  value={form.other_role}
                  onChange={(event) => setForm({ ...form, other_role: event.target.value })}
                  className="w-full px-4 py-3 bg-dark-600 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="Enter your role"
                />
              </div>
            )}

            <div className="mb-6">
              <label className="block text-white font-semibold mb-2">Course/Program</label>
              <select
                required
                disabled={coursesLoading || Boolean(coursesError)}
                value={form.course_id}
                onChange={(event) => setForm({ ...form, course_id: event.target.value })}
                className="w-full px-4 py-3 bg-dark-600 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">{coursesLoading ? 'Loading all courses…' : 'Select a course'}</option>
                {courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
              </select>
              {coursesError && <p role="alert" className="mt-2 text-sm text-red-300">{coursesError}</p>}
              {!coursesLoading && !coursesError && <p className="mt-2 text-xs text-gray-400">{courses.length.toLocaleString('en-IN')} active courses available</p>}
            </div>

            <div className="mb-6">
              <label className="block text-white font-semibold mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setForm({ ...form, rating: star })}
                    aria-label={`Rate ${star} out of 5`}
                    aria-pressed={form.rating === star}
                    className={`text-3xl transition ${star <= form.rating ? 'text-yellow-400' : 'text-gray-500 hover:text-yellow-300'}`}
                  >
                    <FaStar />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-white font-semibold mb-2">Your Feedback</label>
              <textarea
                required
                minLength={10}
                maxLength={20000}
                value={form.message}
                onChange={(event) => setForm({ ...form, message: event.target.value })}
                className="w-full px-4 py-3 bg-dark-600 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500 h-32"
                placeholder="Share your thoughts and suggestions..."
              />
            </div>

            <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
              <label>Website<input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} /></label>
            </div>

            <button
              type="submit"
              disabled={submitting || coursesLoading || Boolean(coursesError)}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Submitting…' : 'Submit Feedback'}
            </button>
          </motion.form>
        </div>
      </section>
    </>
  );
};

export default FeedbackPage;
