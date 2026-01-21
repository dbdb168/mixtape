import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t-4 border-retro-brown bg-retro-cream">
      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Legal Links */}
          <div className="flex gap-6 text-sm">
            <Link
              href="/privacy"
              className="text-retro-navy hover:text-retro-orange transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-retro-navy hover:text-retro-orange transition-colors"
            >
              Terms of Service
            </Link>
          </div>

          {/* Made By */}
          <div className="text-sm text-retro-brown">
            Made with{' '}
            <span role="img" aria-label="music note">
              🎵
            </span>{' '}
            by{' '}
            <a
              href="https://theaicookbook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-retro-teal hover:text-retro-orange transition-colors"
            >
              The AI Cookbook
            </a>
          </div>
        </div>

        {/* Spotify Disclaimer */}
        <p className="text-xs text-retro-brown/70 mt-6 text-center md:text-left">
          Not affiliated with Spotify
        </p>
      </div>
    </footer>
  );
}
