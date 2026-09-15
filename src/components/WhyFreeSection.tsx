import React from 'react';

export const WhyFreeSection: React.FC = () => {
  return (
    <section className="w-full px-4 sm:px-8 py-16 sm:py-20 max-w-[1280px] mx-auto" id="why-free">
      <div className="flex flex-col items-center text-center space-y-3 max-w-3xl mx-auto mb-12">
        <span className="font-['JetBrains_Mono'] text-[11px] font-semibold text-[#8E72FF] uppercase tracking-wider">
          The Proton Philosophy
        </span>
        <h2 className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Unlimited free privacy. Funded by our mission, not your data.
        </h2>
        <p className="font-['Manrope'] text-base sm:text-lg text-[#A2A4B5] leading-relaxed">
          We believe privacy and digital self-determination are fundamental human rights. Unlike commercial competitors who treat free users as products, Proton VPN Free is completely uncompromised.
        </p>
      </div>

      {/* 3 Core Free Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pillar 1 */}
        <div className="p-6 sm:p-7 rounded-2xl bg-[#13141B] border border-white/10 flex flex-col justify-between relative overflow-hidden group hover:border-[#8E72FF]/40 transition-all">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#1e1f26] border border-white/10 flex items-center justify-center text-[#00E5FF] shadow-inner">
              <span className="material-symbols-outlined text-[28px]">all_inclusive</span>
            </div>
            <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white">
              No Data Caps or Artificial Throttling
            </h3>
            <p className="font-['Manrope'] text-[15px] text-[#A2A4B5] leading-relaxed">
              Other VPNs restrict free tiers to 500MB per month to force an upgrade. Proton provides 100% unlimited data volume so you can browse, stream, and communicate continuously without ever seeing a bandwidth meter lock you out.
            </p>
          </div>
          <div className="pt-4 mt-6 border-t border-white/10 font-['JetBrains_Mono'] text-[12px] text-[#00E5FF] font-semibold">
            • 0 GB Data Limits Forever
          </div>
        </div>

        {/* Pillar 2 */}
        <div className="p-6 sm:p-7 rounded-2xl bg-[#13141B] border border-white/10 flex flex-col justify-between relative overflow-hidden group hover:border-[#8E72FF]/40 transition-all">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#1e1f26] border border-white/10 flex items-center justify-center text-[#00D182] shadow-inner">
              <span className="material-symbols-outlined text-[28px]">visibility_off</span>
            </div>
            <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white">
              Zero Logs, Zero Ads, Zero Profile Sales
            </h3>
            <p className="font-['Manrope'] text-[15px] text-[#A2A4B5] leading-relaxed">
              We never record where you go online, what you download, or your destination IP addresses. We do not inject pop-up ads or track user sessions. Our strict no-logs architecture has been independently verified by forensic cybersecurity firm Securitum.
            </p>
          </div>
          <div className="pt-4 mt-6 border-t border-white/10 font-['JetBrains_Mono'] text-[12px] text-[#00D182] font-semibold">
            • Independent Securitum Audit Verified
          </div>
        </div>

        {/* Pillar 3 */}
        <div className="p-6 sm:p-7 rounded-2xl bg-[#13141B] border border-white/10 flex flex-col justify-between relative overflow-hidden group hover:border-[#8E72FF]/40 transition-all">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#1e1f26] border border-white/10 flex items-center justify-center text-[#8E72FF] shadow-inner">
              <span className="material-symbols-outlined text-[28px]">gavel</span>
            </div>
            <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white">
              Swiss Sovereign Jurisdiction
            </h3>
            <p className="font-['Manrope'] text-[15px] text-[#A2A4B5] leading-relaxed">
              Headquartered in Geneva, Proton is protected by the Swiss Federal Data Protection Act (FADP). We are immune to 14-Eyes intelligence alliances, National Security Letters, and court orders originating in the US or European Union.
            </p>
          </div>
          <div className="pt-4 mt-6 border-t border-white/10 font-['JetBrains_Mono'] text-[12px] text-[#8E72FF] font-semibold">
            • Outside 14-Eyes • Geneva, Switzerland
          </div>
        </div>
      </div>
    </section>
  );
};
