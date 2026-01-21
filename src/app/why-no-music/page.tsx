import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Why Can't I Hear These Tracks? - Mixtape",
  description: 'Learn about music licensing and why some tracks might not be available on your mixtape.',
};

const reasons = [
  {
    emoji: '🌍',
    title: 'REGIONAL LICENSING',
    description:
      "This track isn't available in your country. Music rights are sold territory by territory, so a song available in one country might not be licensed in another. It's complicated, but it's not personal!",
  },
  {
    emoji: '😢',
    title: 'TRACK REMOVED',
    description:
      "The artist or their label removed this track from Spotify. Sometimes songs get pulled due to contract disputes, re-releases, or the artist's own choice. The music industry moves in mysterious ways.",
  },
  {
    emoji: '⏳',
    title: 'TEMPORARY GLITCH',
    description:
      "Spotify might be having a moment. Try refreshing the page or coming back in a few minutes. Even the best music services have off days.",
  },
  {
    emoji: '🎧',
    title: 'SPOTIFY FREE VS PREMIUM',
    description:
      "If you're using Spotify Free, you'll hear 30-second previews instead of full tracks. To listen to complete songs, you'll need a Spotify Premium account. The person who made this mixtape for you wanted you to hear the whole thing!",
  },
];

export default function WhyNoMusicPage() {
  return (
    <main className="min-h-screen bg-retro-cream py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <h1 className="font-pixel text-2xl md:text-3xl text-retro-navy text-center leading-relaxed mb-4">
          WHY CAN&apos;T I HEAR THESE TRACKS?
        </h1>

        {/* Intro */}
        <p className="text-center text-retro-navy mb-10 text-lg">
          Music licensing is complicated. Here&apos;s what might have happened:
        </p>

        {/* Reason cards */}
        <div className="space-y-6">
          {reasons.map((reason) => (
            <div key={reason.title} className="card-retro">
              <div className="flex items-start gap-4">
                <span className="text-4xl flex-shrink-0" role="img" aria-label={reason.title}>
                  {reason.emoji}
                </span>
                <div>
                  <h2 className="font-pixel text-sm text-retro-navy mb-2">
                    {reason.title}
                  </h2>
                  <p className="text-retro-navy leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-12 text-center space-y-4">
          <p className="font-pixel text-lg text-retro-navy">
            DON&apos;T LET THIS STOP YOU
          </p>
          <Link href="/" className="btn-retro inline-block">
            MAKE YOUR OWN MIXTAPE
          </Link>
        </div>
      </div>
    </main>
  );
}
