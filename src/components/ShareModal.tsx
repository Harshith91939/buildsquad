import React, { useState } from 'react';
import { Check, Copy, MessageCircle, Linkedin, Twitter, Sparkles, X } from 'lucide-react';

interface ShareModalProps {
  referralCode: string;
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  referralCode,
  isOpen,
  onClose,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const baseUrl = window.location.origin;
  const shareUrl = `${baseUrl}/?ref=${referralCode}&utm_source=whatsapp`;
  const shareText = `🚀 Hey! I just registered for BuildSquad by NxtWave to build real-world web products and unlock exclusive developer bounties. Use my referral code *${referralCode}* to claim instant priority access: ${shareUrl}`;

  const copyToClipboard = (text: string, isCodeOnly = false) => {
    navigator.clipboard.writeText(text);
    if (isCodeOnly) {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const shareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const shareLinkedIn = () => {
    const linkedInUrl = `${baseUrl}/?ref=${referralCode}&utm_source=linkedin`;
    const text = `Excited to join BuildSquad by NxtWave! Building tech products alongside passionate students. Join using my referral code ${referralCode}:`;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(linkedInUrl)}&summary=${encodeURIComponent(text)}`, '_blank');
  };

  const shareTwitter = () => {
    const twitterUrl = `${baseUrl}/?ref=${referralCode}&utm_source=twitter`;
    const tweet = `Joined #BuildSquad by @NxtWave! Aiming for the 500-student milestone sprint. ⚡ Use my referral code: ${referralCode}\n${twitterUrl}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Share Your Squad Link</h3>
            <p className="text-xs text-slate-400">
              Earn 10 points for every classmate who registers with your link!
            </p>
          </div>
        </div>

        {/* Code display */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">YOUR UNIQUE REFERRAL CODE</span>
            <button
              onClick={() => copyToClipboard(referralCode, true)}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedCode ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
          <div className="text-2xl font-mono font-black text-amber-400 tracking-wider">
            {referralCode}
          </div>
        </div>

        {/* Full Link with Copy Button */}
        <div className="mb-6">
          <label className="text-xs text-slate-400 font-medium block mb-1.5">Direct Invite URL</label>
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-2 pl-3">
            <span className="text-xs text-slate-300 font-mono truncate flex-1">{shareUrl}</span>
            <button
              onClick={() => copyToClipboard(shareUrl, false)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition flex-shrink-0"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedLink ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>

        {/* Quick Social Shares */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Instant 1-Click Social Shares
          </span>
          <div className="grid grid-cols-3 gap-2.5">
            <button
              onClick={shareWhatsApp}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition"
            >
              <MessageCircle className="w-4 h-4 fill-emerald-500/20" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={shareLinkedIn}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/30 text-blue-400 text-xs font-bold transition"
            >
              <Linkedin className="w-4 h-4 fill-blue-500/20" />
              <span>LinkedIn</span>
            </button>
            <button
              onClick={shareTwitter}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-sky-600/15 hover:bg-sky-600/25 border border-sky-500/30 text-sky-400 text-xs font-bold transition"
            >
              <Twitter className="w-4 h-4 fill-sky-500/20" />
              <span>X (Twitter)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
