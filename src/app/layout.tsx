import type { Metadata } from 'next';
import { displayFont, pixelFont, handwrittenFont } from '@/styles/fonts';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mixtape - Make a mixtape for someone you care about',
  description: 'Create personalised music compilations and share them with friends. Pick songs, add a message, and send the love. Powered by Apple Music.',
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon.svg',
  },
  openGraph: {
    title: 'Mixtape',
    description: 'Make a mixtape for someone you care about',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${displayFont.variable} ${pixelFont.variable} ${handwrittenFont.variable}`}>
      <body className="bg-background-dark font-display text-white selection:bg-primary/40 overflow-x-hidden">
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            className: 'font-display text-sm',
            style: {
              background: '#1a1a1f',
              color: '#FFFFFF',
              border: '1px solid rgba(164, 19, 236, 0.5)',
              borderRadius: '0.5rem',
            },
          }}
        />
      </body>
    </html>
  );
}
