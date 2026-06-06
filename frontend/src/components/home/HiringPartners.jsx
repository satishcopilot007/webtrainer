import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

import 'swiper/css';

const PARTNERS = [
  'Google', 'Microsoft', 'Amazon', 'TCS',
  'Infosys', 'Wipro', 'Accenture', 'Deloitte',
];

const HiringPartners = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-secondary-500 font-semibold uppercase tracking-wider text-sm mb-2">
            Trusted by Industry Leaders
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-dark-800">
            Our Hiring Partners
          </h2>
        </div>

        <Swiper
          modules={[Autoplay]}
          spaceBetween={40}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 6 },
          }}
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          loop
          className="py-4"
        >
          {PARTNERS.map((name) => (
            <SwiperSlide key={name}>
              <div className="flex items-center justify-center h-20 px-6 rounded-xl border border-gray-100 bg-gray-50 hover:shadow-md transition-shadow">
                <span className="text-lg font-bold text-gray-400 select-none tracking-wide">
                  {name}
                </span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default HiringPartners;
