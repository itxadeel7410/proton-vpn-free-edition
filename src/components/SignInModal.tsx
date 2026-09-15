import React, { useState } from 'react';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (username: string) => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(
      isRegisterMode
        ? 'Generating client-side 4096-bit RSA keys...'
        : 'Verifying Secure Remote Password (SRP) authentication...'
    );

    setTimeout(() => {
      setIsLoading(false);
      const user = username.trim() || 'swiss_guardian';
      onSuccess(user);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-[#13141B] border border-white/10 p-6 sm:p-7 shadow-[0_24px_80px_rgba(0,0,0,0.8)] text-white">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 w-8 h-8 rounded-full bg-[#1e1f26] border border-white/10 flex items-center justify-center text-[#A2A4B5] hover:text-white hover:bg-[#292931] transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#6D4AFF] flex items-center justify-center text-white shadow-[0_0_16px_rgba(109,74,255,0.4)]">
            <span className="material-symbols-outlined text-[20px]">
              {isRegisterMode ? 'person_add' : 'lock'}
            </span>
          </div>
          <div>
            <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white">
              {isRegisterMode ? 'Create Free Proton Identity' : 'Sign In to Proton VPN'}
            </h3>
            <p className="font-['Manrope'] text-[13px] text-[#A2A4B5]">
              No phone number, credit card, or personal data required.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-['JetBrains_Mono'] text-[12px] text-[#A2A4B5] uppercase tracking-wider mb-1.5">
              Proton Username or Email
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6C6F82] text-[18px]">
                alternate_email
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. anonymous_user or user@proton.me"
                className="w-full bg-[#1a1b22] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-[#6C6F82] focus:outline-none focus:border-[#6D4AFF] focus:ring-1 focus:ring-[#6D4AFF] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block font-['JetBrains_Mono'] text-[12px] text-[#A2A4B5] uppercase tracking-wider mb-1.5">
              Passphrase
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6C6F82] text-[18px]">
                key
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Zero-knowledge encrypted password"
                className="w-full bg-[#1a1b22] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-[#6C6F82] focus:outline-none focus:border-[#6D4AFF] focus:ring-1 focus:ring-[#6D4AFF] transition-colors"
              />
            </div>
          </div>

          {statusMessage && (
            <div className="p-3 rounded-lg bg-[#6D4AFF]/15 border border-[#6D4AFF]/30 font-['JetBrains_Mono'] text-[11px] text-[#c9bfff] animate-pulse">
              {statusMessage}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-full bg-[#6D4AFF] hover:bg-[#5a36ea] text-white font-['Manrope'] text-[14px] font-semibold flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(109,74,255,0.4)] transition-all cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isLoading ? 'autorenew' : 'arrow_forward'}
              </span>
              <span>
                {isLoading
                  ? 'Authenticating...'
                  : isRegisterMode
                  ? 'Create Free Account'
                  : 'Access Free Shield'}
              </span>
            </button>
          </div>
        </form>

        {/* Switch mode */}
        <div className="mt-6 pt-4 border-t border-white/10 text-center font-['Manrope'] text-[13px] text-[#A2A4B5]">
          {isRegisterMode ? (
            <p>
              Already have a Proton account?{' '}
              <button
                onClick={() => setIsRegisterMode(false)}
                className="text-[#8E72FF] hover:underline font-semibold"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don’t have an account yet?{' '}
              <button
                onClick={() => setIsRegisterMode(true)}
                className="text-[#00E5FF] hover:underline font-semibold"
              >
                Create 100% Free Account
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
