import Link from 'next/link';

// Tape Reel component for the cassette
function TapeReel() {
  return (
    <div className="size-24 rounded-full bg-black border-[6px] border-[#222] relative flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center tape-spinning opacity-40">
        <div className="w-full h-1.5 bg-white/20" />
        <div className="w-1.5 h-full bg-white/20 absolute" />
        <div className="absolute w-full h-1.5 bg-white/20 rotate-45" />
        <div className="absolute w-full h-1.5 bg-white/20 -rotate-45" />
      </div>
      <div className="size-8 rounded-full bg-[#0a0a0a] border-2 border-[#444] z-10 shadow-inner" />
    </div>
  );
}

// Floating Cassette component
function FloatingCassette() {
  return (
    <div className="floating relative w-full max-w-md aspect-[1.6/1] bg-[#1a1a1a] rounded-xl border-[8px] border-[#333] shadow-cassette overflow-hidden group">
      <div className="absolute inset-0 p-4 flex flex-col">
        {/* Label Section */}
        <div className="h-1/3 bg-primary/80 rounded-sm border-b-4 border-black/30 p-3 flex flex-col justify-end">
          <div className="bg-white/95 h-10 px-4 flex items-center shadow-inner">
            <span className="font-pixel text-black text-2xl tracking-widest pt-1 uppercase">
              Mixtape Like It&apos;s 1986
            </span>
          </div>
        </div>

        {/* Reels Section */}
        <div className="flex-1 flex items-center justify-around px-10">
          <TapeReel />

          {/* Counter Window */}
          <div className="w-20 h-10 bg-[#0d0d0d] rounded border-2 border-[#222] shadow-inner flex flex-col items-center justify-center overflow-hidden">
            <div className="w-full h-0.5 bg-primary/30 mb-1" />
            <span className="text-[10px] text-primary font-pixel tracking-widest">C-90</span>
            <div className="w-full h-0.5 bg-primary/30 mt-1" />
          </div>

          <TapeReel />
        </div>

        {/* Bottom Section */}
        <div className="h-8 flex justify-between items-center px-4">
          <div className="flex gap-1">
            <div className="size-1 rounded-full bg-white/10" />
            <div className="size-1 rounded-full bg-white/10" />
          </div>
          <span className="text-[8px] font-pixel text-white/20 tracking-widest uppercase">
            High Bias / Type II
          </span>
          <div className="flex gap-1">
            <div className="size-1 rounded-full bg-white/10" />
            <div className="size-1 rounded-full bg-white/10" />
          </div>
        </div>
      </div>

      {/* Shine overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none z-20" />
      <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors pointer-events-none" />
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* CRT Scanlines Overlay */}
      <div className="fixed inset-0 z-50 crt-scanlines pointer-events-none opacity-20" />

      {/* Background Glow */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary/10 to-transparent" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
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

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 pb-20 pt-24 md:pt-0">
          <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text */}
            <div className="space-y-10 text-center lg:text-left">
              <div className="space-y-4">
                <h1 className="text-7xl lg:text-9xl font-pixel tracking-tighter text-white retro-glow leading-none">
                  MIXTAPE
                </h1>
                <p className="text-xl lg:text-2xl font-light text-primary tracking-[0.1em] opacity-90 max-w-md mx-auto lg:mx-0">
                  Make a mix tape, share it with someone, spread some joy.
                </p>
              </div>

              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
                <Link
                  href="/create"
                  className="plastic-depth group relative px-10 py-5 bg-[#222] border-2 border-[#444] rounded-lg flex items-center gap-4 transition-all hover:border-primary/50"
                >
                  <div className="size-10 rounded-full bg-primary flex items-center justify-center shadow-glow-primary group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <span className="text-xl font-pixel tracking-widest uppercase pt-1">Start New Tape</span>
                  <div className="absolute -top-1 -right-1 size-2 rounded-full bg-red-500 shadow-[0_0_10px_red] animate-pulse" />
                </Link>
              </div>
            </div>

            {/* Right Side - Cassette */}
            <div className="relative flex items-center justify-center py-12">
              <FloatingCassette />

              {/* Glow under cassette */}
              <div className="absolute -z-10 w-full max-w-sm h-40 bg-primary/30 blur-[100px] rounded-full bottom-0" />

              {/* Floating equalizer badge */}
              <div className="absolute top-0 right-10 bg-[#111] border border-white/10 p-4 rounded shadow-2xl animate-bounce" style={{ animationDuration: '4s' }}>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="4" y="4" width="3" height="16" />
                    <rect x="10" y="8" width="3" height="12" />
                    <rect x="16" y="2" width="3" height="18" />
                  </svg>
                  <div className="space-y-1">
                    <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="w-2/3 h-full bg-primary" />
                    </div>
                    <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="w-1/2 h-full bg-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6 text-[10px] uppercase tracking-widest">
            <Link href="/privacy" className="text-white/30 hover:text-primary transition-colors">Privacy</Link>
            <Link href="/terms" className="text-white/30 hover:text-primary transition-colors">Terms</Link>
          </div>
          <div className="text-[10px] text-white/30 text-center md:text-right">
            <span>© Luminary 2026</span>
          </div>
        </footer>
      </div>
    </>
  );
}
