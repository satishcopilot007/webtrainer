import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaRocket } from 'react-icons/fa';
import HeroSection from '../components/home/HeroSection';
import StatsCounter from '../components/home/StatsCounter';
import FeaturedCourses from '../components/home/FeaturedCourses';
import CategoryGrid from '../components/home/CategoryGrid';
import TestimonialSlider from '../components/home/TestimonialSlider';
import HiringPartners from '../components/home/HiringPartners';
import AlumniSection from '../components/common/AlumniSection';
import WhyChooseSection from '../components/common/WhyChooseSection';
import GoogleRatings from '../components/common/GoogleRatings';
import EmployerCarousel from '../components/common/EmployerCarousel';
import EnhancedTestimonials from '../components/home/EnhancedTestimonials';
import SuccessStories from '../components/home/SuccessStories';
import BlogListing from '../components/blog/BlogListing';
import StickyFooterCTA from '../components/common/StickyFooterCTA';
import useUIStore from '../store/useUIStore';
import { SITE_NAME, SITE_TAGLINE } from '../utils/constants';

const HomePage = () => {
  const openDemoModal = useUIStore((s) => s.openDemoModal);

  return (
    <>
      <Helmet>
        <title>TrainerMentors - Best Online Training Institute | Expert Trainers & Mentors | 900+ Courses</title>
        <meta name="description" content="TrainerMentors is India's #1 online training and mentorship platform. 900+ courses in AI, Cloud, Programming, SAP, Data Science with expert trainers and mentors. Get 1:1 mentorship, placement assistance, and globally recognized certification. Join 15,000+ successful learners." />
        <meta name="keywords" content="trainer, mentor, training, mentors, trainers, online training, corporate training, IT training, TrainerMentors, trainer mentors, best training institute, training courses, mentorship programs, tech training, AI training, cloud training, programming courses, SAP training, data science training, placement training, online courses India, best online trainer, mentor for career, professional training" />
        <meta property="og:title" content="TrainerMentors - Best Online Training Institute | Expert Trainers & Mentors" />
        <meta property="og:description" content="900+ expert-led training courses with 1:1 mentorship. AI, Cloud, Programming, SAP & more. Join thousands of successful learners at TrainerMentors." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://trainermentors.com/" />
        <meta property="og:site_name" content="TrainerMentors" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TrainerMentors - Best Online Training & Mentorship Platform" />
        <meta name="twitter:description" content="900+ expert-led courses. AI, Cloud, SAP, Programming. 1:1 mentorship + placement assistance." />
        <link rel="canonical" href="https://trainermentors.com/" />
      </Helmet>

      <div className="bg-[#0d1117] text-[#f0f6fc]">
      <HeroSection />

      <StatsCounter />

      {/* Google Ratings Banner */}
      <section className="flex justify-center border-y border-[#254777] bg-gradient-to-br from-[#071b35] via-[#0b2f66] to-[#000240] py-8">
        <GoogleRatings />
      </section>

      <FeaturedCourses />

      {/* Employer Carousel */}
      <EmployerCarousel />

      <CategoryGrid />

      {/* Enhanced Testimonials */}
      <EnhancedTestimonials />

      <TestimonialSlider />

      {/* Success Stories */}
      <SuccessStories />

      <HiringPartners />

      <WhyChooseSection />

      <AlumniSection />

      {/* Blog Listing */}
      <BlogListing limit={6} />

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#010409] via-[#0d1117] to-[#010409]" />
        <div className="absolute left-1/2 top-0 h-80 w-[48rem] -translate-x-1/2 rounded-full bg-[#1f6feb]/20 blur-3xl" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-30" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-4xl mx-auto px-4 text-center"
        >
          <FaRocket className="text-5xl text-white/80 mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Start Your Skill Development Journey Today
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join 15,000+ students who have transformed their careers with industry-expert mentorship,
            hands-on projects, and guaranteed placement support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={openDemoModal}
              className="rounded-full bg-[#f0f6fc] px-8 py-4 text-lg font-bold text-[#0d1117] shadow-lg transition-colors hover:bg-white"
            >
              Book Free Demo
            </button>
            <a
              href="/courses"
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-colors text-lg"
            >
              Explore Courses
            </a>
          </div>
        </motion.div>
      </section>

      {/* Sticky Footer CTA */}
      <StickyFooterCTA />
      </div>
    </>
  );
};

export default HomePage;
