import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaUsers, FaChartLine, FaTrophy, FaHandshake, FaAward, FaLaptop, FaBook, FaGraduationCap, FaPhone, FaEnvelope, FaMapMarkerAlt, FaChevronDown, FaExternalLinkAlt } from 'react-icons/fa';
import { useState } from 'react';
import { CORPORATE_COHORTS } from '../data/corporateCohorts';

const CorporatePage = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const whyCorporateTraining = [
    { title: 'Skill Enhancement', desc: 'Upskill employees with industry-relevant competencies' },
    { title: 'Increased Productivity', desc: 'Boost team efficiency and performance metrics' },
    { title: 'Employee Retention', desc: 'Invest in growth to retain top talent' },
    { title: 'Cost-Effective', desc: 'Reduce hiring costs through internal training' },
    { title: 'Digital Transformation', desc: 'Navigate modern business challenges' },
    { title: 'Competitive Advantage', desc: 'Stay ahead with cutting-edge skills' },
  ];

  const services = [
    { icon: '🎯', title: 'Customized Training Programs', desc: 'Tailored courses based on your organizational needs' },
    { icon: '📈', title: 'Performance Analytics', desc: 'Track progress and measure training ROI' },
    { icon: '👥', title: 'On-Site Training', desc: 'Conduct training at your premises' },
    { icon: '🌐', title: 'Online & Blended Programs', desc: 'Flexible learning options for distributed teams' },
    { icon: '📊', title: 'Skill Assessment', desc: 'Evaluate current skill gaps and proficiencies' },
    { icon: '🏆', title: 'Certification Programs', desc: 'Industry-recognized certifications for employees' },
  ];

  const industries = [
    'Finance & Banking',
    'IT & Software',
    'Healthcare',
    'Retail & E-Commerce',
    'Manufacturing',
    'Hospitality',
    'Education',
    'Logistics & Supply Chain',
    'Insurance',
    'Telecom',
  ];

  const benefits = [
    { icon: <FaTrophy className="text-2xl text-orange-500" />, title: 'Industry-Recognized Certifications' },
    { icon: <FaUsers className="text-2xl text-blue-500" />, title: 'Expert Instructors with Real Experience' },
    { icon: <FaChartLine className="text-2xl text-green-500" />, title: 'Measurable Performance Improvement' },
    { icon: <FaHandshake className="text-2xl text-purple-500" />, title: 'Dedicated Account Manager' },
    { icon: <FaBook className="text-2xl text-red-500" />, title: 'Lifetime Access to Course Materials' },
    { icon: <FaLaptop className="text-2xl text-yellow-500" />, title: 'Flexible Learning Formats' },
  ];

  const caseStudies = [
    { company: 'TechCorp India', employees: 150, skill: 'Cloud Computing', result: '40% productivity increase' },
    { company: 'FinanceHub Solutions', employees: 200, skill: 'Data Analytics', result: '35% faster decision making' },
    { company: 'RetailMax Ltd', employees: 100, skill: 'Leadership', result: '50% reduction in attrition' },
  ];

  const faqs = [
    {
      question: 'How long does corporate training typically take?',
      answer: 'Training duration varies from 2 weeks to 12 weeks depending on the course complexity and your team size. We customize programs to fit your timeline.',
    },
    {
      question: 'Can training be conducted at our office?',
      answer: 'Yes! We offer on-site training at your premises. We can also provide online or hybrid options based on your preference.',
    },
    {
      question: 'What is the minimum batch size?',
      answer: 'We can accommodate batches from 10 to 500+ participants. Group discounts available for larger batches.',
    },
    {
      question: 'Do you provide certificates after completion?',
      answer: 'Absolutely! All participants receive industry-recognized certificates upon successful course completion.',
    },
    {
      question: 'Can training be customized for our organization?',
      answer: 'Yes, we tailor all programs to match your specific industry needs, current skill levels, and business objectives.',
    },
    {
      question: 'What are the payment terms?',
      answer: 'We offer flexible payment options including upfront payment, milestone-based, or monthly installments based on training duration.',
    },
  ];

  const testimonials = [
    {
      company: 'Global Tech Solutions',
      feedback: 'TrainerMentors transformed our team capabilities. The practical approach and expert mentors made all the difference.',
      person: 'Rajesh Kumar, HR Manager',
    },
    {
      company: 'Innovation Finance Ltd',
      feedback: 'Outstanding training quality with real-world projects. Our team gained immediately applicable skills.',
      person: 'Priya Sharma, Director Training',
    },
    {
      company: 'Digital Enterprises',
      feedback: 'Best investment in our team development. ROI was visible within 3 months of training completion.',
      person: 'Amit Patel, CFO',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Corporate Training Programs | TrainerMentors</title>
        <meta name="description" content="Enterprise training solutions for upskilling your workforce. Customized programs for all industries." />
      </Helmet>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pt-32 pb-20 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Transform Your Workforce with Corporate Training
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Upskill your employees with industry-relevant competencies. Expert-led programs designed for organizational growth and competitive advantage.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-orange-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-orange-600 transition text-lg">
                  Get Custom Quote
                </button>
                <button className="border-2 border-orange-500 text-orange-500 px-8 py-4 rounded-lg font-semibold hover:bg-orange-500/10 transition text-lg">
                  Download Brochure
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-orange-500/20 to-blue-500/20 rounded-2xl p-8 border border-orange-500/30"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="bg-orange-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">
                    500+
                  </div>
                  <div>
                    <p className="font-bold text-white">Companies Trained</p>
                    <p className="text-gray-300">Across multiple industries</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">
                    10K+
                  </div>
                  <div>
                    <p className="font-bold text-white">Employees Trained</p>
                    <p className="text-gray-300">With improved skills</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">
                    95%
                  </div>
                  <div>
                    <p className="font-bold text-white">Satisfaction Rate</p>
                    <p className="text-gray-300">Client satisfaction</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Why Corporate Training Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Invest in Corporate Training?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Organizations that invest in employee training see 24% higher profit margins and significantly improved employee engagement.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyCorporateTraining.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:shadow-lg transition"
              >
                <FaCheckCircle className="text-orange-500 text-3xl mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Corporate Training Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive training solutions tailored to your organization's unique needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition border-t-4 border-orange-500"
              >
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Industries We Serve</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience across diverse sectors with customized training solutions
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {industries.map((industry, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-gradient-to-br from-orange-50 to-blue-50 p-6 rounded-xl text-center border border-orange-200 hover:shadow-lg transition"
              >
                <p className="font-semibold text-gray-900">{industry}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Courses Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Corporate Training Cohorts ({CORPORATE_COHORTS.length})</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Imported directly from the latest corporate training offerings
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CORPORATE_COHORTS.map((course, idx) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition border-l-4 border-orange-500"
              >
                <h3 className="font-bold text-gray-900 mb-3">{course.name}</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">
                    <span className="font-semibold">Category:</span> {course.category}
                  </p>
                  <a
                    href={course.syllabus}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold"
                  >
                    View Syllabus
                    <FaExternalLinkAlt className="text-xs" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose TrainerMentors?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We provide comprehensive, results-driven training solutions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/10 backdrop-blur p-8 rounded-xl border border-white/20 text-center"
              >
                <div className="flex justify-center mb-4">{benefit.icon}</div>
                <h3 className="text-lg font-bold text-white">{benefit.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real results from companies who invested in employee development
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {caseStudies.map((study, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gradient-to-br from-orange-50 to-blue-50 p-8 rounded-xl border border-gray-200 hover:shadow-lg transition"
              >
                <FaTrophy className="text-orange-500 text-3xl mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">{study.company}</h3>
                <div className="space-y-3 mb-4">
                  <p className="text-gray-700"><span className="font-semibold">Employees:</span> {study.employees}</p>
                  <p className="text-gray-700"><span className="font-semibold">Skill Trained:</span> {study.skill}</p>
                  <p className="text-lg font-bold text-orange-500">{study.result}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Client Testimonials</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition border-l-4 border-orange-500"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.feedback}"</p>
                <p className="font-semibold text-gray-900 mb-1">{testimonial.person}</p>
                <p className="text-sm text-gray-600">{testimonial.company}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">
              Have questions about our corporate training programs?
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition bg-white"
                >
                  <h3 className="font-semibold text-gray-900 text-left">{faq.question}</h3>
                  <FaChevronDown
                    className={`text-orange-500 transition ${expandedFaq === idx ? 'rotate-180' : ''}`}
                  />
                </button>
                {expandedFaq === idx && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Organization?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Contact our corporate training specialists today to discuss your organization's unique training needs
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="bg-white/20 backdrop-blur p-6 rounded-lg border border-white/30">
                <FaPhone className="text-2xl text-white mx-auto mb-3" />
                <p className="text-white font-semibold mb-1">Call Us</p>
                <p className="text-white/90">+91 9876 543 210</p>
              </div>
              <div className="bg-white/20 backdrop-blur p-6 rounded-lg border border-white/30">
                <FaEnvelope className="text-2xl text-white mx-auto mb-3" />
                <p className="text-white font-semibold mb-1">Email Us</p>
                <p className="text-white/90">corporate@trainers.com</p>
              </div>
              <div className="bg-white/20 backdrop-blur p-6 rounded-lg border border-white/30">
                <FaMapMarkerAlt className="text-2xl text-white mx-auto mb-3" />
                <p className="text-white font-semibold mb-1">Visit Us</p>
                <p className="text-white/90">Multiple locations in India</p>
              </div>
            </div>

            <button className="bg-white text-orange-500 px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition">
              Request a Consultation
            </button>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default CorporatePage;
