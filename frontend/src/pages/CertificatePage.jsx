import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaAward, FaDownload, FaLink } from 'react-icons/fa';

const CertificatePage = () => {
  const certificates = [
    { id: 1, title: 'Full Stack Development', issueDate: '2024-03-15', students: 1200 },
    { id: 2, title: 'Data Science Masters', issueDate: '2024-02-20', students: 890 },
    { id: 3, title: 'Cloud AWS Architect', issueDate: '2024-01-10', students: 650 },
  ];

  return (
    <>
      <Helmet>
        <title>Certificates | TrainerMentors</title>
        <meta name="description" content="View and verify certificates from TrainerMentors" />
      </Helmet>

      <section className="pt-32 pb-16 bg-gradient-to-br from-primary-900 via-dark-800 to-dark-900">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="text-6xl mb-4">🏆</div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Certificates</h1>
            <p className="text-xl text-gray-300">Verify and showcase your achievements</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-dark-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {certificates.map((cert) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-dark-800 to-dark-700 rounded-2xl p-8 text-center hover:shadow-2xl transition-all"
              >
                <FaAward className="text-5xl text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{cert.title}</h3>
                <p className="text-gray-400 mb-4">Issued: {cert.issueDate}</p>
                <p className="text-green-400 font-semibold mb-6">{cert.students}+ Certified</p>
                <div className="flex gap-3">
                  <button className="flex-1 bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition flex items-center justify-center gap-2">
                    <FaDownload /> Download
                  </button>
                  <button className="flex-1 bg-secondary-500 text-white py-2 rounded-lg hover:bg-secondary-600 transition flex items-center justify-center gap-2">
                    <FaLink /> Share
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default CertificatePage;
