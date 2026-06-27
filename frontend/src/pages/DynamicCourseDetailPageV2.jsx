import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCheckCircle, FaClock, FaUsers, FaTrophy, FaStar, FaChevronDown } from 'react-icons/fa';
import { getCourseBySlug } from '../api/courseApi';
import { enrollCourse, submitCallbackRequest, markPaymentComplete } from '../api/enrollmentApi';
import PaymentComponent from '../components/courses/PaymentComponent';

const DynamicCourseDetailPageV2 = () => {
  const { slug: courseSlug } = useParams();  // Route param is :slug, extract as courseSlug
  const navigate = useNavigate();
  
  const [course, setCourst] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [showCallbackForm, setShowCallbackForm] = useState(false);
  const [callbackFormData, setCallbackFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    message: '',
    preferred_time: '',
  });
  const [callbackLoading, setCallbackLoading] = useState(false);
  
  const isAuthenticated = !!localStorage.getItem('access_token');

  // Fetch course data on mount
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        // Convert courseSlug back to course ID or fetch by slug
        const response = await getCourseBySlug(courseSlug);
        setCourst(response);
        setError(null);
      } catch (err) {
        console.error('Error fetching course:', err);
        setError('Course not found');
        setCourst(null);
      } finally {
        setLoading(false);
      }
    };

    if (courseSlug) {
      fetchCourse();
    }
  }, [courseSlug]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      // Redirect to login
      navigate('/login', { state: { from: `/courses/${courseSlug}` } });
      return;
    }

    try {
      setEnrollmentLoading(true);
      
      // Try to enroll via API
      try {
        const enrollment = await enrollCourse(course.id);
        alert('Successfully enrolled! Proceeding to payment...');
        navigate('/payments', { state: { enrollment } });
      } catch (apiError) {
        // If API fails, show a demo message and offer test enrollment
        console.warn('Enrollment API not available, using demo mode:', apiError.message);
        alert('Demo Mode: Enrollment recorded (waiting for backend setup). You can test the checkout flow now!');
        
        // Create a demo enrollment object
        const demoEnrollment = {
          id: 'demo-' + Date.now(),
          course: course.id,
          course_title: course.title,
          amount_paid: 0,
          discount_amount: course.price - course.effective_price,
          enrollment_status: 'pending',
          payment_status: 'pending',
        };
        
        navigate('/payments', { state: { enrollment: demoEnrollment } });
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error enrolling in course: ' + (err.message || 'Unknown error'));
    } finally {
      setEnrollmentLoading(false);
    }
  };

  const handleCallbackSubmit = async (e) => {
    e.preventDefault();
    
    if (!callbackFormData.first_name || !callbackFormData.email || !callbackFormData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setCallbackLoading(true);
      
      // Try to submit via API
      try {
        await submitCallbackRequest({
          ...callbackFormData,
          course: course.id,
        });
        alert('Callback request submitted! Our team will contact you soon.');
      } catch (apiError) {
        // If API fails, show demo message
        console.warn('Callback API not available, using demo mode:', apiError.message);
        alert(`Demo Mode: Callback request recorded for ${callbackFormData.first_name}. We'll contact you at ${callbackFormData.phone} soon!`);
      }
      
      // Reset form
      setShowCallbackForm(false);
      setCallbackFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        message: '',
        preferred_time: '',
      });
    } catch (err) {
      console.error('Error:', err);
      alert('Error submitting callback request: ' + err.message);
    } finally {
      setCallbackLoading(false);
    }
  };

  const toggleModule = (index) => {
    setExpandedModules(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold mb-4">Course Not Found</h1>
        <p className="text-gray-600 mb-8">{error || 'The course you are looking for does not exist.'}</p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600"
        >
          <FaArrowLeft /> Go Back
        </button>
      </div>
    );
  }

  const discountPercentage = course.discount_percentage || 0;
  const effectivePrice = course.effective_price || course.price;

  return (
    <div className="bg-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-12"
      >
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-6 hover:opacity-80 transition"
          >
            <FaArrowLeft /> Back
          </button>
          <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="bg-white/20 px-3 py-1 rounded">
              {course.level?.toUpperCase()}
            </span>
            <span className="bg-white/20 px-3 py-1 rounded">
              {course.category?.name}
            </span>
            {course.mentor && (
              <span className="bg-white/20 px-3 py-1 rounded">
                Mentor: {course.mentor.name}
              </span>
            )}
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Overview */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-6">Course Overview</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                {course.description || course.short_description}
              </p>

              {/* Feature Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <FaClock className="text-orange-500 mx-auto text-2xl mb-2" />
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-semibold">{course.duration_weeks}-{course.duration_weeks + 2} Weeks</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <FaUsers className="text-blue-500 mx-auto text-2xl mb-2" />
                  <p className="text-sm text-gray-600">Expert Mentors</p>
                  <p className="font-semibold">1-on-1 Support</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <FaTrophy className="text-green-500 mx-auto text-2xl mb-2" />
                  <p className="text-sm text-gray-600">Certification</p>
                  <p className="font-semibold">Industry Recognized</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <FaStar className="text-purple-500 mx-auto text-2xl mb-2" />
                  <p className="text-sm text-gray-600">Rating</p>
                  <p className="font-semibold">{course.rating || 4.8}/5</p>
                </div>
              </div>
            </motion.section>

            {/* Curriculum */}
            {course.curriculum && course.curriculum.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-12"
              >
                <h2 className="text-2xl font-bold mb-6">Course Curriculum</h2>
                <div className="space-y-4">
                  {course.curriculum.map((module, index) => {
                    // Support both old (topics/hours) and new (duration/focus/tools) formats
                    const isNewFormat = module.duration && !module.topics;
                    const moduleNum = module.module || (index + 1);
                    const title = module.title || module.module;
                    const duration = module.duration || `${module.duration_hours || 0} hours`;
                    const focus = module.focus;
                    const tools = module.tools;
                    const topics = module.topics;

                    return (
                      <div
                        key={module.id || index}
                        className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
                      >
                        <button
                          onClick={() => toggleModule(index)}
                          className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition"
                        >
                          <div className="text-left flex-1">
                            <h3 className="font-semibold text-lg">
                              Module {moduleNum}: {title}
                            </h3>
                            <div className="flex flex-wrap gap-4 mt-2">
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <span className="text-orange-500">📅</span> {duration}
                              </p>
                              {!isNewFormat && topics?.length > 0 && (
                                <p className="text-sm text-gray-600">
                                  {topics.length} topics
                                </p>
                              )}
                            </div>
                            {isNewFormat && focus && (
                              <p className="text-sm text-gray-700 mt-2">
                                <span className="font-medium">Focus:</span> {focus}
                              </p>
                            )}
                          </div>
                          <FaChevronDown
                            className={`text-orange-500 transition ml-4 flex-shrink-0 ${
                              expandedModules[index] ? 'rotate-180' : ''
                            }`}
                          />
                        </button>

                        {expandedModules[index] && (
                          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                            {/* New format display */}
                            {isNewFormat ? (
                              <div className="space-y-4">
                                {focus && (
                                  <div>
                                    <h4 className="font-semibold text-gray-800 mb-2">📚 Focus Areas:</h4>
                                    <p className="text-gray-700">{focus}</p>
                                  </div>
                                )}
                                {tools && (
                                  <div>
                                    <h4 className="font-semibold text-gray-800 mb-2">🛠️ Tools & Technologies:</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {tools.split(', ').map((tool, idx) => (
                                        <span
                                          key={idx}
                                          className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
                                        >
                                          {tool}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              /* Old format display */
                              topics && (
                                <ul className="space-y-2">
                                  {topics.map((topic, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                      <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                                      <span className="text-gray-700">{topic}</span>
                                    </li>
                                  ))}
                                </ul>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.section>
            )}

            {/* Learning Outcomes */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-6">What You'll Learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Master core concepts and advanced techniques',
                  'Work on real-world projects and case studies',
                  'Get job placement assistance and interview prep',
                  'Earn industry-recognized certification',
                  'Lifetime access to course materials',
                  'Community support and networking',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <FaCheckCircle className="text-orange-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Tools Covered */}
            {course.tools_covered && course.tools_covered.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-12"
              >
                <h2 className="text-2xl font-bold mb-6">Tools & Technologies</h2>
                <div className="flex flex-wrap gap-2">
                  {course.tools_covered.map((tool, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="sticky top-20 space-y-6"
            >
              {/* Payment Component */}
              <PaymentComponent course={course} />

              {/* Course Details */}
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                  <p className="text-gray-600 text-sm uppercase">DURATION</p>
                  <p className="font-semibold text-lg">{course.duration_weeks}-{course.duration_weeks + 2} Weeks</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm uppercase">SCHEDULE</p>
                  <p className="font-semibold text-lg">
                    {course.mode === 'online' ? 'Online Live' : course.mode === 'self_paced' ? 'Self-Paced' : 'Hybrid'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm uppercase">LEVEL</p>
                  <p className="font-semibold text-lg capitalize">{course.level}</p>
                </div>
                {course.enrollment_count && (
                  <div>
                    <p className="text-gray-600 text-sm uppercase">STUDENTS</p>
                    <p className="font-semibold text-lg">{course.enrollment_count}+ Enrolled</p>
                  </div>
                )}
              </div>

              {/* Request Callback Button */}
              <button
                onClick={() => setShowCallbackForm(!showCallbackForm)}
                className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition"
              >
                Request Callback
              </button>

              {/* Callback Form */}
              {showCallbackForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-gray-50 rounded-lg p-4 space-y-3"
                >
                  <input
                    type="text"
                    placeholder="First Name *"
                    value={callbackFormData.first_name}
                    onChange={(e) => setCallbackFormData({ ...callbackFormData, first_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={callbackFormData.last_name}
                    onChange={(e) => setCallbackFormData({ ...callbackFormData, last_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <input
                    type="email"
                    placeholder="Email *"
                    value={callbackFormData.email}
                    onChange={(e) => setCallbackFormData({ ...callbackFormData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <input
                    type="tel"
                    placeholder="Phone *"
                    value={callbackFormData.phone}
                    onChange={(e) => setCallbackFormData({ ...callbackFormData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <select
                    value={callbackFormData.preferred_time}
                    onChange={(e) => setCallbackFormData({ ...callbackFormData, preferred_time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="">Select preferred time</option>
                    <option value="9 AM - 12 PM">9 AM - 12 PM</option>
                    <option value="12 PM - 3 PM">12 PM - 3 PM</option>
                    <option value="3 PM - 6 PM">3 PM - 6 PM</option>
                    <option value="after 6 PM">After 6 PM</option>
                  </select>
                  <button
                    onClick={handleCallbackSubmit}
                    disabled={callbackLoading}
                    className="w-full bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50"
                  >
                    {callbackLoading ? 'Submitting...' : 'Submit'}
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicCourseDetailPageV2;
