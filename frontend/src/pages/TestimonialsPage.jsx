import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Emily Johnson',
    title: 'Data Analyst at Google',
    course: 'Python for Data Science',
    rating: 5,
    text: 'TrainerMentors completely transformed my career. The hands-on projects and mentorship helped me land my dream job within 3 months. Highly recommended!',
    image: 'https://via.placeholder.com/150?text=Emily',
  },
  {
    id: 2,
    name: 'Mark Thompson',
    title: 'Cloud Engineer at Amazon',
    course: 'AWS Cloud Computing',
    rating: 5,
    text: 'The AWS cloud course was incredibly comprehensive. The instructors are industry experts who made complex concepts easy to understand. Best investment ever!',
    image: 'https://via.placeholder.com/150?text=Mark',
  },
  {
    id: 3,
    name: 'Sarah Lee',
    title: 'Full Stack Developer at Microsoft',
    course: 'Full Stack Development',
    rating: 5,
    text: 'I went from a complete beginner to a confident full-stack developer. The curriculum is well-structured and the placement support is outstanding.',
    image: 'https://via.placeholder.com/150?text=Sarah',
  },
  {
    id: 4,
    name: 'Vikram Singh',
    title: 'Senior Developer at Goldman Sachs',
    course: 'Node.js Backend Development',
    rating: 5,
    text: 'The practical approach to teaching and real-world projects made all the difference. I felt prepared for interviews and the job market. Thank you!',
    image: 'https://via.placeholder.com/150?text=Vikram',
  },
  {
    id: 5,
    name: 'Priya Sharma',
    title: 'ML Engineer at Meta',
    course: 'AI & Machine Learning',
    rating: 5,
    text: 'Exceptional course material and mentorship. The portfolio projects I built are now my greatest asset. Landed my dream job thanks to TrainerMentors!',
    image: 'https://via.placeholder.com/150?text=Priya',
  },
  {
    id: 6,
    name: 'Amit Patel',
    title: 'Database Administrator at Cisco',
    course: 'Data Engineering',
    rating: 5,
    text: 'The data engineering course was thorough and practical. Real database scenarios and optimization techniques were incredibly valuable. 5/5 stars!',
    image: 'https://via.placeholder.com/150?text=Amit',
  },
];

const TestimonialsPage = () => {
  return (
    <>
      <Helmet>
        <title>Student Testimonials | TrainerMentors</title>
        <meta name="description" content="Read testimonials from successful students who transformed their careers with TrainerMentors training programs." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[400px] bg-gradient-to-r from-primary-600 to-secondary-600 text-white overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6">
              What Our Students Say
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Real stories from real students who transformed their careers with TrainerMentors
            </p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow"
              >
                {/* Rating */}
                <div className="flex space-x-1 mb-4">
                  {Array(testimonial.rating)
                    .fill(0)
                    .map((_, i) => (
                      <FaStar key={i} className="text-yellow-400" />
                    ))}
                </div>

                {/* Text */}
                <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>

                {/* Student Info */}
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 bg-gray-200"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-primary-600">{testimonial.title}</p>
                    <p className="text-xs text-gray-500">{testimonial.course}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: '4.9/5', label: 'Average Rating' },
              { number: '95%', label: 'Student Satisfaction' },
              { number: '15,000+', label: 'Success Stories' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 bg-gray-50 rounded-lg"
              >
                <div className="text-4xl font-extrabold text-primary-600 mb-2">{stat.number}</div>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Be Part of Our Success Stories</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of successful graduates and create your own success story with TrainerMentors
          </p>
          <a
            href="/courses"
            className="inline-block px-8 py-4 bg-white text-primary-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Start Your Journey
          </a>
        </div>
      </section>
    </>
  );
};

export default TestimonialsPage;
