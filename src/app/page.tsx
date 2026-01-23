import Link from 'next/link';
import { CassetteTape } from '@/components/CassetteTape';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-noir-bg">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Title */}
        <h1 className="font-pixel text-4xl md:text-5xl text-noir-white leading-relaxed">
          MIXTAPE
        </h1>

        {/* Tagline */}
        <p className="font-pixel text-sm text-noir-muted leading-relaxed">
          Make a mixtape for someone you care about
        </p>

        {/* Cassette visual */}
        <div className="flex justify-center py-8">
          <CassetteTape />
        </div>

        {/* Description */}
        <p className="text-lg text-noir-text max-w-md mx-auto leading-relaxed">
          Pick your songs, add a personal message, and share the love.
          Just like the old days, but without the tangled tape.
        </p>

        {/* CTA */}
        <div className="pt-4">
          <Link href="/create" className="btn-retro inline-block">
            MAKE A MIXTAPE
          </Link>
        </div>

        {/* Apple Music note */}
        <p className="text-xs text-noir-muted">
          Powered by Apple Music
        </p>
      </div>
    </main>
  );
}
