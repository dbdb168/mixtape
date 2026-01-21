import type { Metadata } from 'next';
import { pixelFont, bodyFont } from '@/styles/fonts';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mixtape - Make a mixtape for someone you care about',
  description: 'Create personalised music compilations and share them with friends. Connect Spotify, pick songs, add a message, and send the love.',
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
      <body>
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            className: 'font-pixel text-xs',
            style: {
              background: '#1A1A2E',
              color: '#F5E6D3',
              border: '4px solid #8B4513',
            },
          }}
        />
      </body>
    </html>
  );
}
