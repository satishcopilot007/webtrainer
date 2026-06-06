import { useEffect } from 'react';

/**
 * Live Chat Integration Component
 * Integrates Tawk.to live chat - Free tier available
 * 
 * To use:
 * 1. Sign up at https://www.tawk.to
 * 2. Create a new property
 * 3. Add REACT_APP_TAWK_PROPERTY_ID to .env
 * 4. Add <LiveChat /> to your main layout component (e.g., MainLayout.jsx)
 * 
 * Features:
 * - Live chat with support team
 * - Visitor profiles
 * - Chat history
 * - Mobile responsive
 * - Fully customizable
 */

const LiveChat = () => {
  useEffect(() => {
    // Tawk.to chat widget initialization
    const tawkPropertyId = import.meta.env.VITE_TAWK_PROPERTY_ID || 'YOUR_TAWK_PROPERTY_ID';

    // Create and load Tawk widget script
    const s1 = document.createElement('script');
    const s0 = document.getElementsByTagName('script')[0];

    s1.async = true;
    s1.src = `https://embed.tawk.to/${tawkPropertyId}/1i1ssj27i`;
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');

    s0.parentNode.insertBefore(s1, s0);

    // Cleanup function to remove script if component unmounts
    return () => {
      const tawkScripts = document.querySelectorAll(`script[src*="embed.tawk.to"]`);
      tawkScripts.forEach((script) => script.remove());
    };
  }, []);

  return null; // Tawk widget renders itself via script
};

export default LiveChat;

/**
 * ALTERNATIVE: Using Crisp Chat (Free tier)
 * If you prefer Crisp over Tawk:
 * 
 * 1. Sign up at https://crisp.chat
 * 2. Get your Website ID
 * 3. Add REACT_APP_CRISP_WEBSITE_ID to .env
 * 
 * Replace the useEffect code above with:
 * 
 * useEffect(() => {
 *   window.$crisp = [];
 *   window.CRISP_WEBSITE_ID = process.env.REACT_APP_CRISP_WEBSITE_ID || 'YOUR_CRISP_ID';
 *   
 *   const s = document.createElement('script');
 *   s.src = 'https://client.crisp.chat/l.js';
 *   s.async = 1;
 *   document.body.appendChild(s);
 * 
 *   return () => {
 *     document.body.removeChild(s);
 *   };
 * }, []);
 */
