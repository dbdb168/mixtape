'use client';

import { useState } from 'react';
import { PhotoUpload } from '@/components/PhotoUpload';

interface MixtapeFormData {
  title: string;
  recipientName: string;
  message: string;
  saveAsPlaylist: boolean;
  photoUrl: string | null;
}

interface MixtapeFormProps {
  onSubmit: (data: MixtapeFormData) => void;
  isSubmitting: boolean;
  initialData?: Partial<MixtapeFormData>;
}

export function MixtapeForm({ onSubmit, isSubmitting, initialData }: MixtapeFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [recipientName, setRecipientName] = useState(initialData?.recipientName || '');
  const [message, setMessage] = useState(initialData?.message || '');
  const [saveAsPlaylist, setSaveAsPlaylist] = useState(initialData?.saveAsPlaylist || false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialData?.photoUrl || null);

  const TITLE_MAX = 50;
  const RECIPIENT_MAX = 50;
  const MESSAGE_MAX = 200;

  const isValid = title.trim().length > 0 && recipientName.trim().length > 0;
  const canSubmit = isValid && !isSubmitting;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    onSubmit({
      title: title.trim(),
      recipientName: recipientName.trim(),
      message: message.trim(),
      saveAsPlaylist,
      photoUrl,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <label htmlFor="title" className="font-pixel text-xs text-retro-brown block">
          MIXTAPE TITLE *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value.slice(0, TITLE_MAX))}
          placeholder="Summer Vibes 2024"
          className="input-retro"
          maxLength={TITLE_MAX}
          required
        />
        <div className="text-right">
          <span className={`font-pixel text-[10px] ${title.length >= TITLE_MAX ? 'text-retro-red' : 'text-retro-brown'}`}>
            {title.length}/{TITLE_MAX}
          </span>
        </div>
      </div>

      {/* Recipient Name */}
      <div className="space-y-2">
        <label htmlFor="recipientName" className="font-pixel text-xs text-retro-brown block">
          WHO IS THIS FOR? *
        </label>
        <input
          id="recipientName"
          type="text"
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value.slice(0, RECIPIENT_MAX))}
          placeholder="Your friend's name"
          className="input-retro"
          maxLength={RECIPIENT_MAX}
          required
        />
        <div className="text-right">
          <span className={`font-pixel text-[10px] ${recipientName.length >= RECIPIENT_MAX ? 'text-retro-red' : 'text-retro-brown'}`}>
            {recipientName.length}/{RECIPIENT_MAX}
          </span>
        </div>
      </div>

      {/* Message */}
      <div className="space-y-2">
        <label htmlFor="message" className="font-pixel text-xs text-retro-brown block">
          ADD A MESSAGE
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, MESSAGE_MAX))}
          placeholder="Hey! I made this mixtape just for you..."
          className="input-retro min-h-[100px] resize-none"
          maxLength={MESSAGE_MAX}
        />
        <div className="text-right">
          <span className={`font-pixel text-[10px] ${message.length >= MESSAGE_MAX ? 'text-retro-red' : 'text-retro-brown'}`}>
            {message.length}/{MESSAGE_MAX}
          </span>
        </div>
      </div>

      {/* Photo Upload */}
      <PhotoUpload
        onUploadComplete={setPhotoUrl}
        currentPhotoUrl={photoUrl || undefined}
      />

      {/* Save as Playlist Checkbox */}
      <div className="flex items-center gap-3">
        <input
          id="saveAsPlaylist"
          type="checkbox"
          checked={saveAsPlaylist}
          onChange={(e) => setSaveAsPlaylist(e.target.checked)}
          className="w-5 h-5 border-4 border-retro-black accent-retro-teal cursor-pointer"
        />
        <label htmlFor="saveAsPlaylist" className="font-pixel text-xs text-retro-brown cursor-pointer">
          ALSO SAVE AS A SPOTIFY PLAYLIST
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!canSubmit}
        className={`btn-retro w-full ${!canSubmit ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isSubmitting ? 'CREATING...' : 'CREATE MIXTAPE'}
      </button>
    </form>
  );
}
