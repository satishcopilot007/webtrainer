import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp,
  FaInstagram, FaFacebookF, FaLinkedinIn, FaChevronDown,
} from 'react-icons/fa';
import ContactForm from '../components/forms/ContactForm';
import { getFAQs } from '../api/coreApi';
import { SOCIAL_LINKS } from '../utils/constants';

const contactInfo = [
  { icon: FaPhone, label: 'Phone', value: '+91 99999 99999', href: 'tel:+919999999999' },
  { icon: FaEnvelope, label: 'Email', value: 'info@trainermentors.com', href: 'mailto:info@trainermentors.com' },
  { icon: FaMapMarkerAlt, label: 'Address', value: 'Hyderabad, Telangana, India', href: null },
  { icon: FaWhatsapp, label: 'WhatsApp', value: 'Chat with us', href: SOCIAL_LINKS.whatsapp },
];

const socialLinks = [
  { icon: FaInstagram, href: SOCIAL_LINKS.instagram, label: 'Instagram' },
  { icon: FaFacebookF, href: SOCIAL_LINKS.facebook, label: 'Facebook' },
  { icon: FaLinkedinIn, href: SOCIAL_LINKS.linkedin, label: 'LinkedIn' },
];

const FAQItem = ({ faq, isOpen, onToggle }) => (
  <div className="border border-gray-200 rounded-xl overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
    >
      <span className="font-medium text-gray-800 pr-4">{faq.question}</span>
      <FaChevronDown className={`text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <p className="px-6 pb-4 text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const ContactPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const { data } = await getFAQs();
        setFaqs(data.results || data);
      } catch { /* silent */ }
    };
    fetchFAQs();
  }, []);

  return (
    <>
      <Helmet>
        <title>Contact Us | TrainerMentors</title>
        <meta name="description" content="Get in touch with TrainerMentors. Reach out for course enquiries, demo bookings, or placement assistance. We're here to help you succeed." />
        <link rel="canonical" href="https://trainermentors.com/contact" />
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-r from-[#461E96] to-[#461E96]/80 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Get In Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/80 text-lg max-w-2xl mx-auto"
          >
            Have questions about our courses or need guidance? We&#39;d love to hear from you.
          </motion.p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
              <ContactForm />
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>
                <div className="space-y-4">
                  {contactInfo.map((item) => (
                    <div key={item.label} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <item.icon className="text-primary-600 text-lg" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{item.label}</p>
                        {item.href ? (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-800 font-medium hover:text-primary-500 transition-colors"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-gray-800 font-medium">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Follow Us</h3>
                <div className="flex gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors"
                    >
                      <social.icon />
                    </a>
                  ))}
                </div>
              </div>

              {/* Map Placeholder */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Our Location</h3>
                <div className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <FaMapMarkerAlt className="text-3xl mx-auto mb-2" />
                    <p className="text-sm">Google Maps Embed</p>
                    <p className="text-xs">Hyderabad, Telangana, India</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-500">Find answers to common queries about our courses and programs.</p>
            </motion.div>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <motion.div
                  key={faq.id || i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <FAQItem
                    faq={faq}
                    isOpen={openFaq === i}
                    onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ContactPage;
