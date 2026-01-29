import { Space_Grotesk, Permanent_Marker } from 'next/font/google';

// Main display font - Space Grotesk
export const displayFont = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '700'],
  display: 'swap',
  preload: true,
});

// Handwritten font for liner notes
export const handwrittenFont = Permanent_Marker({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-handwritten',
  display: 'swap',
  preload: true,
});

// VT323 pixel font - using next/font/google
import { VT323 } from 'next/font/google';

export const pixelFont = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
  display: 'swap',
  preload: true,
});

// Export legacy names for compatibility
export const bodyFont = displayFont;
