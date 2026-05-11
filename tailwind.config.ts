import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#1d4ed8',
          hover:   '#1e40af',
          light:   '#eff6ff',
        },
        border: '#e5e7eb',
        subtle: '#f9fafb',
        gold:   '#d97706',
        silver: '#9ca3af',
        bronze: '#b45309',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,.08), 0 0 0 1px rgba(0,0,0,.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,.12), 0 0 0 1px rgba(0,0,0,.06)',
      },
      animation: {
        'fade-in': 'fade-in .35s ease both',
        'slide-up': 'slide-up .4s ease both',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
