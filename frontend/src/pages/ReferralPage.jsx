import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaGift, FaUsers, FaHandshake } from 'react-icons/fa';

const ReferralPage = () => {
  const benefits = [
    { icon: <FaGift className="text-4xl" />, amount: '₹500', desc: 'For each successful referral' },
    { icon: <FaUsers className="text-4xl" />, amount: 'Unlimited', desc: 'Number of referrals you can make' },
    { icon: <FaHandshake className="text-4xl" />, amount: '10%', desc: 'Bonus for every 10 successful referrals' },
  ];

  return (
    <>
      <Helmet>
        <title>Referral Program | TrainerMentors</title>
        <meta name="description" content="Earn rewards by referring your friends" />
      </Helmet>

      <section className="pt-32 pb-16 bg-gradient-to-br from-indigo-900 via-dark-800 to-dark-900">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Referral Program</h1>
            <p className="text-xl text-gray-300">Earn rewards by referring your friends</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-dark-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-dark-800 to-dark-700 rounded-2xl p-8 text-center"
              >
                <div className="text-indigo-400 mb-4">{benefit.icon}</div>
                <div className="text-3xl font-bold text-white mb-2">{benefit.amount}</div>
                <p className="text-gray-400">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="bg-indigo-600/20 border border-indigo-500/50 rounded-2xl p-12 text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-6">How it Works?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="text-4xl font-bold text-indigo-400 mb-2">1</div>
                <p className="text-gray-300">Share your unique referral link</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-indigo-400 mb-2">2</div>
                <p className="text-gray-300">Your friend enrolls in any course</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-indigo-400 mb-2">3</div>
                <p className="text-gray-300">You get instant cash rewards</p>
              </div>
            </div>
            <button className="bg-indigo-500 text-white px-8 py-3 rounded-lg hover:bg-indigo-600 transition font-semibold">
              Get Your Referral Link
            </button>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default ReferralPage;
