import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { FaQuoteLeft } from 'react-icons/fa';
import StarRating from '../common/StarRating';

import 'swiper/css';
import 'swiper/css/pagination';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Emily Johnson',
    role: 'Data Analyst',
    company: 'Google',
    rating: 5,
    quote:
      'TrainerMentors completely transformed my career. The hands-on projects and mentorship helped me land my dream job within 3 months of completing the course.',
  },
  {
    id: 2,
    name: 'Mark Thompson',
    role: 'Cloud Engineer',
    company: 'Amazon',
    rating: 5,
    quote:
      'The AWS cloud course was incredibly comprehensive. The instructors are industry experts who made complex concepts easy to understand. Highly recommended!',
  },
  {
    id: 3,
    name: 'Sarah Lee',
    role: 'Full Stack Developer',
    company: 'Microsoft',
    rating: 4.5,
    quote:
      'I went from a complete beginner to a confident full-stack developer. The curriculum is well-structured and the placement support is outstanding.',
  },
];

const TestimonialSlider = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-900 via-dark-800 to-dark-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-secondary-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="text-center mb-14">
          <p className="text-secondary-400 font-semibold uppercase tracking-wider text-sm mb-2">
            Testimonials
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
            What Our Students Say
          </h2>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="pb-14"
        >
          {TESTIMONIALS.map((t) => (
            <SwiperSlide key={t.id}>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 h-full flex flex-col">
                <FaQuoteLeft className="text-secondary-400/30 text-3xl mb-4" />
                <p className="text-gray-300 leading-relaxed flex-1 mb-6">{t.quote}</p>
                <div className="mt-auto">
                  <StarRating rating={t.rating} />
                  <p className="text-white font-semibold mt-3">{t.name}</p>
                  <p className="text-gray-400 text-sm">
                    {t.role} at {t.company}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default TestimonialSlider;
