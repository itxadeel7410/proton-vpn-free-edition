import React from 'react';

interface PlatformStripProps {
  onOpenDownload: (platform?: string) => void;
}

export const PlatformStrip: React.FC<PlatformStripProps> = ({ onOpenDownload }) => {
  const platforms = [
    { name: 'Windows', icon: 'laptop_windows' },
    { name: 'macOS', icon: 'laptop_mac' },
    { name: 'Linux', icon: 'terminal' },
    { name: 'iOS', icon: 'phone_iphone' },
    { name: 'Android', icon: 'phone_android' },
    { name: 'Chrome / Firefox', icon: 'extension' },
  ];

  return (
    <section className="w-full bg-[#13141B] border-y border-white/10 py-4 px-4 sm:px-8">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-['JetBrains_Mono'] text-[11px] text-[#6C6F82] uppercase tracking-wider text-center md:text-left">
          Download Proton Free For All Operating Systems:
        </span>
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[#c9c4d9] font-['Manrope'] text-[14px] font-semibold">
          {platforms.map((p) => (
            <button
              key={p.name}
              onClick={() => onOpenDownload(p.name)}
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer py-1 px-2 rounded hover:bg-white/5"
            >
              <span className="material-symbols-outlined text-[18px] text-[#8E72FF]">{p.icon}</span>
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
