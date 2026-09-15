import React from 'react';
import { PLATFORMS } from '../data/mockData';

interface DownloadSectionProps {
  onOpenDownload: (platform?: string) => void;
}

export const DownloadSection: React.FC<DownloadSectionProps> = ({ onOpenDownload }) => {
  return (
    <section className="w-full px-4 sm:px-8 py-16 sm:py-20 max-w-[1280px] mx-auto" id="downloads">
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 sm:mb-16">
        <span className="font-['JetBrains_Mono'] text-[11px] font-semibold text-[#00E5FF] uppercase tracking-wider">
          Zero Registration Friction
        </span>
        <h2 className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Download Free For Any Platform
        </h2>
        <p className="font-['Manrope'] text-base text-[#A2A4B5]">
          Get connected in seconds. No billing info, no payment cards, no tracking cookies.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {PLATFORMS.map((plat) => (
          <div
            key={plat.name}
            className="p-6 sm:p-7 rounded-2xl bg-[#13141B] border border-white/10 flex flex-col justify-between hover:border-[#6D4AFF]/60 transition-all group"
          >
            <div className="space-y-4">
              <span className="material-symbols-outlined text-[42px] text-white group-hover:text-[#6D4AFF] transition-colors">
                {plat.iconName}
              </span>
              <h4 className="font-['Space_Grotesk'] text-xl font-bold text-white">
                {plat.name}
              </h4>
              <p className="font-['Manrope'] text-[14px] text-[#A2A4B5] leading-relaxed">
                {plat.description}
              </p>
              <div className="font-['JetBrains_Mono'] text-[11px] text-[#6C6F82]">
                {plat.architecture} • {plat.fileSize}
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => onOpenDownload(plat.name)}
                className="w-full py-3 px-4 rounded-full bg-[#292931] hover:bg-[#6D4AFF] hover:text-white text-white font-['Manrope'] text-[14px] font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_20px_rgba(109,74,255,0.4)] active:scale-98"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                <span>
                  {plat.name === 'Android'
                    ? 'Get APK / Play Store'
                    : plat.name === 'iOS & iPadOS'
                    ? 'Apple App Store'
                    : `Download Free (.${plat.fileName.split('.').pop()})`}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
