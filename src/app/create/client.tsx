'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { CassetteTape } from '@/components/CassetteTape';
import { TrackSearch } from '@/components/TrackSearch';
import { TrackList } from '@/components/TrackList';
import { MixtapeForm } from '@/components/MixtapeForm';

interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumArt: string;
  duration: number;
  previewUrl: string | null;
}

interface MixtapeFormData {
  title: string;
  recipientName: string;
  recipientEmail: string;
  recipientPhone: string;
  message: string;
}

type Step = 'tracks' | 'personalize' | 'share';

const STEPS: { key: Step; label: string }[] = [
  { key: 'tracks', label: 'PICK TRACKS' },
  { key: 'personalize', label: 'PERSONALIZE' },
  { key: 'share', label: 'SHARE' },
];

const MAX_TRACKS = 12;

export function CreateMixtapeClient() {
  const [step, setStep] = useState<Step>('tracks');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [formData, setFormData] = useState<MixtapeFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mixtapeId, setMixtapeId] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const handleAddTrack = (track: Track) => {
    if (tracks.length >= MAX_TRACKS) {
      toast.error(`Maximum ${MAX_TRACKS} tracks allowed!`);
      return;
    }
    setTracks([...tracks, track]);
    toast.success('Track added!');
  };

  const handleRemoveTrack = (trackId: string) => {
    setTracks(tracks.filter((t) => t.id !== trackId));
  };

  const handleReorderTracks = (newTracks: Track[]) => {
    setTracks(newTracks);
  };

  const handleFormSubmit = async (data: MixtapeFormData) => {
    setFormData(data);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/mixtapes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          recipientName: data.recipientName,
          recipientEmail: data.recipientEmail,
          recipientPhone: data.recipientPhone,
          message: data.message,
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

      setMixtapeId(result.id);
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      setShareUrl(`${baseUrl}/m/${result.id}`);
      setStep('share');
      toast.success('Mixtape created!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create mixtape');
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToStep = (newStep: Step) => {
    // Validation before moving to personalize
    if (newStep === 'personalize' && tracks.length === 0) {
      toast.error('Add at least one track first!');
      return;
    }
    setStep(newStep);
  };

  const shareViaEmail = () => {
    if (!shareUrl || !formData) return;
    const to = formData.recipientEmail ? encodeURIComponent(formData.recipientEmail) : '';
    const subject = encodeURIComponent(`${formData.title} - A mixtape for you!`);
    const body = encodeURIComponent(
      `Hey ${formData.recipientName}!\n\n${formData.message ? formData.message + '\n\n' : ''}I made you a mixtape: ${shareUrl}`
    );
    window.open(`mailto:${to}?subject=${subject}&body=${body}`, '_blank');
  };

  const shareViaSMS = () => {
    if (!shareUrl || !formData) return;
    const to = formData.recipientPhone || '';
    const body = encodeURIComponent(
      `Hey ${formData.recipientName}! I made you a mixtape: ${shareUrl}`
    );
    window.open(`sms:${to}?body=${body}`, '_blank');
  };

  const shareViaWhatsApp = () => {
    if (!shareUrl || !formData) return;
    const phone = formData.recipientPhone ? formData.recipientPhone.replace(/\D/g, '') : '';
    const text = encodeURIComponent(
      `Hey ${formData.recipientName}! I made you a mixtape: ${shareUrl}`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const copyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied!');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const currentStepIndex = STEPS.findIndex((s) => s.key === step);

  return (
    <main className="min-h-screen py-8 px-4 bg-noir-bg">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-pixel text-3xl md:text-4xl text-noir-white mb-2">
            CREATE MIXTAPE
          </h1>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 md:gap-4">
            {STEPS.map((s, index) => (
              <div key={s.key} className="flex items-center">
                <button
                  onClick={() => {
                    // Only allow going back or to current step (except share which requires completion)
                    if (index <= currentStepIndex || (s.key === 'share' && mixtapeId)) {
                      goToStep(s.key);
                    }
                  }}
                  className={`font-pixel text-[10px] md:text-xs px-3 py-2 border transition-colors ${
                    step === s.key
                      ? 'bg-noir-white text-noir-bg border-noir-white'
                      : index < currentStepIndex || (s.key === 'share' && mixtapeId)
                      ? 'bg-noir-surface text-noir-light border-noir-border cursor-pointer hover:bg-noir-border'
                      : 'bg-noir-bg text-noir-muted border-noir-border opacity-50 cursor-not-allowed'
                  }`}
                  disabled={index > currentStepIndex && !(s.key === 'share' && mixtapeId)}
                >
                  {index + 1}. {s.label}
                </button>
                {index < STEPS.length - 1 && (
                  <div className="w-4 md:w-8 h-0.5 bg-noir-border mx-1" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        {step === 'tracks' && (
          <div className="space-y-8">
            {/* Cassette Visualization */}
            <div className="flex justify-center">
              <CassetteTape
                trackCount={tracks.length}
                maxTracks={MAX_TRACKS}
                title={formData?.title}
              />
            </div>

            {/* Track Selection */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Search */}
              <div className="card-retro">
                <h2 className="font-pixel text-sm text-noir-muted mb-4">
                  SEARCH TRACKS
                </h2>
                <TrackSearch
                  onAddTrack={handleAddTrack}
                  disabledTrackIds={tracks.map((t) => t.id)}
                />
              </div>

              {/* Track List */}
              <div className="card-retro">
                <h2 className="font-pixel text-sm text-noir-muted mb-4">
                  YOUR MIXTAPE ({tracks.length}/{MAX_TRACKS})
                </h2>
                <TrackList
                  tracks={tracks}
                  onRemoveTrack={handleRemoveTrack}
                  onReorderTracks={handleReorderTracks}
                />
              </div>
            </div>

            {/* Next Button */}
            <div className="flex justify-center">
              <button
                onClick={() => goToStep('personalize')}
                disabled={tracks.length === 0}
                className={`btn-retro ${tracks.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                NEXT: PERSONALIZE
              </button>
            </div>
          </div>
        )}

        {step === 'personalize' && (
          <div className="max-w-md mx-auto space-y-8">
            {/* Cassette Visualization */}
            <div className="flex justify-center">
              <CassetteTape
                trackCount={tracks.length}
                maxTracks={MAX_TRACKS}
                title={formData?.title}
              />
            </div>

            {/* Form */}
            <div className="card-retro">
              <h2 className="font-pixel text-sm text-noir-muted mb-4">
                ADD DETAILS
              </h2>
              <MixtapeForm
                onSubmit={handleFormSubmit}
                isSubmitting={isSubmitting}
                initialData={formData || undefined}
              />
            </div>

            {/* Back Button */}
            <div className="flex justify-center">
              <button
                onClick={() => setStep('tracks')}
                className="font-pixel text-xs text-noir-muted hover:text-noir-white transition-colors"
              >
                &larr; BACK TO TRACKS
              </button>
            </div>
          </div>
        )}

        {step === 'share' && shareUrl && formData && (
          <div className="max-w-md mx-auto space-y-8">
            {/* Success Message */}
            <div className="text-center">
              <div className="text-6xl mb-4">&#127926;</div>
              <h2 className="font-pixel text-xl text-noir-white mb-2">
                MIXTAPE CREATED!
              </h2>
              <p className="text-noir-text">
                Your mixtape &quot;{formData.title}&quot; is ready to share with {formData.recipientName}!
              </p>
            </div>

            {/* Cassette Visualization */}
            <div className="flex justify-center">
              <CassetteTape
                trackCount={tracks.length}
                maxTracks={MAX_TRACKS}
                title={formData.title}
              />
            </div>

            {/* Share Options */}
            <div className="card-retro space-y-4">
              <h3 className="font-pixel text-sm text-noir-muted mb-4">
                SHARE YOUR MIXTAPE
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={shareViaEmail}
                  className="btn-retro text-center"
                >
                  EMAIL
                </button>
                <button
                  onClick={shareViaSMS}
                  className="btn-retro text-center"
                >
                  SMS
                </button>
                <button
                  onClick={shareViaWhatsApp}
                  className="btn-secondary text-center"
                >
                  WHATSAPP
                </button>
                <button
                  onClick={copyLink}
                  className="btn-secondary text-center"
                >
                  COPY LINK
                </button>
              </div>

              {/* Share URL Display */}
              <div className="mt-4 p-3 bg-noir-bg border border-noir-border break-all">
                <p className="font-pixel text-[10px] text-noir-muted mb-1">LINK:</p>
                <p className="text-sm text-noir-light">{shareUrl}</p>
              </div>
            </div>

            {/* Create Another */}
            <div className="text-center">
              <button
                onClick={() => {
                  setTracks([]);
                  setFormData(null);
                  setMixtapeId(null);
                  setShareUrl(null);
                  setStep('tracks');
                }}
                className="font-pixel text-xs text-noir-muted hover:text-noir-white transition-colors"
              >
                CREATE ANOTHER MIXTAPE
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
