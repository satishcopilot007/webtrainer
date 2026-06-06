import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaBriefcase, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';

const CareersPage = () => {
  const jobs = [
    {
      id: 1,
      title: 'Senior Course Instructor',
      location: 'Remote',
      type: 'Full-time',
      experience: '5+ years',
      department: 'Education'
    },
    {
      id: 2,
      title: 'Content Developer',
      location: 'Bangalore',
      type: 'Full-time',
      experience: '3+ years',
      department: 'Content'
    },
    {
      id: 3,
      title: 'Marketing Specialist',
      location: 'Remote',
      type: 'Full-time',
      experience: '2+ years',
      department: 'Marketing'
    },
    {
      id: 4,
      title: 'Student Success Manager',
      location: 'Pune',
      type: 'Full-time',
      experience: '1+ years',
      department: 'Support'
    },
  ];

  return (
    <>
      <Helmet>
        <title>Careers | TrainerMentors</title>
        <meta name="description" content="Join our team and make a difference" />
      </Helmet>

      <section className="pt-32 pb-16 bg-gradient-to-br from-teal-900 via-dark-800 to-dark-900">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="text-6xl mb-4">💼</div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Join Our Team</h1>
            <p className="text-xl text-gray-300">Help us transform lives through education</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-dark-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="space-y-6">
            {jobs.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-dark-800 to-dark-700 rounded-2xl p-8 hover:shadow-2xl transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="flex-grow">
                    <h3 className="text-2xl font-bold text-white mb-3">{job.title}</h3>
                    <div className="flex flex-wrap gap-4 text-gray-300">
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-teal-400" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaBriefcase className="text-teal-400" />
                        <span>{job.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaUsers className="text-teal-400" />
                        <span>{job.experience}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 mt-3">Department: {job.department}</p>
                  </div>
                  <button className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-8 py-3 rounded-lg hover:shadow-lg transition whitespace-nowrap">
                    Apply Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mt-16 bg-teal-600/20 border border-teal-500/50 rounded-2xl p-8 text-center"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Didn't find what you're looking for?</h2>
            <p className="text-gray-300 mb-6">Send us your resume and let's discuss future opportunities</p>
            <button className="bg-teal-500 text-white px-8 py-3 rounded-lg hover:bg-teal-600 transition">
              Send Your Resume
            </button>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default CareersPage;
