import Link from 'next/link';

export default function MixtapeNotFound() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_50%_50%,_rgba(30,10,40,1)_0%,_rgba(5,2,10,1)_100%)] flex flex-col items-center justify-center p-8">
      {/* Background glow */}
      <div className="fixed -bottom-40 left-1/2 -translate-x-1/2 w-[120%] h-[300px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-md mx-auto text-center space-y-8">
        {/* Error Card */}
        <div className="bg-[#1a1a1f] border border-white/10 rounded-xl p-8">
          <p className="text-7xl font-bold text-primary mb-2">404</p>
          <h1 className="text-2xl font-bold mb-2">Tape Not Found</h1>
          <p className="text-sm text-white/40">
            Your tape got eaten by the machine
          </p>
        </div>

        {/* Broken Cassette Visual */}
        <div className="flex justify-center">
          <svg width="120" height="80" viewBox="0 0 120 80" className="text-white/20">
            <rect x="1" y="1" width="118" height="78" fill="none" stroke="currentColor" strokeWidth="2" rx="4" strokeDasharray="5 3" />
            <rect x="15" y="12" width="90" height="35" fill="none" stroke="currentColor" strokeWidth="1" rx="2" strokeDasharray="3 2" />
            <circle cx="40" cy="30" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="80" cy="30" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
            {/* Broken tape */}
            <path d="M50 30 Q60 35 70 30" stroke="currentColor" fill="none" strokeWidth="1" strokeDasharray="2 2" />
            <text x="60" y="62" textAnchor="middle" className="font-pixel" fontSize="8" fill="currentColor">ERROR</text>
          </svg>
        </div>

        {/* Message */}
        <div className="bg-[#1a1a1f] border border-white/10 rounded-xl p-6">
          <p className="text-sm text-white/50 leading-relaxed">
            The mixtape you&apos;re looking for doesn&apos;t exist or may have been removed.
            Maybe the link was mistyped, or the tape deck had other plans.
          </p>
        </div>

        {/* CTA */}
        <div className="space-y-4">
          <Link href="/create" className="btn-primary inline-flex items-center gap-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            MAKE YOUR OWN MIXTAPE
          </Link>
          <div>
            <Link
              href="/"
              className="text-sm text-white/40 hover:text-white transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
