import Link from 'next/link';

export default function TermsOfService() {
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
          <div className="bg-[#1a1a1f] border border-white/10 rounded-xl p-6 md:p-8 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tighter mb-2">
              Terms of Service
            </h1>
            <p className="text-white/40 text-sm">The rules of the tape deck.</p>
          </div>

          <div className="space-y-6">
            <section className="bg-[#1a1a1f] border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-bold mb-3 text-primary">The Basics</h2>
              <p className="text-sm text-white/70 leading-relaxed mb-3">
                Mixtape is a free service that lets you create personalised music playlists
                (we call them &quot;mixtapes&quot;) and share them with others. By using Mixtape,
                you agree to these terms.
              </p>
              <p className="text-sm text-white/50 leading-relaxed">
                You must be at least 13 years old to use this service. If you&apos;re under 18,
                please make sure a parent or guardian has reviewed these terms with you.
              </p>
            </section>

            <section className="bg-[#1a1a1f] border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-bold mb-3 text-primary">Your Content</h2>
              <p className="text-sm text-white/70 leading-relaxed mb-3">
                When you create a mixtape, you&apos;re responsible for the content you add—including
                messages and titles.
              </p>
              <p className="text-sm text-white/50 leading-relaxed">
                You retain ownership of your content. However, by creating a mixtape and sharing it,
                you grant us permission to store and display that content to your intended recipients.
              </p>
            </section>

            <section className="bg-[#1a1a1f] border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-bold mb-3 text-primary">Acceptable Use</h2>
              <p className="text-sm text-white/70 leading-relaxed mb-3">
                Keep it kind! When using Mixtape, please don&apos;t:
              </p>
              <ul className="text-sm space-y-2 text-white/50">
                <li className="flex items-start gap-2">
                  <span className="text-red-400">×</span>
                  Upload content that&apos;s illegal, harmful, or violates others&apos; rights
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">×</span>
                  Use the service to harass, bully, or threaten anyone
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">×</span>
                  Attempt to access other users&apos; accounts or data
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">×</span>
                  Use automated tools to spam or abuse the service
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">×</span>
                  Violate Apple Music&apos;s terms of service
                </li>
              </ul>
            </section>

            <section className="bg-[#1a1a1f] border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-bold mb-3 text-primary">Apple Music</h2>
              <p className="text-sm text-white/70 leading-relaxed mb-3">
                Mixtape uses the Apple Music API but is not affiliated with, sponsored by, or endorsed by Apple.
                Music playback is subject to Apple Music&apos;s own terms and availability.
              </p>
              <p className="text-sm text-white/50 leading-relaxed">
                Full track playback requires an Apple Music subscription. Non-subscribers can hear 30-second previews.
              </p>
            </section>

            <section className="bg-[#1a1a1f] border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-bold mb-3 text-primary">No Warranty</h2>
              <p className="text-sm text-white/70 leading-relaxed mb-3">
                Mixtape is provided &quot;as is&quot; without warranties of any kind. We can&apos;t guarantee:
              </p>
              <ul className="text-sm space-y-2 text-white/50">
                <li className="flex items-start gap-2">
                  <span className="text-white/30">•</span>
                  The service will always be available or error-free
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white/30">•</span>
                  Your mixtapes will be preserved forever
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white/30">•</span>
                  All features will work in all regions
                </li>
              </ul>
            </section>

            <p className="text-center text-xs text-white/30 pt-4">
              Last updated: January 2026
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
