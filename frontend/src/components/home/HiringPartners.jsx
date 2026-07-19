import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

import 'swiper/css';

const PARTNERS = [
  'Google', 'Microsoft', 'Amazon', 'TCS',
  'Infosys', 'Wipro', 'Accenture', 'Deloitte',
];

const HiringPartners = () => {
  return (
    <section className="border-b border-[#21262d] bg-gradient-to-br from-[#010409] via-[#0d1117] to-[#010409] py-16">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-secondary-500 font-semibold uppercase tracking-wider text-sm mb-2">
            Trusted by Industry Leaders
          </p>
          <h2 className="font-display text-3xl font-bold text-[#f0f6fc] md:text-4xl">
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
              <div className="flex h-20 items-center justify-center rounded-xl border border-[#30363d] bg-[#161b22] px-6 transition-all hover:border-[#58a6ff]/60 hover:shadow-md">
                <span className="select-none text-lg font-bold tracking-wide text-[#8b949e]">
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
