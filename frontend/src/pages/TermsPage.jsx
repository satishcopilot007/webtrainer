import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const TermsPage = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service | TrainerMentors</title>
        <meta name="description" content="Terms of Service for TrainerMentors. Read our policies and terms for using our platform." />
      </Helmet>

      <section className="min-h-screen bg-gray-50 pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>

            <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700">
                  By accessing and using TrainerMentors, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use License</h2>
                <p className="text-gray-700">
                  Permission is granted to temporarily download one copy of the materials (information or software) on TrainerMentors for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose</li>
                  <li>Attempt to decompile or reverse engineer any software</li>
                  <li>Remove any copyright or other proprietary notations</li>
                  <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                  <li>Violate any applicable laws or regulations</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Course Enrollment</h2>
                <p className="text-gray-700">
                  By enrolling in any course on TrainerMentors:
                </p>
                <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                  <li>You agree to comply with all course requirements and policies</li>
                  <li>You acknowledge that course content is intellectual property of TrainerMentors</li>
                  <li>You agree not to share login credentials or course materials</li>
                  <li>You understand refund policies as stated during enrollment</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Payments</h2>
                <p className="text-gray-700">
                  All payments made through our platform are processed securely. By making a payment:
                </p>
                <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                  <li>You warrant that you have the legal right to use the payment method</li>
                  <li>You authorize us to charge the specified amount</li>
                  <li>You agree that charges will appear under the TrainerMentors name</li>
                  <li>You acknowledge you have read and understood our refund policy</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. User Conduct</h2>
                <p className="text-gray-700">
                  You agree not to engage in any of the following:
                </p>
                <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                  <li>Harassing, threatening, or abusive behavior</li>
                  <li>Sharing harmful, illegal, or offensive content</li>
                  <li>Attempting to gain unauthorized access to our systems</li>
                  <li>Spam or excessive communication</li>
                  <li>Impersonating others or misrepresenting your identity</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Intellectual Property</h2>
                <p className="text-gray-700">
                  All content on TrainerMentors, including courses, videos, and materials, is the intellectual property of TrainerMentors or its content providers. Unauthorized reproduction or distribution is prohibited.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Disclaimer</h2>
                <p className="text-gray-700">
                  The materials on TrainerMentors are provided on an 'as is' basis. TrainerMentors makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
                <p className="text-gray-700">
                  In no event shall TrainerMentors be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on TrainerMentors.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Modifications to Terms</h2>
                <p className="text-gray-700">
                  TrainerMentors may revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Us</h2>
                <p className="text-gray-700">
                  If you have questions about these Terms of Service, please contact us at:
                </p>
                <p className="text-gray-700 mt-2">
                  Email: info@trainermentors.com<br />
                  Phone: +91 99999 99999<br />
                  Address: Hyderabad, Telangana, India
                </p>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <p className="text-gray-700">
                  <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default TermsPage;
