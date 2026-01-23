'use client';

import { useState } from 'react';

interface MixtapeFormData {
  title: string;
  senderName: string;
  recipientName: string;
  recipientEmail: string;
  recipientPhone: string;
  message: string;
}

interface MixtapeFormProps {
  onSubmit: (data: MixtapeFormData) => void;
  isSubmitting: boolean;
  initialData?: Partial<MixtapeFormData>;
  showSuccess?: boolean;
}

export function MixtapeForm({ onSubmit, isSubmitting, initialData, showSuccess }: MixtapeFormProps) {
  const [senderName, setSenderName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState(initialData?.recipientEmail || '');
  const [message, setMessage] = useState(initialData?.message || '');

  const MESSAGE_MAX = 200;

  const isValid = senderName.trim().length > 0 && recipientName.trim().length > 0 && recipientEmail.trim().length > 0;
  const canSubmit = isValid && !isSubmitting && !showSuccess;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    onSubmit({
      title: initialData?.title || 'My Mixtape',
      senderName: senderName.trim(),
      recipientName: recipientName.trim(),
      recipientEmail: recipientEmail.trim(),
      recipientPhone: '',
      message: message.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Your Name / Their Name */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="senderName" className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] block">
            Your Name
          </label>
          <input
            id="senderName"
            type="text"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            placeholder="Tim"
            className="form-input"
            required
            disabled={showSuccess}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="recipientName" className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] block">
            Their Name
          </label>
          <input
            id="recipientName"
            type="text"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="Sarah"
            className="form-input"
            required
            disabled={showSuccess}
          />
        </div>
      </div>

      {/* Recipient's Email */}
      <div className="space-y-2">
        <label htmlFor="recipientEmail" className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] block">
          Recipient&apos;s Email
        </label>
        <div className="relative">
          <svg className="w-5 h-5 text-primary/60 absolute left-4 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
          <input
            id="recipientEmail"
            type="email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            placeholder="friend@example.com"
            className="form-input pl-12"
            required
            disabled={showSuccess}
          />
        </div>
      </div>

      {/* Liner Notes / Message */}
      <div className="space-y-2">
        <label htmlFor="message" className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] block">
          Liner Notes / Message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, MESSAGE_MAX))}
          placeholder="Write a personal note for your mixtape..."
          className="form-input resize-none"
          rows={4}
          maxLength={MESSAGE_MAX}
          disabled={showSuccess}
        />
      </div>

      {/* Submit Button & Success Message */}
      <div className="pt-4 flex flex-col gap-6">
        {!showSuccess && (
          <button
            type="submit"
            disabled={!canSubmit}
            className={`push-latch group relative bg-primary w-full h-16 rounded-lg flex items-center justify-center gap-3 overflow-hidden ${
              !canSubmit ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <svg className="w-6 h-6 text-white group-active:scale-90 transition-transform" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
            <span className="text-sm font-black tracking-widest uppercase text-white shadow-sm">
              {isSubmitting ? 'SENDING...' : 'SEND TAPE'}
            </span>
            <div className="absolute top-2 right-2 size-2 rounded-full bg-white/40 group-hover:bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          </button>
        )}

        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-500/10 border border-green-500/50 p-4 rounded-xl flex items-center gap-4">
            <svg className="w-6 h-6 text-green-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span className="text-sm font-bold text-green-400">Sent! Your mixtape is on its way.</span>
          </div>
        )}

        {/* AI Cookbook - Only shows after success */}
        {showSuccess && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="size-8 bg-[#ff4b00] rounded flex items-center justify-center">
                <span className="text-white font-black text-xs">S</span>
              </div>
              <h4 className="text-sm font-bold">The AI Cookbook</h4>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              If you enjoyed this, you might enjoy some things I&apos;m writing about on Substack at the AI Cookbook.{' '}
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
        )}
      </div>
    </form>
  );
}
