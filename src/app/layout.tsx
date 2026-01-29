import type { Metadata } from 'next';
import { displayFont, pixelFont, handwrittenFont } from '@/styles/fonts';
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mixtape - More Feels than a Playlist',
  description: 'Send a Mixtape to Someone. Pick songs, add a message, and share the love. Powered by Apple Music.',
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon.svg',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://mixtape.thisisluminary.co'),
  openGraph: {
    title: 'Mixtape - More Feels than a Playlist',
    description: 'Send a Mixtape to Someone. Pick songs, add a message, and share the love.',
    url: 'https://mixtape.thisisluminary.co',
    type: 'website',
    siteName: 'Mixtape',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mixtape - More Feels than a Playlist',
    description: 'Send a Mixtape to Someone. Pick songs, add a message, and share the love.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${displayFont.variable} ${pixelFont.variable} ${handwrittenFont.variable}`}>
      <head>
        <link rel="preconnect" href="https://hfgdacpkdeqwcfspezgz.supabase.co" />
        <link rel="dns-prefetch" href="https://hfgdacpkdeqwcfspezgz.supabase.co" />
      </head>
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
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
