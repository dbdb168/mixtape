import Link from 'next/link';

export default function PrivacyPolicy() {
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
              Privacy Policy
            </h1>
            <p className="text-white/40 text-sm">Your data, your tunes, your privacy.</p>
          </div>

          <div className="space-y-6">
            <section className="bg-[#1a1a1f] border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-bold mb-3 text-primary">What We Collect</h2>
              <p className="text-sm text-white/70 leading-relaxed mb-3">
                When you use Mixtape, we collect limited information to make the service work:
              </p>
              <ul className="text-sm space-y-2 text-white/50">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  The songs you select for your mixtapes
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Names and personal messages you write for recipients
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Basic analytics (when mixtapes are viewed, when links are clicked)
                </li>
              </ul>
              <p className="text-sm text-white/50 leading-relaxed mt-4 pt-4 border-t border-white/10">
                <strong className="text-white/70">Note:</strong> Recipient email addresses are used only to send
                the mixtape notification and are not stored in our database.
              </p>
            </section>

            <section className="bg-[#1a1a1f] border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-bold mb-3 text-primary">How We Use It</h2>
              <p className="text-sm text-white/70 leading-relaxed mb-3">
                Your data is used solely to power the Mixtape experience:
              </p>
              <ul className="text-sm space-y-2 text-white/50">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Creating and displaying your mixtapes to recipients
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Enabling Apple Music playback of your selected tracks
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Storing your mixtapes so they can be accessed via shared links
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Understanding how people use Mixtape to improve the experience
                </li>
              </ul>
              <p className="text-sm text-white/70 leading-relaxed mt-4 pt-4 border-t border-white/10">
                We never sell your data or use it for advertising purposes.
              </p>
            </section>

            <section className="bg-[#1a1a1f] border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-bold mb-3 text-primary">Third-Party Services</h2>
              <p className="text-sm text-white/70 leading-relaxed mb-3">
                Mixtape relies on trusted third-party services:
              </p>
              <ul className="text-sm space-y-3 text-white/50">
                <li>
                  <span className="text-white font-medium">Apple Music:</span>{' '}
                  We use Apple&apos;s MusicKit API to search for songs and enable playback.
                </li>
                <li>
                  <span className="text-white font-medium">Supabase:</span>{' '}
                  Our database provider, which stores your mixtapes securely.
                </li>
                <li>
                  <span className="text-white font-medium">SendGrid:</span>{' '}
                  Our email provider, used to deliver mixtape notifications to recipients.
                </li>
                <li>
                  <span className="text-white font-medium">Vercel:</span>{' '}
                  Our hosting platform, which may collect standard analytics data.
                </li>
                <li>
                  <span className="text-white font-medium">Substack:</span>{' '}
                  If you subscribe to The AI Cookbook newsletter, that subscription is managed by Substack
                  under their own privacy policy.
                </li>
              </ul>
            </section>

            <section className="bg-[#1a1a1f] border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-bold mb-3 text-primary">Your Rights</h2>
              <p className="text-sm text-white/70 leading-relaxed mb-3">
                You have the right to:
              </p>
              <ul className="text-sm space-y-2 text-white/50">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Request a copy of your data
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Request deletion of your mixtapes
                </li>
              </ul>
              <p className="text-sm text-white/70 leading-relaxed mt-4 pt-4 border-t border-white/10">
                Contact us at{' '}
                <a
                  href="mailto:hello@thisisluminary.co"
                  className="text-primary hover:underline"
                >
                  hello@thisisluminary.co
                </a>
              </p>
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
