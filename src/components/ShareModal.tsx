import React, { useState } from 'react';
import { Copy, Check, Share2, X, AlertCircle } from 'lucide-react';
import { Album } from '../types';

interface ShareModalProps {
  album: Album;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ album, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = window.location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `LUMORA — ${album.title}`,
        text: album.description,
        url: currentUrl
      }).catch(() => {});
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Share Album"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl text-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-amber-500" />
            <h3 className="text-base font-cinematic font-semibold text-white">Share Memories</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-5 space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-800/40 border border-neutral-800">
            <img
              src={album.cover}
              alt={album.title}
              className="w-12 h-12 rounded-xl object-cover"
            />
            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-white truncate">{album.title}</h4>
              <p className="text-xs text-neutral-400">{album.photos.length} photos · {album.date}</p>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-2">
              Shareable Web Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="w-full bg-neutral-800/80 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-300 font-mono focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-xl text-xs font-semibold shrink-0 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {album.isCustom && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <p className="leading-relaxed">
                This is a local custom album saved in your browser's private IndexedDB storage. Demo albums can be viewed by anyone with the link; custom media belongs to this device unless cloud storage is configured.
              </p>
            </div>
          )}

          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium border border-neutral-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Share via System Share Sheet</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
