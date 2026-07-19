import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { bookDemo } from '../../api/leadApi';
import { getFeedbackCourseOptions } from '../../api/feedbackApi';
import useUIStore from '../../store/useUIStore';
import useAuthStore from '../../store/useAuthStore';
import toast from 'react-hot-toast';

const demoSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number').max(15),
  course_id: z.string().min(1, 'Please select a course'),
  mode: z.enum(['online', 'classroom', 'hybrid'], { required_error: 'Please select a learning mode' }),
  preferred_date: z.string().min(1, 'Please select a preferred date'),
  message: z.string().optional(),
});

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.15 } },
};

const DemoBookingForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [coursesError, setCoursesError] = useState('');
  const { isDemoModalOpen, closeDemoModal } = useUIStore();
  const { user, isAuthenticated, fetchProfile } = useAuthStore();

  useEffect(() => {
    if (!isDemoModalOpen || courses.length > 0) return;
    let active = true;
    setCoursesLoading(true);
    getFeedbackCourseOptions()
      .then((response) => {
        if (!active) return;
        setCourses(Array.isArray(response.data?.data) ? response.data.data : []);
        setCoursesError('');
      })
      .catch(() => active && setCoursesError('Unable to load courses. Please try again.'))
      .finally(() => active && setCoursesLoading(false));
    return () => { active = false; };
  }, [isDemoModalOpen, courses.length]);

  useEffect(() => {
    if (isDemoModalOpen && isAuthenticated && !user) fetchProfile();
  }, [fetchProfile, isAuthenticated, isDemoModalOpen, user]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(demoSchema),
    defaultValues: { name: '', email: '', phone: '', course_id: '', mode: 'online', preferred_date: '', message: '' },
  });

  useEffect(() => {
    if (!isDemoModalOpen) return;
    reset({
      name: [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      course_id: '',
      mode: 'online',
      preferred_date: '',
      message: '',
    });
  }, [isDemoModalOpen, reset, user]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await bookDemo({ ...data, timeline: data.preferred_date });
      toast.success('Free session booked successfully! We will contact you shortly.');
      reset();
      closeDemoModal();
    } catch {
      toast.error('Failed to book demo. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) closeDemoModal();
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors ${
      errors[field] ? 'border-red-400' : 'border-gray-200'
    }`;

  // Get minimum date (tomorrow)
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  return (
    <AnimatePresence>
      {isDemoModalOpen && (
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={handleBackdropClick}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="font-display text-xl font-bold text-dark-800">Book a Free Session</h2>
                <p className="text-sm text-gray-500">Choose any course and provide your contact details</p>
              </div>
              <button
                onClick={closeDemoModal}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <FaTimes size={14} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" placeholder="John Doe" className={inputClass('name')} {...register('name')} />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" placeholder="john@example.com" className={inputClass('email')} {...register('email')} />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="tel" placeholder="+91 9876543210" className={inputClass('phone')} {...register('phone')} />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Course dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Choose Course</label>
                  <select disabled={coursesLoading} className={inputClass('course_id')} {...register('course_id')}>
                    <option value="">{coursesLoading ? 'Loading courses…' : 'Select any course'}</option>
                    {courses.map((c) => (
                      <option key={c.id || c.slug} value={String(c.id || c.slug)}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                  {errors.course_id && <p className="text-red-500 text-xs mt-1">{errors.course_id.message}</p>}
                  {coursesError && <p className="text-red-500 text-xs mt-1">{coursesError}</p>}
                </div>

                {/* Preferred date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                  <input type="date" min={minDateStr} className={inputClass('preferred_date')} {...register('preferred_date')} />
                  {errors.preferred_date && <p className="text-red-500 text-xs mt-1">{errors.preferred_date.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Learning Mode</label>
                <select className={inputClass('mode')} {...register('mode')}>
                  <option value="online">Online</option>
                  <option value="classroom">Classroom / Center</option>
                  <option value="hybrid">Hybrid</option>
                </select>
                {errors.mode && <p className="text-red-500 text-xs mt-1">{errors.mode.message}</p>}
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
                <textarea rows={3} placeholder="Any specific topics you'd like to cover?" className={inputClass('message')} {...register('message')} />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-primary-500/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Booking...
                  </>
                ) : (
                  'Book Free Session'
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DemoBookingForm;
