import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-noir-border bg-noir-bg">
      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Legal Links */}
          <div className="flex gap-6 text-sm">
            <Link
              href="/privacy"
              className="text-noir-text hover:text-noir-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-noir-text hover:text-noir-white transition-colors"
            >
              Terms of Service
            </Link>
          </div>

          {/* Made By */}
          <div className="text-sm text-noir-muted">
            Made by{' '}
            <a
              href="https://theaicookbook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-noir-text hover:text-noir-white transition-colors"
            >
              The AI Cookbook
            </a>
          </div>
        </div>

        {/* Apple Music Disclaimer */}
        <p className="text-xs text-noir-muted mt-6 text-center md:text-left">
          Powered by Apple Music
        </p>
      </div>
    </footer>
  );
}
