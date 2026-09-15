import React from 'react';

interface CtaBannerProps {
  onOpenDownload: (platform?: string) => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onOpenDownload }) => {
  return (
    <section className="w-full px-4 sm:px-8 py-16 sm:py-24 max-w-[1280px] mx-auto">
      <div className="relative rounded-3xl bg-gradient-to-br from-[#1a1b22] via-[#13141B] to-[#1e1f26] p-8 sm:p-14 lg:p-16 border border-white/10 overflow-hidden text-center space-y-6 shadow-2xl">
        {/* Ambient Glows */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#6D4AFF]/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-[#00E5FF]/15 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <span className="font-['JetBrains_Mono'] text-[11px] font-semibold text-[#00D182] uppercase tracking-wider">
            • Free Public Service •
          </span>

          <h2 className="font-['Space_Grotesk'] text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
            Start browsing privately today — 100% free.
          </h2>

          <p className="font-['Manrope'] text-base sm:text-lg text-[#A2A4B5] leading-relaxed">
            No limits. No trackers. No fees. Reclaim your fundamental digital rights with the world's premier open-source encrypted VPN.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onOpenDownload()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#6D4AFF] text-white font-['Manrope'] text-[15px] font-semibold shadow-[0_0_32px_rgba(109,74,255,0.45)] hover:bg-[#5b37ea] hover:shadow-[0_0_48px_rgba(109,74,255,0.7)] active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">download</span>
              <span>Get Proton VPN Free</span>
            </button>
          </div>

          <p className="font-['JetBrains_Mono'] text-[12px] text-[#6C6F82]">
            Backed by Swiss Privacy Law • Audited by Securitum • 0 Logs Certified
          </p>
        </div>
      </div>
    </section>
  );
};
