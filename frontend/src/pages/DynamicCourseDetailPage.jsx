import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaStar, FaClock, FaUsers, FaCertificate, FaArrowLeft, FaPlay } from 'react-icons/fa';
import { COURSE_CATEGORIES } from '../utils/constants';
import { findCourseBySlug } from '../utils/courseUtils';

const DynamicCourseDetailPage = () => {
  const { courseSlug } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find the course by slug
    const foundCourse = findCourseBySlug(courseSlug, COURSE_CATEGORIES);
    setCourse(foundCourse);
    setLoading(false);
  }, [courseSlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <p className="text-gray-600 mb-6">The course you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/courses')}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const levelColors = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <button
            onClick={() => navigate('/courses')}
            className="flex items-center gap-2 mb-6 text-gray-300 hover:text-white transition-colors"
          >
            <FaArrowLeft className="text-lg" />
            <span>Back to Courses</span>
          </button>
          <h1 className="text-4xl font-bold mb-4">{course.name}</h1>
          <div className="flex flex-wrap gap-4 items-center">
            {course.level && (
              <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${levelColors[course.level]}`}>
                {course.level.charAt(0).toUpperCase() + course.level.slice(1)} Level
              </span>
            )}
            {course.category && (
              <span className="text-gray-300">Category: {course.category}</span>
            )}
            {course.domain && (
              <span className="text-gray-300">Domain: {course.domain}</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Course Details */}
          <div className="lg:col-span-2">
            {/* Course Overview */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Overview</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Master {course.name} with our comprehensive, industry-focused curriculum. This course is designed to equip you with practical skills and real-world knowledge.
              </p>

              {/* Key Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="flex gap-4">
                  <div className="text-orange-500 text-2xl mt-1">
                    <FaClock />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Duration</h3>
                    <p className="text-gray-600">4-6 Months</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-orange-500 text-2xl mt-1">
                    <FaUsers />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Expert Mentors</h3>
                    <p className="text-gray-600">Industry experienced trainers</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-orange-500 text-2xl mt-1">
                    <FaCertificate />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Certification</h3>
                    <p className="text-gray-600">Industry-recognized certificate</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-orange-500 text-2xl mt-1">
                    <FaStar />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Rating</h3>
                    <p className="text-gray-600">4.8/5 (500+ reviews)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Curriculum */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Curriculum</h2>
              <div className="space-y-4">
                {[
                  { title: 'Module 1: Foundations', duration: '2 weeks', lessons: 12 },
                  { title: 'Module 2: Core Concepts', duration: '2 weeks', lessons: 15 },
                  { title: 'Module 3: Advanced Topics', duration: '1 week', lessons: 10 },
                  { title: 'Module 4: Real-World Projects', duration: '1 week', lessons: 8 },
                ].map((module, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-lg p-4 hover:border-orange-500 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">{module.title}</h3>
                        <p className="text-sm text-gray-600">
                          {module.lessons} lessons • {module.duration}
                        </p>
                      </div>
                      <FaPlay className="text-orange-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Outcomes */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What You'll Learn</h2>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-orange-500 font-bold">✓</span>
                  <span className="text-gray-700">Master the core concepts and industry best practices</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-orange-500 font-bold">✓</span>
                  <span className="text-gray-700">Build real-world projects with hands-on experience</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-orange-500 font-bold">✓</span>
                  <span className="text-gray-700">Get interview preparation and placement support</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-orange-500 font-bold">✓</span>
                  <span className="text-gray-700">Obtain industry-recognized certification</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-orange-500 font-bold">✓</span>
                  <span className="text-gray-700">Access lifetime course materials and updates</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div>
            {/* Course Card */}
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <div className="mb-6">
                <div className="w-full h-48 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-6xl">{course.icon || '📚'}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">{course.name}</h3>
              </div>

              {/* Pricing */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-orange-600">₹25,000</span>
                  <span className="text-lg text-gray-500 line-through">₹40,000</span>
                </div>
                <p className="text-sm text-green-600 font-semibold">37% OFF - Limited Time</p>
              </div>

              {/* Enroll Button */}
              <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all mb-4">
                Enroll Now
              </button>

              {/* Info Items */}
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Duration</p>
                  <p className="text-gray-700">4-6 Months</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Schedule</p>
                  <p className="text-gray-700">Flexible | Weekend & Weekday</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Mode</p>
                  <p className="text-gray-700">Online & Offline</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Level</p>
                  <p className="text-gray-700 capitalize">{course.level || 'Beginner'}</p>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-600 mb-3">Have Questions?</p>
                <button className="w-full border-2 border-orange-500 text-orange-600 font-bold py-2 rounded-lg hover:bg-orange-50 transition-colors">
                  Request Callback
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicCourseDetailPage;
