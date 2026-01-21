export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-retro-cream py-16 px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-pixel text-3xl md:text-4xl text-retro-black mb-8">
          TERMS OF SERVICE
        </h1>

        <div className="prose prose-lg max-w-none text-retro-navy space-y-8">
          <section>
            <h2 className="font-pixel text-xl text-retro-brown mb-4">The Basics</h2>
            <p className="leading-relaxed">
              Mixtape is a free service that lets you create personalised music playlists
              (we call them &quot;mixtapes&quot;) and share them with others. By using Mixtape,
              you agree to these terms.
            </p>
            <p className="leading-relaxed mt-4">
              You must be at least 13 years old to use this service. If you&apos;re under 18,
              please make sure a parent or guardian has reviewed these terms with you.
            </p>
          </section>

          <section>
            <h2 className="font-pixel text-xl text-retro-brown mb-4">Your Content</h2>
            <p className="leading-relaxed">
              When you create a mixtape, you&apos;re responsible for the content you add—including
              messages, titles, and any photos you upload.
            </p>
            <p className="leading-relaxed mt-4">
              You retain ownership of your content. However, by creating a mixtape and sharing it,
              you grant us permission to store and display that content to your intended recipients.
            </p>
          </section>

          <section>
            <h2 className="font-pixel text-xl text-retro-brown mb-4">Acceptable Use</h2>
            <p className="leading-relaxed">
              Keep it kind! When using Mixtape, please don&apos;t:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>Upload content that&apos;s illegal, harmful, or violates others&apos; rights</li>
              <li>Use the service to harass, bully, or threaten anyone</li>
              <li>Attempt to access other users&apos; accounts or data</li>
              <li>Use automated tools to spam or abuse the service</li>
              <li>Violate Spotify&apos;s terms of service</li>
              <li>Impersonate others or misrepresent your identity</li>
            </ul>
            <p className="leading-relaxed mt-4">
              We reserve the right to remove content or suspend accounts that violate these guidelines.
            </p>
          </section>

          <section>
            <h2 className="font-pixel text-xl text-retro-brown mb-4">Spotify Disclaimer</h2>
            <p className="leading-relaxed">
              Mixtape uses the Spotify API but is not affiliated with, sponsored by, or endorsed by Spotify.
              Music playback requires a Spotify account and is subject to Spotify&apos;s own terms and availability.
            </p>
            <p className="leading-relaxed mt-4">
              Some features may require a Spotify Premium subscription. We don&apos;t control Spotify&apos;s
              service, and song availability may vary by region.
            </p>
          </section>

          <section>
            <h2 className="font-pixel text-xl text-retro-brown mb-4">No Warranty</h2>
            <p className="leading-relaxed">
              Mixtape is provided &quot;as is&quot; without warranties of any kind. We do our best to keep
              things running smoothly, but we can&apos;t guarantee:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>The service will always be available or error-free</li>
              <li>Your mixtapes will be preserved forever</li>
              <li>All Spotify features will work in all regions</li>
            </ul>
            <p className="leading-relaxed mt-4">
              We recommend keeping copies of any important messages you write.
            </p>
          </section>

          <section>
            <h2 className="font-pixel text-xl text-retro-brown mb-4">Changes</h2>
            <p className="leading-relaxed">
              We may update these terms from time to time. If we make significant changes,
              we&apos;ll try to let you know—but it&apos;s a good idea to check back occasionally.
            </p>
            <p className="leading-relaxed mt-4">
              Continued use of Mixtape after changes means you accept the updated terms.
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
