import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Why Can't I Hear These Tracks? - Mixtape",
  description: 'Learn about music licensing and why some tracks might not be available on your mixtape.',
};

const reasons = [
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
      </svg>
    ),
    title: 'Regional Licensing',
    description:
      "This track isn't available in your country. Music rights are sold territory by territory, so a song available in one country might not be licensed in another. It's complicated, but it's not personal!",
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
      </svg>
    ),
    title: 'Track Removed',
    description:
      "The artist or their label removed this track from Apple Music. Sometimes songs get pulled due to contract disputes, re-releases, or the artist's own choice. The music industry moves in mysterious ways.",
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
      </svg>
    ),
    title: 'Temporary Glitch',
    description:
      "Apple Music might be having a moment. Try refreshing the page or coming back in a few minutes. Even the best music services have off days.",
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
      </svg>
    ),
    title: 'Subscription Required',
    description:
      "Without an Apple Music subscription, you'll hear 30-second previews instead of full tracks. To listen to complete songs, you'll need an Apple Music subscription. The person who made this mixtape for you wanted you to hear the whole thing!",
  },
];

export default function WhyNoMusicPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_50%_50%,_rgba(30,10,40,1)_0%,_rgba(5,2,10,1)_100%)]">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-center h-16 md:h-20 px-4 md:px-12 bg-black/20 backdrop-blur-md border-b border-white/5">
        <Link href="/" className="flex items-center gap-3">
          <div className="size-10 bg-primary rounded flex items-center justify-center shadow-glow-primary">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="6" width="20" height="12" rx="2" />
              <circle cx="8" cy="12" r="2" />
              <circle cx="16" cy="12" r="2" />
              <line x1="10" y1="12" x2="14" y2="12" />
            </svg>
          </div>
          <span className="text-2xl font-pixel tracking-widest uppercase">Mixtape</span>
        </Link>
      </header>

      <main className="relative z-10 pt-24 pb-16 px-4 md:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#1a1a1f] border border-white/10 rounded-xl p-6 md:p-8 mb-8 text-center">
            <svg className="w-16 h-16 mx-auto text-primary/50 mb-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tighter mb-2">
              Why Can&apos;t I Hear These Tracks?
            </h1>
            <p className="text-white/40 text-sm">
              Music licensing is complicated. Here&apos;s what might have happened:
            </p>
          </div>

          <div className="space-y-4">
            {reasons.map((reason) => (
              <div key={reason.title} className="bg-[#1a1a1f] border border-white/10 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="size-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary">
                    {reason.icon}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold mb-2">{reason.title}</h2>
                    <p className="text-sm text-white/50 leading-relaxed">
                      {reason.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center space-y-4">
            <p className="text-lg font-bold">Don&apos;t Let This Stop You</p>
            <Link href="/create" className="btn-primary inline-flex items-center gap-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              MAKE YOUR OWN MIXTAPE
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
