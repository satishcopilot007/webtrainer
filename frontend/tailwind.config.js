/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f3f0ff', 100: '#e0d9ff', 200: '#c4b5fd', 300: '#a78bfa',
          400: '#8b5cf6', 500: '#461E96', 600: '#3b1880', 700: '#2e1265',
          800: '#220d4b', 900: '#160830',
        },
        secondary: {
          50: '#e6f9ff', 100: '#b3ecff', 200: '#80dfff', 300: '#4dd2ff',
          400: '#1ac5ff', 500: '#00B4E6', 600: '#0090b8', 700: '#006c8a',
          800: '#00485c', 900: '#00242e',
        },
        accent: {
          pink: '#E6008C',
          green: '#00DC8C',
        },
        dark: {
          50: '#f5f5f5', 100: '#e0e0e0', 200: '#bdbdbd', 300: '#9e9e9e',
          400: '#757575', 500: '#616161', 600: '#424242', 700: '#303030',
          800: '#1a1a2e', 900: '#0f0f1a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
      },
    },
  },
  plugins: [],
};
