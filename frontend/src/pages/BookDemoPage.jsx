import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt, FaBook, FaMapPin, FaClock, FaCheckCircle } from 'react-icons/fa';
import { bookDemo } from '../api/leadApi';
import toast from 'react-hot-toast';

const demoSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  course_id: z.string().min(1, 'Please select a course'),
  mode: z.enum(['online', 'center'], { message: 'Please select online or center' }),
  timeline: z.enum(['urgent', 'planning'], { message: 'Please select your timeline' }),
  message: z.string().optional(),
});

const COURSES = [
  { id: 'python-data-science', name: 'Python for Data Science' },
  { id: 'react-mastery', name: 'React.js Mastery' },
  { id: 'full-stack-dev', name: 'Full-Stack Web Development' },
  { id: 'aws-cloud', name: 'Cloud Computing with AWS' },
  { id: 'ai-ml', name: 'AI & Machine Learning' },
  { id: 'devops', name: 'DevOps & Kubernetes' },
  { id: 'cybersecurity', name: 'Cybersecurity Mastery' },
  { id: 'sap', name: 'SAP Training' },
];

const BookDemoPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(demoSchema) });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await bookDemo(data);
      setBookingSuccess(true);
      reset();
      toast.success('Demo booking request submitted! We\'ll contact you soon.');
      
      // Reset success message after 3 seconds
      setTimeout(() => setBookingSuccess(false), 3000);
    } catch (error) {
      toast.error('Failed to book demo. Please try again.');
      console.error('Demo booking error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Book a Free Demo | TrainerMentors</title>
        <meta name="description" content="Book a free demo class with our expert instructors. Choose online or center-based classes." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header Section */}
        <motion.section
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16 px-4"
        >
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Book Your Free Demo</h1>
            <p className="text-xl text-primary-100">
              Experience our world-class training with a free demo session. Choose the course and mode that works best for you.
            </p>
          </div>
        </motion.section>

        {/* Main Content */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                {bookingSuccess ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-16"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FaCheckCircle className="text-4xl text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Demo Booking Confirmed!</h2>
                    <p className="text-gray-600 text-lg mb-6">
                      Thank you for your interest. Our team will contact you shortly to confirm the demo session.
                    </p>
                    <button
                      onClick={() => setBookingSuccess(false)}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Book Another Demo
                    </button>
                  </motion.div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Demo Details</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                        <input
                          type="text"
                          {...register('name')}
                          placeholder="John Doe"
                          className={`w-full px-4 py-3 rounded-lg border ${
                            errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                          } focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all`}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                        <input
                          type="email"
                          {...register('email')}
                          placeholder="john@example.com"
                          className={`w-full px-4 py-3 rounded-lg border ${
                            errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                          } focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all`}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                        <input
                          type="tel"
                          {...register('phone')}
                          placeholder="+91 98765 43210"
                          className={`w-full px-4 py-3 rounded-lg border ${
                            errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                          } focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all`}
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                      </div>

                      {/* Course Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Course *</label>
                        <select
                          {...register('course_id')}
                          className={`w-full px-4 py-3 rounded-lg border ${
                            errors.course_id ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                          } focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all`}
                        >
                          <option value="">-- Choose a Course --</option>
                          {COURSES.map((course) => (
                            <option key={course.id} value={course.id}>
                              {course.name}
                            </option>
                          ))}
                        </select>
                        {errors.course_id && <p className="text-red-500 text-xs mt-1">{errors.course_id.message}</p>}
                      </div>

                      {/* Mode Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Demo Mode *</label>
                        <div className="grid grid-cols-2 gap-4">
                          <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                            <input
                              type="radio"
                              value="online"
                              {...register('mode')}
                              className="w-5 h-5 text-primary-600"
                            />
                            <span className="ml-3 font-medium text-gray-700">Online</span>
                          </label>
                          <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                            <input
                              type="radio"
                              value="center"
                              {...register('mode')}
                              className="w-5 h-5 text-primary-600"
                            />
                            <span className="ml-3 font-medium text-gray-700">Center</span>
                          </label>
                        </div>
                        {errors.mode && <p className="text-red-500 text-xs mt-1">{errors.mode.message}</p>}
                      </div>

                      {/* Timeline Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Timeline *</label>
                        <div className="grid grid-cols-2 gap-4">
                          <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                            <input
                              type="radio"
                              value="urgent"
                              {...register('timeline')}
                              className="w-5 h-5 text-primary-600"
                            />
                            <span className="ml-3 font-medium text-gray-700">Urgent</span>
                          </label>
                          <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                            <input
                              type="radio"
                              value="planning"
                              {...register('timeline')}
                              className="w-5 h-5 text-primary-600"
                            />
                            <span className="ml-3 font-medium text-gray-700">Planning</span>
                          </label>
                        </div>
                        {errors.timeline && <p className="text-red-500 text-xs mt-1">{errors.timeline.message}</p>}
                      </div>

                      {/* Message (Optional) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Additional Message (Optional)</label>
                        <textarea
                          {...register('message')}
                          placeholder="Tell us about your learning goals..."
                          rows="4"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                        />
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                      >
                        {isLoading ? 'Booking Demo...' : 'Book Free Demo'}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>

            {/* Info Column */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Contact Info Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Us</h3>
                <div className="space-y-4">
                  <a
                    href="tel:+919999999999"
                    className="flex items-start gap-4 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <FaPhone className="text-white text-lg" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Call Us</p>
                      <p className="text-lg font-bold text-blue-600 group-hover:underline">+91 99999 99999</p>
                      <p className="text-xs text-gray-500 mt-1">Mon-Fri, 9 AM - 6 PM IST</p>
                    </div>
                  </a>

                  <a
                    href="mailto:info@trainermentors.com"
                    className="flex items-start gap-4 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <FaEnvelope className="text-white text-lg" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Email Us</p>
                      <p className="text-lg font-bold text-green-600 group-hover:underline break-all">info@trainermentors.com</p>
                      <p className="text-xs text-gray-500 mt-1">Response within 2 hours</p>
                    </div>
                  </a>

                  <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaMapMarkerAlt className="text-white text-lg" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Visit Us</p>
                      <p className="text-sm font-bold text-purple-600">Hyderabad, Telangana, India</p>
                      <p className="text-xs text-gray-500 mt-1">Multiple training centers</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">What You'll Get</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <FaCheckCircle className="text-green-600 text-lg flex-shrink-0" />
                    <span className="text-gray-700">One-on-one guidance</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheckCircle className="text-green-600 text-lg flex-shrink-0" />
                    <span className="text-gray-700">Live interaction with instructor</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheckCircle className="text-green-600 text-lg flex-shrink-0" />
                    <span className="text-gray-700">Course overview & roadmap</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheckCircle className="text-green-600 text-lg flex-shrink-0" />
                    <span className="text-gray-700">Special launch offers</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheckCircle className="text-green-600 text-lg flex-shrink-0" />
                    <span className="text-gray-700">Placement assistance info</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                {
                  q: 'How long is the demo session?',
                  a: 'Our demo sessions are typically 30-45 minutes long, which gives you enough time to understand the course and ask questions.'
                },
                {
                  q: 'Is the demo free?',
                  a: 'Yes, completely free! No credit card required. It\'s our way of showing you the quality of our training.'
                },
                {
                  q: 'Can I reschedule my demo?',
                  a: 'Absolutely! You can reschedule your demo anytime by contacting our team or through your account.'
                },
                {
                  q: 'What if I miss my demo?',
                  a: 'No worries! Just contact us and we\'ll schedule a new slot that works for you.'
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="font-bold text-gray-800 mb-2">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BookDemoPage;
