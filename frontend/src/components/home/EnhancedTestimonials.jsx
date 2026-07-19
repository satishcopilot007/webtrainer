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
    <section className="border-b border-[#254777] bg-gradient-to-br from-[#071b35] via-[#0b2f66] to-[#000240] py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="mb-4 text-4xl font-bold text-[#f0f6fc] md:text-5xl">
            What Our Students Say
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-[#8b949e]">
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
                className="h-full overflow-hidden rounded-xl border border-[#30363d] bg-[#161b22] shadow-lg shadow-black/20 transition-all duration-300 hover:border-[#58a6ff]/60 hover:shadow-2xl"
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
                  <div className="mb-4 border-b border-[#30363d] pb-4">
                    <p className="text-xs text-[#8b949e]">Current Position</p>
                    <p className="text-sm font-bold text-[#f0f6fc]">{testimonial.role}</p>
                    <p className="text-orange-600 font-bold text-lg">{testimonial.salary}</p>
                  </div>

                  {/* Course */}
                  <div className="mb-4 border-b border-[#30363d] pb-4">
                    <p className="text-xs text-[#8b949e]">Course Completed</p>
                    <p className="text-sm font-semibold text-[#f0f6fc]">{testimonial.course}</p>
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400" size={16} />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-sm italic leading-relaxed text-[#c9d1d9]">
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
          className="mt-12 grid grid-cols-1 gap-6 rounded-xl border border-[#30363d] bg-[#161b22] p-8 shadow-lg shadow-black/20 md:grid-cols-3"
        >
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600">{TESTIMONIALS.length}+</p>
            <p className="text-[#8b949e]">Success Stories</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600">4.9/5</p>
            <p className="text-[#8b949e]">Average Rating</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600">100%</p>
            <p className="text-[#8b949e]">Verified Graduates</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EnhancedTestimonials;
