'use client';

import { useState } from 'react';

interface MixtapeFormData {
  title: string;
  recipientName: string;
  recipientEmail: string;
  recipientPhone: string;
  message: string;
}

interface MixtapeFormProps {
  onSubmit: (data: MixtapeFormData) => void;
  isSubmitting: boolean;
  initialData?: Partial<MixtapeFormData>;
}

export function MixtapeForm({ onSubmit, isSubmitting, initialData }: MixtapeFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [recipientName, setRecipientName] = useState(initialData?.recipientName || '');
  const [recipientEmail, setRecipientEmail] = useState(initialData?.recipientEmail || '');
  const [recipientPhone, setRecipientPhone] = useState(initialData?.recipientPhone || '');
  const [message, setMessage] = useState(initialData?.message || '');

  const TITLE_MAX = 50;
  const RECIPIENT_MAX = 50;
  const MESSAGE_MAX = 200;

  // Require at least email or phone for contact capture
  const hasContact = recipientEmail.trim().length > 0 || recipientPhone.trim().length > 0;
  const isValid = title.trim().length > 0 && recipientName.trim().length > 0 && hasContact;
  const canSubmit = isValid && !isSubmitting;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    onSubmit({
      title: title.trim(),
      recipientName: recipientName.trim(),
      recipientEmail: recipientEmail.trim(),
      recipientPhone: recipientPhone.trim(),
      message: message.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <label htmlFor="title" className="font-pixel text-xs text-noir-muted block">
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
          <span className={`font-pixel text-[10px] ${title.length >= TITLE_MAX ? 'text-retro-red' : 'text-noir-muted'}`}>
            {title.length}/{TITLE_MAX}
          </span>
        </div>
      </div>

      {/* Recipient Name */}
      <div className="space-y-2">
        <label htmlFor="recipientName" className="font-pixel text-xs text-noir-muted block">
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
          <span className={`font-pixel text-[10px] ${recipientName.length >= RECIPIENT_MAX ? 'text-retro-red' : 'text-noir-muted'}`}>
            {recipientName.length}/{RECIPIENT_MAX}
          </span>
        </div>
      </div>

      {/* Recipient Contact - Email or Phone required */}
      <div className="space-y-4">
        <p className="font-pixel text-xs text-noir-muted">
          HOW SHOULD WE REACH THEM? *
        </p>
        <p className="text-xs text-noir-text">
          Enter their email or phone so you can share directly
        </p>

        {/* Email */}
        <div className="space-y-1">
          <label htmlFor="recipientEmail" className="font-pixel text-[10px] text-noir-muted block">
            EMAIL
          </label>
          <input
            id="recipientEmail"
            type="email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            placeholder="friend@email.com"
            className="input-retro"
          />
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <label htmlFor="recipientPhone" className="font-pixel text-[10px] text-noir-muted block">
            PHONE
          </label>
          <input
            id="recipientPhone"
            type="tel"
            value={recipientPhone}
            onChange={(e) => setRecipientPhone(e.target.value)}
            placeholder="+1 555 123 4567"
            className="input-retro"
          />
        </div>

        {!hasContact && (
          <p className="font-pixel text-[10px] text-retro-red">
            Please enter an email or phone number
          </p>
        )}
      </div>

      {/* Message */}
      <div className="space-y-2">
        <label htmlFor="message" className="font-pixel text-xs text-noir-muted block">
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
          <span className={`font-pixel text-[10px] ${message.length >= MESSAGE_MAX ? 'text-retro-red' : 'text-noir-muted'}`}>
            {message.length}/{MESSAGE_MAX}
          </span>
        </div>
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
