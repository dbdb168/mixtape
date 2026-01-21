'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

interface NewsletterOptInProps {
  onComplete: () => void;
}

export function NewsletterOptIn({ onComplete }: NewsletterOptInProps) {
  const [optIn, setOptIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optIn }),
      });

      if (response.ok && optIn) {
        toast.success('Thanks for subscribing!');
      }
    } catch (error) {
      // Don't block the flow if API call fails
      console.error('Newsletter opt-in error:', error);
    } finally {
      setIsSubmitting(false);
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="card-retro max-w-md mx-auto">
      <h2 className="font-pixel text-sm text-retro-brown mb-4">
        STAY IN THE LOOP
      </h2>

      <p className="text-retro-navy mb-6">
        Get updates on new features, mixtape tips, and exclusive content delivered to your inbox.
      </p>

      <div className="flex items-start gap-3 mb-6">
        <input
          id="newsletterOptIn"
          type="checkbox"
          checked={optIn}
          onChange={(e) => setOptIn(e.target.checked)}
          className="w-5 h-5 mt-0.5 border-4 border-retro-black accent-retro-teal cursor-pointer flex-shrink-0"
        />
        <label htmlFor="newsletterOptIn" className="font-pixel text-xs text-retro-brown cursor-pointer">
          YES, I WANT TO RECEIVE EMAIL UPDATES ABOUT MIXTAPE
        </label>
      </div>

      <button
        onClick={handleContinue}
        disabled={isSubmitting}
        className={`btn-retro w-full mb-4 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isSubmitting ? 'SAVING...' : 'CONTINUE'}
      </button>

      <div className="text-center">
        <button
          onClick={handleSkip}
          disabled={isSubmitting}
          className="font-pixel text-xs text-retro-brown hover:text-retro-orange transition-colors"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
