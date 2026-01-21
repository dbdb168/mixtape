'use client';

import { useState, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface PhotoUploadProps {
  onUploadComplete: (url: string | null) => void;
  currentPhotoUrl?: string;
}

export function PhotoUpload({ onUploadComplete, currentPhotoUrl }: PhotoUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhotoUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('Only JPEG, PNG, and WebP images are allowed');
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error('Photo must be 5MB or less');
      return false;
    }
    return true;
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      onUploadComplete(result.url);
      toast.success('Photo uploaded!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed');
      // Clear preview on error
      setPreviewUrl(null);
      onUploadComplete(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = useCallback((file: File) => {
    if (!validateFile(file)) return;

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    uploadFile(file);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleRemove = () => {
    setPreviewUrl(null);
    onUploadComplete(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <label className="font-pixel text-xs text-retro-brown block">
        ADD A PHOTO
      </label>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInputChange}
        className="hidden"
      />

      {previewUrl ? (
        <div className="flex items-center gap-4">
          <div className="relative">
            <div
              className="w-20 h-20 rounded-full overflow-hidden border-4 border-retro-brown cursor-pointer"
              onClick={handleClick}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Photo preview"
                className="w-full h-full object-cover"
              />
              {isUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            disabled={isUploading}
            className="font-pixel text-[10px] text-retro-red hover:text-retro-orange transition-colors disabled:opacity-50"
          >
            REMOVE
          </button>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`w-20 h-20 rounded-full border-4 border-dashed cursor-pointer flex items-center justify-center transition-colors ${
            isDragOver
              ? 'border-retro-orange bg-retro-cream'
              : 'border-retro-brown hover:border-retro-orange'
          }`}
        >
          <span className="font-pixel text-[10px] text-retro-brown text-center">
            +
          </span>
        </div>
      )}

      <p className="font-pixel text-[10px] text-retro-brown opacity-70">
        JPEG, PNG, or WebP (max 5MB)
      </p>
    </div>
  );
}
