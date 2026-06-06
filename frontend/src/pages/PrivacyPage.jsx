import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const PrivacyPage = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | TrainerMentors</title>
        <meta name="description" content="Privacy Policy for TrainerMentors. Learn how we protect and handle your personal information." />
      </Helmet>

      <section className="min-h-screen bg-gray-50 pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

            <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
                <p className="text-gray-700">
                  We collect information you provide directly to us, such as when you create an account, enroll in a course, or contact us. This includes:
                </p>
                <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                  <li>Name and email address</li>
                  <li>Phone number</li>
                  <li>Payment information</li>
                  <li>Educational background</li>
                  <li>Communication preferences</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
                <p className="text-gray-700">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                  <li>Provide and improve our services</li>
                  <li>Process course enrollments and payments</li>
                  <li>Send educational content and updates</li>
                  <li>Respond to your inquiries</li>
                  <li>Comply with legal obligations</li>
                  <li>Send promotional communications (with your consent)</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Information Sharing</h2>
                <p className="text-gray-700">
                  We do not sell your personal information. We may share information with:
                </p>
                <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                  <li>Our trusted partners and instructors</li>
                  <li>Payment processors and service providers</li>
                  <li>Legal authorities when required by law</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
                <p className="text-gray-700">
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Your Rights</h2>
                <p className="text-gray-700">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookies</h2>
                <p className="text-gray-700">
                  We use cookies to enhance your experience. You can control cookie settings in your browser.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Contact Us</h2>
                <p className="text-gray-700">
                  If you have questions about this Privacy Policy, please contact us at:
                </p>
                <p className="text-gray-700 mt-2">
                  Email: info@trainermentors.com<br />
                  Phone: +91 99999 99999<br />
                  Address: Hyderabad, Telangana, India
                </p>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <p className="text-gray-700">
                  <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default PrivacyPage;
