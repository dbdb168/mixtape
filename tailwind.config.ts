import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['var(--font-pixel)', 'monospace'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      colors: {
        // Noir palette - dark monochrome aesthetic
        noir: {
          bg: '#0A0A0A',         // Deep black background
          surface: '#141414',    // Card/elevated surfaces
          border: '#2A2A2A',     // Subtle borders
          muted: '#525252',      // Muted text
          text: '#A3A3A3',       // Secondary text
          light: '#E5E5E5',      // Primary text
          white: '#FAFAFA',      // Brightest text
          accent: '#F5F5F5',     // Accent (soft white)
          highlight: '#D4D4D4',  // Hover states
        },
        // Legacy retro colors (mapped to noir)
        retro: {
          cream: '#0A0A0A',      // Now dark
          brown: '#525252',      // Now muted gray
          orange: '#E5E5E5',     // Now light (for CTAs)
          red: '#B91C1C',        // Error red
          teal: '#A3A3A3',       // Now secondary gray
          navy: '#D4D4D4',       // Now light gray
          black: '#FAFAFA',      // Now white (inverted)
        },
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'wiggle': 'wiggle 0.5s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
