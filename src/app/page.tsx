import Link from 'next/link';
import { CassetteTape } from '@/components/CassetteTape';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Title */}
        <h1 className="font-pixel text-4xl md:text-5xl text-retro-black leading-relaxed">
          MIXTAPE
        </h1>

        {/* Tagline */}
        <p className="font-pixel text-sm text-retro-brown leading-relaxed">
          Make a mixtape for someone you care about
        </p>

        {/* Cassette visual */}
        <div className="flex justify-center py-8">
          <CassetteTape />
        </div>

        {/* Description */}
        <p className="text-lg text-retro-navy max-w-md mx-auto leading-relaxed">
          Pick your songs, add a personal message, and share the love.
          Just like the old days, but without the tangled tape.
        </p>

        {/* CTA */}
        <div className="pt-4">
          <Link href="/api/auth/spotify" className="btn-retro inline-block">
            MAKE A MIXTAPE
          </Link>
        </div>

        {/* Spotify note */}
        <p className="text-xs text-retro-brown">
          Connects with your Spotify account
        </p>
      </div>
    </main>
  );
}
