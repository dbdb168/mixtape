import Link from 'next/link';

export default function MixtapeNotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-md mx-auto text-center space-y-8">
        {/* Error Code */}
        <div className="space-y-2">
          <p className="font-pixel text-6xl text-retro-red">404</p>
          <h1 className="font-pixel text-xl md:text-2xl text-retro-black">
            GAME OVER
          </h1>
          <h2 className="font-pixel text-sm text-retro-brown">
            MIXTAPE NOT FOUND
          </h2>
        </div>

        {/* Emoji */}
        <div className="text-6xl">
          📼
        </div>

        {/* Message */}
        <div className="space-y-4">
          <p className="font-pixel text-sm text-retro-navy">
            your tape got eaten
          </p>
          <p className="text-retro-navy">
            The mixtape you&apos;re looking for doesn&apos;t exist or may have been removed.
            Maybe the link was mistyped, or the tape deck had other plans.
          </p>
        </div>

        {/* CTA */}
        <div className="pt-4 space-y-4">
          <Link href="/api/auth/spotify" className="btn-retro inline-block">
            MAKE YOUR OWN MIXTAPE
          </Link>
          <div>
            <Link
              href="/"
              className="font-pixel text-xs text-retro-brown hover:text-retro-orange transition-colors"
            >
              &larr; BACK TO HOME
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
