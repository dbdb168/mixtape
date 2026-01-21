export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-retro-cream py-16 px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-pixel text-3xl md:text-4xl text-retro-black mb-8">
          PRIVACY POLICY
        </h1>

        <div className="prose prose-lg max-w-none text-retro-navy space-y-8">
          <section>
            <h2 className="font-pixel text-xl text-retro-brown mb-4">What We Collect</h2>
            <p className="leading-relaxed">
              When you use Mixtape, we collect limited information to make the service work:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>Your Spotify display name and profile picture (for personalisation)</li>
              <li>The songs you select for your mixtapes</li>
              <li>Personal messages you write for recipients</li>
              <li>Optional: photos you upload to customise your mixtape</li>
              <li>Optional: your email address if you subscribe to our newsletter</li>
            </ul>
          </section>

          <section>
            <h2 className="font-pixel text-xl text-retro-brown mb-4">How We Use It</h2>
            <p className="leading-relaxed">
              Your data is used solely to power the Mixtape experience:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>Creating and displaying your mixtapes to recipients</li>
              <li>Enabling Spotify playback of your selected tracks</li>
              <li>Storing your mixtapes so they can be accessed via shared links</li>
              <li>Sending occasional updates if you opted into our newsletter</li>
            </ul>
            <p className="leading-relaxed mt-4">
              We never sell your data or use it for advertising purposes.
            </p>
          </section>

          <section>
            <h2 className="font-pixel text-xl text-retro-brown mb-4">Third-Party Services</h2>
            <p className="leading-relaxed">
              Mixtape relies on trusted third-party services:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>
                <strong>Spotify:</strong> We use Spotify&apos;s API to search for songs and enable playback.
                Your Spotify credentials are handled directly by Spotify—we only receive an access token.
              </li>
              <li>
                <strong>Supabase:</strong> Our database provider, which stores your mixtapes and account data securely.
              </li>
              <li>
                <strong>Vercel:</strong> Our hosting platform, which may collect standard analytics data
                (like page views and geographic region).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-pixel text-xl text-retro-brown mb-4">Your Rights</h2>
            <p className="leading-relaxed">
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>Request a copy of your data</li>
              <li>Request deletion of your account and all associated mixtapes</li>
              <li>Unsubscribe from marketing communications at any time</li>
            </ul>
            <p className="leading-relaxed mt-4">
              To exercise any of these rights, contact us at{' '}
              <a
                href="mailto:privacy@mixtape.fm"
                className="text-retro-teal hover:text-retro-orange underline"
              >
                privacy@mixtape.fm
              </a>
            </p>
          </section>

          <section>
            <h2 className="font-pixel text-xl text-retro-brown mb-4">Data Retention</h2>
            <p className="leading-relaxed">
              We retain your mixtapes and account data for as long as your account is active.
              Mixtapes shared via public links remain accessible until you delete them or your account.
            </p>
            <p className="leading-relaxed mt-4">
              If you delete your account, all your data will be permanently removed within 30 days.
            </p>
          </section>

          <p className="text-sm text-retro-brown pt-8 border-t border-retro-brown/20">
            Last updated: January 2026
          </p>
        </div>
      </div>
    </main>
  );
}
