import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        pixel: ['var(--font-pixel)', 'monospace'],
        handwritten: ['var(--font-handwritten)', 'cursive'],
      },
      colors: {
        primary: '#a413ec',
        'background-dark': '#0a050f',
        'background-light': '#f7f6f8',
        metal: '#2d2d35',
        chrome: '#2d2d35',
        plastic: '#161118',
        'record-red': '#ff0000',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'spin-tape': 'spin 4s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'bounce-slow': 'bounce 4s infinite',
        'pulse-glow': 'pulse 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(2deg)' },
          '100%': { transform: 'translateY(0px) rotate(0deg)' },
        },
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(164, 19, 236, 0.6)',
        'glow-primary-lg': '0 0 40px rgba(164, 19, 236, 0.4)',
        'plastic': '0 6px 0 #000, inset 0 1px 1px rgba(255,255,255,0.1)',
        'plastic-pressed': '0 2px 0 #000',
        'cassette': '0 50px 100px -20px rgba(0,0,0,0.9), inset 0 2px 10px rgba(255,255,255,0.1)',
        'jewel-case': '0 20px 50px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,255,255,0.1), inset 2px 2px 0 rgba(255,255,255,0.2)',
      },
    },
  },
  plugins: [],
};

export default config;
