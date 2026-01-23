import type { Metadata } from 'next';
import { pixelFont, bodyFont } from '@/styles/fonts';
import { Toaster } from 'react-hot-toast';
import { Footer } from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mixtape - Make a mixtape for someone you care about',
  description: 'Create personalised music compilations and share them with friends. Pick songs, add a message, and send the love. Powered by Apple Music.',
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
    <html lang="en" className={`${pixelFont.variable} ${bodyFont.variable}`}>
      <body className="flex flex-col min-h-screen">
        <div className="flex-1">
          {children}
        </div>
        <Footer />
        <Toaster
          position="bottom-center"
          toastOptions={{
            className: 'font-pixel text-xs',
            style: {
              background: '#141414',
              color: '#E5E5E5',
              border: '1px solid #2A2A2A',
            },
          }}
        />
      </body>
    </html>
  );
}
