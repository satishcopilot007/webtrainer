import { motion } from 'framer-motion';
import { FaArrowUp, FaStar, FaAward } from 'react-icons/fa';
import { SUCCESS_STORIES } from '../../utils/constants';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const SuccessStories = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <FaAward className="text-orange-400 text-2xl" />
            <span className="text-orange-400 font-semibold">Success Stories</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Real Students, Real Results
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            See how our students transformed their careers and achieved their dreams
          </p>
        </motion.div>

        {/* Stories Carousel */}
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
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          className="pb-12"
        >
          {SUCCESS_STORIES.map((story) => (
            <SwiperSlide key={story.id}>
              <motion.div
                whileHover={{ y: -8 }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-orange-400/30 hover:border-orange-400/60 transition-all duration-300 h-full"
              >
                {/* Top - Student Info */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-center">
                  <div className="text-5xl mb-3">{story.studentPhoto}</div>
                  <h3 className="text-2xl font-bold">{story.studentName}</h3>
                  <p className="text-orange-100 text-sm mt-1">{story.company}</p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Course */}
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Course Completed</p>
                    <p className="font-semibold text-white">{story.course}</p>
                    <p className="text-xs text-orange-300">{story.duration}</p>
                  </div>

                  {/* Journey */}
                  <div className="space-y-3">
                    {/* Before */}
                    <div>
                      <p className="text-xs text-gray-400 mb-2">Previous Position</p>
                      <p className="text-sm font-semibold text-white">{story.previousRole}</p>
                      <p className="text-sm text-red-400">{story.previousSalary}</p>
                    </div>

                    {/* Arrow */}
                    <div className="flex justify-center">
                      <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-green-500/20 px-3 py-2 rounded-full border border-orange-400/50">
                        <FaArrowUp className="text-green-400 text-lg" />
                        <span className="font-bold text-green-400">{story.improvement}</span>
                      </div>
                    </div>

                    {/* After */}
                    <div>
                      <p className="text-xs text-gray-400 mb-2">Current Position</p>
                      <p className="text-sm font-semibold text-white">{story.currentRole}</p>
                      <p className="text-lg font-bold text-green-400">{story.currentSalary}</p>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="pt-4 border-t border-gray-700">
                    <p className="text-sm font-semibold text-orange-300 italic">
                      "{story.title}"
                    </p>
                  </div>

                  {/* Stars */}
                  <div className="flex justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400" size={14} />
                    ))}
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a
            href="/careers"
            className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-10 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Start Your Success Story Today
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default SuccessStories;
