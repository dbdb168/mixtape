'use client';

import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { TrackSearch } from '@/components/TrackSearch';
import { TrackList } from '@/components/TrackList';

interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumArt: string;
  duration: number;
  previewUrl: string | null;
}

type Step = 'tracks' | 'personalize';

const MAX_TRACKS = 10;

// Tape Reel Component
function TapeReel({ spinning = false }: { spinning?: boolean }) {
  return (
    <div className="size-20 md:size-24 rounded-full border-4 border-white/10 relative flex items-center justify-center overflow-hidden">
      <div className={`absolute inset-0 flex items-center justify-center ${spinning ? 'tape-spinning' : ''} opacity-30`}>
        <div className="w-full h-1 bg-white/40" />
        <div className="w-1 h-full bg-white/40 absolute" />
        <div className="w-full h-1 rotate-45 bg-white/40 absolute" />
        <div className="w-full h-1 -rotate-45 bg-white/40 absolute" />
      </div>
      <div className="size-8 md:size-10 rounded-full bg-black border-4 border-white/40 z-10 flex items-center justify-center">
        <div className="size-2 md:size-3 rounded-full bg-white/20" />
      </div>
    </div>
  );
}

// Cassette Visualization
function CassetteVisualization({
  title,
  isRecording,
  onTitleChange
}: {
  title: string;
  isRecording: boolean;
  onTitleChange?: (title: string) => void;
}) {
  return (
    <div className="w-full max-w-md aspect-[1.6/1] bg-[#1a1a1a] border-2 border-white/40 shadow-2xl relative flex flex-col">
      {/* Label Area */}
      <div className="h-[45%] bg-white/95 m-2 md:m-3 p-2 md:p-4 flex flex-col justify-between cassette-label-bg border-b-4 border-black/10">
        <div className="flex justify-between items-start">
          <span className="text-[8px] font-bold text-black/40">TAPE CREATION MODE</span>
          <div className="flex gap-1">
            <div className="size-2 rounded-full border border-black/20" />
            <div className="size-2 rounded-full border border-black/20" />
          </div>
        </div>
        <div className="bg-white border-2 border-black/10 px-2 md:px-4 py-1 md:py-2 flex items-center justify-center">
          {onTitleChange ? (
            <input
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="NAME YOUR MIXTAPE..."
              className="font-handwritten text-black text-base md:text-xl leading-none text-center w-full bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-black/30"
            />
          ) : (
            <span className="font-handwritten text-black text-base md:text-xl leading-none text-center truncate">
              {title || 'NAME YOUR MIXTAPE...'}
            </span>
          )}
        </div>
      </div>

      {/* Reels Area */}
      <div className="flex-1 flex items-center justify-around px-4 md:px-12 relative bg-black/20">
        <TapeReel spinning={isRecording} />

        {/* Counter */}
        <div className="w-16 md:w-24 h-8 md:h-12 bg-black border-2 border-white/20 shadow-inner flex flex-col items-center justify-center">
          <span className="text-[8px] text-primary/60 font-pixel tracking-widest uppercase">COUNTER</span>
          <span className="text-sm md:text-xl text-primary font-pixel tracking-tighter">
            {isRecording ? '●REC' : '00:00'}
          </span>
        </div>

        <TapeReel spinning={isRecording} />
      </div>
    </div>
  );
}

export function CreateMixtapeClient() {
  const [step, setStep] = useState<Step>('tracks');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [mixtapeTitle, setMixtapeTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  // Send form state
  const [senderName, setSenderName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleAddTrack = useCallback((track: Track) => {
    if (tracks.length >= MAX_TRACKS) {
      toast.error(`Maximum ${MAX_TRACKS} tracks allowed!`);
      return;
    }
    setTracks((prev) => [...prev, track]);
    setIsRecording(true);
    setTimeout(() => setIsRecording(false), 1000);
    toast.success('Track recorded!');
  }, [tracks.length]);

  const handleRemoveTrack = (trackId: string) => {
    setTracks(tracks.filter((t) => t.id !== trackId));
  };

  const handleReorderTracks = (newTracks: Track[]) => {
    setTracks(newTracks);
  };

  // Create mixtape and get share URL (called when moving to share step)
  const createMixtape = async (senderName?: string, recipientName?: string, recipientEmail?: string, message?: string) => {
    try {
      const response = await fetch('/api/mixtapes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: mixtapeTitle || 'My Mixtape',
          senderName: senderName || 'Someone special',
          recipientName: recipientName || 'You',
          recipientEmail: recipientEmail || undefined,
          message: message || undefined,
          tracks: tracks.map((t) => ({
            id: t.id,
            name: t.name,
            artist: t.artist,
            album: t.album,
            albumArt: t.albumArt,
            duration: t.duration,
          })),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create mixtape');
      }

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      return `${baseUrl}/m/${result.id}`;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create mixtape');
      return null;
    }
  };

  const handleEject = async () => {
    if (tracks.length === 0) {
      toast.error('Add at least one track first!');
      return;
    }

    setIsSubmitting(true);
    // Create mixtape immediately so share link is available
    const url = await createMixtape();
    if (url) {
      setShareUrl(url);
      setStep('personalize');
    }
    setIsSubmitting(false);
  };

  // Recording step - Main boombox interface
  if (step === 'tracks') {
    return (
      <div className="min-h-screen w-full relative flex flex-col items-center justify-center p-4 md:p-8 bg-[radial-gradient(circle_at_50%_50%,_rgba(30,10,40,1)_0%,_rgba(5,2,10,1)_100%)]">
        {/* Header - Solid background */}
        <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-center h-16 md:h-20 px-4 md:px-12 bg-[#0a050f]">
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

        {/* Main Boombox Interface */}
        <div className="relative z-10 w-full max-w-7xl bg-[#1a1a1f] rounded-xl border-[4px] border-white shadow-cassette overflow-hidden flex flex-col mt-16 md:mt-20">
          {/* Radio Dial Header */}
          <div className="h-10 md:h-14 border-b-2 border-white/20 flex items-center px-4 md:px-8 bg-black/40">
            <div className="flex-1 flex items-center justify-center relative">
              <div className="w-full h-px bg-white/20 absolute top-1/2 -translate-y-1/2" />
              <div className="hidden md:flex justify-between w-full px-20 relative z-10 text-[10px] font-pixel text-white/60">
                <span>FM 88 92 96 100 104 108</span>
                <span className="text-primary animate-pulse tracking-[0.5em]">
                  {isRecording ? '● RECORDING' : 'RECORDING MODE ACTIVE'}
                </span>
                <span>AM 530 700 900 1100 1400 1700</span>
              </div>
              <span className="md:hidden text-[10px] font-pixel text-primary animate-pulse relative z-10">
                {isRecording ? '● RECORDING' : 'READY TO RECORD'}
              </span>
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary shadow-[0_0_10px_#a413ec]" />
            </div>
          </div>

          {/* Main Content Area - Three columns */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left Panel - Search with instructions */}
            <div className="lg:col-span-3 bg-[#16161c] p-4 md:p-6 flex flex-col gap-4 border-b-2 lg:border-b-0 lg:border-r-2 border-white/10 max-h-[350px] lg:max-h-[500px] overflow-hidden">
              {/* Step indicators */}
              <div className="space-y-3 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className={`size-5 rounded-full flex items-center justify-center text-[10px] font-bold ${tracks.length > 0 ? 'bg-primary text-white' : 'bg-primary/20 border border-primary text-primary'}`}>1</div>
                  <span className={`text-xs ${tracks.length > 0 ? 'text-white' : 'text-white/60'}`}>Search & add tracks</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-5 rounded-full bg-primary/20 border border-primary text-primary flex items-center justify-center text-[10px] font-bold">2</div>
                  <span className="text-xs text-white/60">Name your tape</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-5 rounded-full bg-white/10 text-white/40 flex items-center justify-center text-[10px] font-bold">3</div>
                  <span className="text-xs text-white/40">Send it →</span>
                </div>
              </div>

              <TrackSearch
                onAddTrack={handleAddTrack}
                disabledTrackIds={tracks.map((t) => t.id)}
                maxResults={6}
              />
            </div>

            {/* Center Panel - Cassette (sticky at top) */}
            <div className="lg:col-span-6 bg-[#0d0d0f] relative flex flex-col p-4 md:p-6 lg:sticky lg:top-0">
              {/* Level Meters */}
              <div className="hidden md:flex justify-between px-10 mb-4 h-8 gap-1">
                <div className="flex-1 flex gap-0.5 items-end">
                  <div className="w-2 h-[40%] bg-primary" />
                  <div className="w-2 h-[60%] bg-primary" />
                  <div className="w-2 h-[85%] bg-primary" />
                  <div className="w-2 h-[30%] bg-white/10" />
                </div>
                <div className="flex flex-col items-center justify-center px-4">
                  <span className="text-[8px] font-pixel text-white/30 tracking-widest">RECORD</span>
                  <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-600 shadow-[0_0_10px_red] animate-pulse' : 'bg-red-900'}`} />
                </div>
                <div className="flex-1 flex gap-0.5 items-end justify-end">
                  <div className="w-2 h-[20%] bg-white/10" />
                  <div className="w-2 h-[90%] bg-primary" />
                  <div className="w-2 h-[65%] bg-primary" />
                  <div className="w-2 h-[45%] bg-primary" />
                </div>
              </div>

              {/* Cassette Window */}
              <div className="bg-[#050505] border-2 border-white/20 shadow-[inset_0_0_60px_rgba(0,0,0,1)] relative flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none z-20" />
                <CassetteVisualization
                  title={mixtapeTitle}
                  isRecording={isRecording}
                  onTitleChange={setMixtapeTitle}
                />
              </div>

              {/* Recording indicator */}
              <div className="mt-4 text-center">
                <span className="text-[10px] font-pixel text-white/40 tracking-widest uppercase">
                  {isRecording ? '● RECORDING...' : 'CLICK THE TAPE LABEL TO NAME YOUR MIXTAPE'}
                </span>
              </div>
            </div>

            {/* Right Panel - Tracklist with Send button */}
            <div className="lg:col-span-3 bg-[#16161c] p-4 md:p-6 flex flex-col border-t-2 lg:border-t-0 lg:border-l-2 border-white/10 max-h-[450px] lg:max-h-[500px]">
              <div className="flex-1 overflow-hidden">
                <TrackList
                  tracks={tracks}
                  onRemoveTrack={handleRemoveTrack}
                  onReorderTracks={handleReorderTracks}
                  maxTracks={MAX_TRACKS}
                />
              </div>

              {/* Send Tape Button - Always visible at bottom of tracklist */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <button
                  onClick={handleEject}
                  disabled={tracks.length === 0}
                  className={`w-full push-latch h-14 rounded-lg flex items-center justify-center gap-3 transition-all ${
                    tracks.length > 0
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : 'bg-white/10 text-white/30 cursor-not-allowed'
                  }`}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                  </svg>
                  <span className="text-sm font-bold tracking-widest uppercase">
                    {tracks.length > 0 ? 'SEND TAPE' : 'ADD TRACKS FIRST'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Background text */}
        <div className="absolute bottom-10 left-10 hidden lg:flex flex-col gap-1 text-white/5 select-none pointer-events-none">
          <span className="text-8xl font-pixel leading-none">RECORDING</span>
          <span className="text-xs font-pixel tracking-[0.5em] uppercase">HI-FIDELITY DIGITAL INTERFACE // V1.0</span>
        </div>

        {/* Footer */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center space-y-2 opacity-40">
          <p className="text-[10px] font-pixel tracking-widest uppercase">POWERED BY APPLE MUSIC</p>
        </div>

        {/* Background glow */}
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[120%] h-[300px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
      </div>
    );
  }

  // Share/Personalize step - Stitch design with jewel case
  if (step === 'personalize') {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_50%_50%,_rgba(40,20,50,1)_0%,_rgba(10,5,15,1)_100%)]">
        {/* Background glow */}
        <div className="fixed -bottom-40 left-1/2 -translate-x-1/2 w-[120%] h-[300px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

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

        <main className="relative z-10 min-h-screen flex items-center justify-center pt-24 pb-12 px-4 md:px-8">
          <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            {/* Left - Jewel Case */}
            <div className="flex flex-col justify-center items-center gap-8 lg:sticky lg:top-32">
              {/* Jewel Case */}
              <div className="relative w-full max-w-[480px] aspect-[480/340] jewel-case rounded-xl rotate-1 hover:rotate-0 transition-transform duration-700 ease-out">
                {/* Reflection overlay */}
                <div className="absolute inset-0 plastic-reflection rounded-xl z-30 pointer-events-none opacity-60" />

                {/* Spine latches */}
                <div className="absolute -left-1 top-8 w-2 h-12 bg-white/10 rounded-l border border-white/10" />
                <div className="absolute -left-1 bottom-8 w-2 h-12 bg-white/10 rounded-l border border-white/10" />

                {/* Inner content */}
                <div className="absolute inset-4 rounded-lg overflow-hidden shadow-inner flex bg-zinc-900 border border-black/50">
                  {/* Spine */}
                  <div className="w-10 md:w-12 h-full bg-primary/80 border-r border-black/20 flex flex-col items-center justify-center py-4">
                    <span className="text-[8px] md:text-[10px] font-bold rotate-90 whitespace-nowrap tracking-widest text-white/50 uppercase">
                      {mixtapeTitle || 'Your Mix Tape'}
                    </span>
                  </div>

                  {/* J-Card */}
                  <div className="flex-1 relative j-card-retro p-4 md:p-6 flex flex-col justify-between overflow-hidden">
                    <div className="relative z-10">
                      <h1 className="text-2xl md:text-4xl font-black text-white leading-none mb-1">MIX</h1>
                      <h2 className="text-lg md:text-2xl font-bold text-primary italic leading-none uppercase">
                        {mixtapeTitle || 'Tape Vol. 1'}
                      </h2>
                    </div>

                    {/* Mini Cassette */}
                    <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6 h-28 md:h-36 bg-black/90 rounded-lg border-2 border-black p-2 shadow-2xl overflow-hidden flex flex-col">
                      <div className="h-8 md:h-10 bg-primary/80 rounded-sm mb-2 p-1">
                        <div className="bg-white/90 h-full flex items-center px-2">
                          <span className="font-handwritten text-black text-[8px] md:text-[10px] truncate">
                            {tracks.length} TRACKS · HANDMADE FOR YOU
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 flex items-center justify-around px-2 md:px-4">
                        <div className="size-10 md:size-12 rounded-full bg-black border-2 border-white/10 flex items-center justify-center">
                          <div className="size-3 md:size-4 rounded-full bg-zinc-900 border border-white/10 z-10" />
                        </div>
                        <div className="w-6 md:w-8 h-3 md:h-4 bg-black border border-white/10 rounded flex items-center justify-center">
                          <span className="text-[5px] md:text-[6px] text-primary/50 font-bold uppercase">Chrome</span>
                        </div>
                        <div className="size-10 md:size-12 rounded-full bg-black border-2 border-white/10 flex items-center justify-center">
                          <div className="size-3 md:size-4 rounded-full bg-zinc-900 border border-white/10 z-10" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              {/* Make Another */}
              {shareUrl && (
                <button
                  onClick={() => {
                    setTracks([]);
                    setShareUrl(null);
                    setMixtapeTitle('');
                    setStep('tracks');
                  }}
                  className="text-xs text-white/40 hover:text-white transition-colors"
                >
                  Make another mixtape →
                </button>
              )}
            </div>

            {/* Right - Send Form */}
            <div className="space-y-6">
              {/* Heading */}
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
                {shareUrl ? 'Your mixtape is ready. Send it.' : 'Creating...'}
              </h2>

              {shareUrl && (
                <>
                  {/* Name fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] block">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        placeholder="Tim"
                        className="form-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] block">
                        Their Name
                      </label>
                      <input
                        type="text"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="Sarah"
                        className="form-input"
                      />
                    </div>
                  </div>

                  {/* Liner Notes */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] block">
                      Liner Notes
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value.slice(0, 200))}
                      placeholder="Write a personal note..."
                      className="form-input resize-none"
                      rows={3}
                      maxLength={200}
                    />
                  </div>

                  {/* Send via Email - Primary Action */}
                  <div className="space-y-3 p-5 bg-white/5 border border-white/10 rounded-xl mt-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="email"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        placeholder="Their email address"
                        className="form-input text-sm flex-1"
                        disabled={emailSent}
                      />
                      <button
                        onClick={async () => {
                          if (!recipientEmail.trim() || !senderName.trim()) {
                            toast.error('Please enter your name and their email');
                            return;
                          }
                          setIsSubmitting(true);
                          try {
                            const response = await fetch('/api/mixtapes/send-email', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                shareUrl,
                                senderName: senderName.trim(),
                                recipientName: recipientName.trim() || 'Friend',
                                recipientEmail: recipientEmail.trim(),
                                mixtapeTitle: mixtapeTitle || 'My Mixtape',
                                message: message.trim(),
                              }),
                            });
                            if (response.ok) {
                              setEmailSent(true);
                              toast.success('Email sent!');
                            } else {
                              toast.error('Failed to send email');
                            }
                          } catch {
                            toast.error('Failed to send email');
                          } finally {
                            setIsSubmitting(false);
                          }
                        }}
                        disabled={isSubmitting || emailSent || !recipientEmail.trim()}
                        className={`px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap ${
                          emailSent
                            ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                            : recipientEmail.trim()
                              ? 'bg-primary hover:bg-primary/80 text-white'
                              : 'bg-white/10 text-white/40 cursor-not-allowed'
                        }`}
                      >
                        {emailSent ? '✓ Sent!' : isSubmitting ? 'Sending...' : 'Send Email'}
                      </button>
                    </div>
                  </div>

                  {/* Share via Message - Secondary Option */}
                  <div className="flex items-center justify-center gap-3 pt-4 text-white/40">
                    <span className="text-xs">or</span>
                    <button
                      onClick={async () => {
                        if (!shareUrl) return;

                        const name = senderName.trim() || 'Someone';
                        const shareText = `${name} sent you a mixtape! 🎵`;
                        const shareData = {
                          title: mixtapeTitle || 'A Mixtape For You',
                          text: shareText,
                          url: shareUrl,
                        };

                        if (navigator.share && navigator.canShare?.(shareData)) {
                          try {
                            await navigator.share(shareData);
                          } catch (err) {
                            if ((err as Error).name !== 'AbortError') {
                              await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
                              toast.success('Link copied!');
                            }
                          }
                        } else {
                          await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
                          toast.success('Link copied!');
                        }
                      }}
                      className="text-xs text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
                    >
                      share via message
                    </button>
                  </div>

                  {/* Substack promo */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-3 mt-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 bg-[#ff4b00] rounded flex items-center justify-center">
                        <span className="text-white font-black text-xs">S</span>
                      </div>
                      <h4 className="text-sm font-bold">The AI Cookbook</h4>
                    </div>
                    <p className="text-sm text-white/60 leading-relaxed">
                      If you enjoyed this, you might enjoy some things I&apos;m writing about on Substack.{' '}
                      <a
                        href="https://theaicookbook.substack.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-bold"
                      >
                        Subscribe here.
                      </a>
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="fixed bottom-0 left-0 w-full p-4 md:p-8 flex justify-between items-center pointer-events-none">
          <div className="flex items-center gap-6 text-[10px] uppercase tracking-widest pointer-events-auto">
            <Link href="/privacy" className="text-white/30 hover:text-primary transition-colors">Privacy</Link>
            <Link href="/terms" className="text-white/30 hover:text-primary transition-colors">Terms</Link>
          </div>
          <div className="text-[10px] text-white/30">
            © Luminary 2026
          </div>
        </footer>
      </div>
    );
  }

  return null;
}
