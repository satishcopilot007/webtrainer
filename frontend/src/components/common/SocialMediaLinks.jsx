import React from 'react';
import { 
  FaLinkedin, 
  FaFacebook, 
  FaInstagram, 
  FaTwitter, 
  FaWhatsapp,
  FaYoutube,
  FaTelegram,
  FaGithub
} from 'react-icons/fa';

/**
 * Social Media Links Component
 * Displays social media icons with links
 * Update the URLs with your actual social media handles
 */

const SOCIAL_LINKS = [
  {
    name: 'LinkedIn',
    icon: FaLinkedin,
    url: 'https://www.linkedin.com/company/trainermentors', // Update with your LinkedIn profile/company
    bgColor: 'hover:bg-blue-700',
    tooltip: 'Connect on LinkedIn',
  },
  {
    name: 'Facebook',
    icon: FaFacebook,
    url: 'https://www.facebook.com/TrainerMentors', // Update with your Facebook page
    bgColor: 'hover:bg-blue-600',
    tooltip: 'Like us on Facebook',
  },
  {
    name: 'Instagram',
    icon: FaInstagram,
    url: 'https://www.instagram.com/trainermentors/', // Update with your Instagram profile
    bgColor: 'hover:bg-pink-600',
    tooltip: 'Follow us on Instagram',
  },
  {
    name: 'Twitter',
    icon: FaTwitter,
    url: 'https://twitter.com/TrainerMentors', // Update with your Twitter handle
    bgColor: 'hover:bg-blue-500',
    tooltip: 'Follow us on Twitter',
  },
  {
    name: 'WhatsApp',
    icon: FaWhatsapp,
    url: 'https://wa.me/919999999999', // Update with your WhatsApp number (include country code)
    bgColor: 'hover:bg-green-600',
    tooltip: 'Chat with us on WhatsApp',
  },
  {
    name: 'YouTube',
    icon: FaYoutube,
    url: 'https://www.youtube.com/c/TrainerMentors', // Update with your YouTube channel
    bgColor: 'hover:bg-red-600',
    tooltip: 'Subscribe on YouTube',
  },
  {
    name: 'Telegram',
    icon: FaTelegram,
    url: 'https://t.me/TrainerMentors', // Update with your Telegram channel
    bgColor: 'hover:bg-blue-500',
    tooltip: 'Join us on Telegram',
  },
  {
    name: 'GitHub',
    icon: FaGithub,
    url: 'https://github.com/trainermentors', // Update with your GitHub profile
    bgColor: 'hover:bg-gray-800',
    tooltip: 'Follow us on GitHub',
  },
];

/**
 * SocialMediaLinks Component
 * @param {string} size - Icon size ('sm' | 'md' | 'lg') - default: 'md'
 * @param {string} layout - Layout style ('horizontal' | 'vertical') - default: 'horizontal'
 * @param {boolean} showLabels - Show text labels next to icons - default: false
 * @param {string} colorScheme - Color scheme ('light' | 'dark') - default: 'light'
 */
const SocialMediaLinks = ({ 
  size = 'md', 
  layout = 'horizontal',
  showLabels = false,
  colorScheme = 'light'
}) => {
  const sizeMap = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const containerClasses = layout === 'vertical' ? 'flex flex-col gap-3' : 'flex gap-3';

  const bgBaseColor = colorScheme === 'dark' 
    ? 'bg-gray-800 text-white' 
    : 'bg-gray-100 text-gray-700';

  return (
    <div className={containerClasses}>
      {SOCIAL_LINKS.map((social) => {
        const Icon = social.icon;
        return (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            title={social.tooltip}
            className={`flex items-center gap-2 p-2.5 rounded-full ${bgBaseColor} ${social.bgColor} transition-all duration-300 transform hover:scale-110 ${
              layout === 'vertical' ? 'w-full justify-start' : ''
            }`}
            aria-label={`Visit our ${social.name} page`}
          >
            <Icon className={sizeMap[size]} />
            {showLabels && <span className="text-sm font-medium whitespace-nowrap">{social.name}</span>}
          </a>
        );
      })}
    </div>
  );
};

export default SocialMediaLinks;
