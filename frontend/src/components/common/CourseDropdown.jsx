import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronRight, FaImage } from 'react-icons/fa';
import { COURSE_CATEGORIES } from '../../utils/constants';
import { generateSlug } from '../../utils/courseUtils';

const CourseDropdown = ({ categorySlug, dropdownType, scrolled }) => {
  const category = COURSE_CATEGORIES.find(c => c.slug === categorySlug);
  
  if (!category) return null;

  // Simple list layout for Job Oriented and Corporate courses
  if (dropdownType === 'simple') {
    return (
      <div className="w-full min-w-max bg-white shadow-2xl rounded-lg p-8 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">{category.name}</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {category.courses.map((course) => {
            const courseSlug = generateSlug(course.name);
            return (
              <Link
                key={course.id}
                to={`/courses/${courseSlug}`}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-orange-50 transition-colors cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-lg bg-gray-200 flex-shrink-0 flex items-center justify-center text-lg">
                  {course.icon || '📚'}
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-orange-600 transition-colors truncate">
                    {course.name}
                  </p>
                </div>
                <FaChevronRight className="text-gray-400 group-hover:text-orange-500 transition-colors flex-shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  // Two-column layout for IT and Non-IT courses
  if (dropdownType === 'twoColumn' && category.domains) {
    const [activeDomain, setActiveDomain] = useState(null);
    
    return (
      <div className="bg-white shadow-2xl rounded-lg overflow-hidden border border-gray-100">
        <div className="grid grid-cols-2 gap-0">
          {/* Left Column - Domains */}
          <div className="bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 p-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Domains</h3>
            <div className="space-y-2">
              {category.domains.map((domain, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveDomain(activeDomain === idx ? null : idx)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-lg transition-all cursor-pointer group text-left"
                >
                  <span className="text-lg text-white">{domain.icon}</span>
                  <p className="text-sm font-semibold text-white group-hover:text-orange-50">
                    {domain.name}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Courses */}
          <div className="bg-white p-6 max-h-96 overflow-y-auto">
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Courses</h3>
            <div className="space-y-3">
              {category.domains.map((domain, domainIdx) =>
                domain.courses.map((course) => {
                  const courseSlug = generateSlug(course.name);
                  return (
                    <Link
                      key={`${domainIdx}-${course.id}`}
                      to={`/courses/${courseSlug}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                    >
                      <div className="flex-grow">
                        <p className="text-sm font-medium text-gray-800 group-hover:text-orange-600 transition-colors">
                          {course.name}
                        </p>
                      </div>
                      <FaChevronRight className="text-gray-300 group-hover:text-orange-500 transition-colors flex-shrink-0" />
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default CourseDropdown;
