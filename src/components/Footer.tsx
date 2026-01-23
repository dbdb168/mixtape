import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black/20">
      <div className="max-w-4xl mx-auto px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Legal Links */}
          <div className="flex items-center gap-6 text-[10px] uppercase tracking-widest">
            <Link
              href="/privacy"
              className="text-white/30 hover:text-primary transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-white/30 hover:text-primary transition-colors"
            >
              Terms
            </Link>
            <span className="text-white/20">Powered by Apple Music</span>
          </div>

          {/* Copyright */}
          <div className="text-[10px] text-white/30">
            © Luminary 2026
          </div>
        </div>
      </div>
    </footer>
  );
}
