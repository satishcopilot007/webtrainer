import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import { FaStar, FaCheckCircle } from 'react-icons/fa';
import { TESTIMONIALS } from '../../utils/constants';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const EnhancedTestimonials = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-slate-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our Students Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of successful students who have transformed their careers with TrainerMentors
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          className="pb-12"
        >
          {TESTIMONIALS.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <motion.div
                whileHover={{ y: -8 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full"
              >
                {/* Top Section - Student Info */}
                <div className="bg-gradient-to-r from-orange-400 to-orange-600 p-6 text-center text-white">
                  <div className="text-5xl mb-3">{testimonial.photo}</div>
                  <h3 className="text-xl font-bold">{testimonial.name}</h3>
                  <p className="text-orange-100 text-sm">{testimonial.company}</p>
                  {testimonial.verified && (
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <FaCheckCircle className="text-white" size={14} />
                      <span className="text-xs">Verified Graduate</span>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-6">
                  {/* Current Role & Salary */}
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <p className="text-xs text-gray-600">Current Position</p>
                    <p className="font-bold text-gray-800 text-sm">{testimonial.role}</p>
                    <p className="text-orange-600 font-bold text-lg">{testimonial.salary}</p>
                  </div>

                  {/* Course */}
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <p className="text-xs text-gray-600">Course Completed</p>
                    <p className="font-semibold text-gray-800 text-sm">{testimonial.course}</p>
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400" size={16} />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-gray-700 text-sm leading-relaxed italic">
                    "{testimonial.testimonial}"
                  </p>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 bg-white rounded-xl p-8 shadow-lg"
        >
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600">{TESTIMONIALS.length}+</p>
            <p className="text-gray-600">Success Stories</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600">4.9/5</p>
            <p className="text-gray-600">Average Rating</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600">100%</p>
            <p className="text-gray-600">Verified Graduates</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EnhancedTestimonials;
